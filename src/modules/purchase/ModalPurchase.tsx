/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Input, message, Spin } from 'antd';
import { getSignatureTokenSaleRound } from 'apis/tokenSaleRounds';
import Button from 'common/components/button';
import Loading from 'common/components/loading';
import ModalCustom from 'common/components/modals';
import BigNumber from 'bignumber.js';
import {
	BNB_CURRENCY,
	BUSD_CURRENCY,
	ROYALTY_FEE_PURCHASE,
} from 'common/constants/constants';
import { formatNumber, fromWei, toWei } from 'common/utils/functions';
import { debounce, get } from 'lodash';
import { ITokenSaleRoundState } from 'pages/token-presale-rounds';
import { FC, useCallback, useEffect, useState } from 'react';
import NumericInput from './NumericInput';
import {
	NEXT_PUBLIC_BUSD,
	NEXT_PUBLIC_PRESALE_POOL,
} from 'web3/contracts/instance';
import {
	buyTokenWithExactlyBNB,
	buyTokenWithExactlyBUSD,
	convertBNBtoBUSD,
	convertBUSDtoBNB,
	getPresaleTokenTax,
	getTokenAmountFromBUSD,
} from 'web3/contracts/useContractTokenSale';
import {
	handleUserApproveERC20,
	isUserApprovedERC20,
} from 'web3/contracts/useBep20Contract';
import { getNonces } from 'modules/mint-dnft/services';
import { useAppSelector } from 'stores';
import { useContract } from 'web3/contracts/useContract';
import { AbiPresalepool } from 'web3/abis/types';
import PresalePoolAbi from 'web3/abis/abi-presalepool.json';
import { useActiveWeb3React } from 'web3/hooks';
import { handleWriteMethodError } from 'common/helpers/handleError';
import { LoadingOutlined } from '@ant-design/icons';

interface IModalPurchaseProps {
	isShow: boolean;
	onCancel: () => void;
	currency: string;
	exchangeRate: number;
	exchangeRateConvert: string;
	detailSaleRound: ITokenSaleRoundState | undefined;
	handleGetUserPurchasedAmount: (saleRoundId: number) => void;
	getDetailSaleRound: () => void;
	maxPreSaleAmount: number;
	youBought: number;
	totalSoldAmount: number;
}

const ModalPurchase: FC<IModalPurchaseProps> = ({
	isShow,
	onCancel,
	currency,
	exchangeRate,
	exchangeRateConvert,
	detailSaleRound = {},
	handleGetUserPurchasedAmount,
	maxPreSaleAmount,
	youBought,
	getDetailSaleRound,
	totalSoldAmount,
}) => {
	const [form] = Form.useForm();
	const { addressWallet, balance } = useAppSelector((state) => state.wallet);
	const [amountGXC, setAmountGXC] = useState<string | any>('');
	const [amount, setAmount] = useState<string>('');
	const [buyLimit, setBuyLimit] = useState<string>('');
	const [isLoadingCallGXZ, setLoadingCallGXZ] = useState<boolean>(false);
	const [isLoading, setLoading] = useState<boolean>(false);

	let checkValidate = true;
	const presaleContract = useContract<AbiPresalepool>(
		PresalePoolAbi,
		NEXT_PUBLIC_PRESALE_POOL
	);
	const { account } = useActiveWeb3React();

	useEffect(() => {
		form.resetFields();
		setAmountGXC('');
		setAmount('');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isShow, currency]);

	useEffect(() => {
		if (!amount) {
			form.resetFields();
			setLoadingCallGXZ(false);
		}
	}, [amount, form]);

	useEffect(() => {
		handleGetBuylimit();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [detailSaleRound, currency]);

	const handleGetBuylimit = async () => {
		const buyLimitBUSD = fromWei(get(detailSaleRound, 'details.buy_limit', 0));
		let buyLimit = buyLimitBUSD;
		if (currency === BNB_CURRENCY) {
			const [buyLimitBNB] = await convertBUSDtoBNB(buyLimit);
			buyLimit = Number(buyLimitBNB) as any;
		}
		setBuyLimit(buyLimit);
	};

	const onChangeAmount = (amount: string) => {
		if (Number(amount) > 0) {
			setLoadingCallGXZ(true);
		}
		setAmount(amount);
		debounceChangeAmount(amount);
	};

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const debounceChangeAmount = useCallback(
		debounce((nextAmount) => {
			if (currency === BNB_CURRENCY) {
				handleChangeBNB(nextAmount);
			} else {
				handleChangeBUSD(nextAmount);
			}
		}, 800),
		[exchangeRate, currency]
	);

	const handleChangeBUSD = async (value: string | null) => {
		if (!value) {
			value = '0';
			form.setFieldValue('amountGXC', '');
			setAmountGXC('');
			return;
		}
		const newValue = new BigNumber(value.replace(/,/g, ''));
		setAmount(newValue.toString());
		const [amountGXC, error] = await getTokenAmountFromBUSD(
			newValue.toNumber(),
			exchangeRate
		);
		setLoadingCallGXZ(false);
		if (error) {
			return handleWriteMethodError(error);
		}
		form.setFieldValue('amountGXC', formatNumber(amountGXC));
		setAmountGXC(amountGXC);
		if (
			new BigNumber(amountGXC as any).gt(
				new BigNumber(maxPreSaleAmount).minus(totalSoldAmount)
			)
		) {
			checkValidate = false;
			form.setFields([
				{
					name: 'amount',
					errors: [
						`The round only have ${formatNumber(
							new BigNumber(maxPreSaleAmount).minus(
								new BigNumber(totalSoldAmount)
							)
						)} Galactix tokens left to be purchased`,
					],
				},
			]);
		} else {
			checkValidate = true;
		}
	};

	const handleChangeBNB = async (value: string | null) => {
		if (!value) {
			value = '0';
			form.setFieldValue('amountGXC', '');
			setAmountGXC('');
			return;
		}
		const newValue = new BigNumber(value.replace(/,/g, ''));
		setAmount(newValue.toString());
		const [amountBUSD] = await convertBNBtoBUSD(newValue.toNumber());
		const [amountGXC, error] = await getTokenAmountFromBUSD(
			Number(amountBUSD),
			exchangeRate
		);
		setLoadingCallGXZ(false);
		if (error) {
			return handleWriteMethodError(error);
		}
		form.setFieldValue('amountGXC', formatNumber(amountGXC));
		setAmountGXC(amountGXC);
		if (
			new BigNumber(amountGXC as any).gt(
				new BigNumber(maxPreSaleAmount).minus(totalSoldAmount)
			)
		) {
			checkValidate = false;
			form.setFields([
				{
					name: 'amount',
					errors: [
						`The round only have ${formatNumber(
							new BigNumber(maxPreSaleAmount).minus(
								new BigNumber(totalSoldAmount)
							)
						)} Galactix tokens left to be purchased`,
					],
				},
			]);
		} else {
			checkValidate = true;
		}
	};

	const onFinish = () => {
		if (!checkValidate) return handleChangeBUSD(amount);
		handleBuyToken();
	};

	const handleBuyToken = async () => {
		const saleRoundId = get(detailSaleRound, 'sale_round');
		const amountTranform = amount.replace(/,/g, '');
		if (!saleRoundId || !account || !presaleContract) return;
		setLoading(true);
		const presaleNonces = await getNonces(presaleContract, account);
		const [presaleTokenTax] = await getPresaleTokenTax(Number(amountTranform));
		if (currency === BUSD_CURRENCY) {
			const params = {
				amount: toWei(amountTranform),
				sale_round_id: saleRoundId,
				nonce: presaleNonces,
			};
			const [dataSignature] = await getSignatureTokenSaleRound(params);
			const signature = get(dataSignature, 'data.signature', '');
			const isUserApproved = await isUserApprovedERC20(
				NEXT_PUBLIC_BUSD,
				addressWallet,
				Number(amountTranform) + Number(presaleTokenTax),
				NEXT_PUBLIC_PRESALE_POOL
			);
			if (!isUserApproved) {
				const [, error] = await handleUserApproveERC20(
					NEXT_PUBLIC_BUSD,
					NEXT_PUBLIC_PRESALE_POOL
				);
				if (error as any) {
					setLoading(false);
					handleWriteMethodError(error);
				}
			}
			const [resBuyWithBUSD, errorBuyWithBUSD] = await buyTokenWithExactlyBUSD(
				saleRoundId,
				addressWallet,
				Number(amountTranform),
				signature
			);
			if (resBuyWithBUSD) {
				setLoading(false);
				onCancel();
				handleGetUserPurchasedAmount(saleRoundId);
				message.success(redirectToBSCScan(resBuyWithBUSD?.transactionHash));
				getDetailSaleRound();
			}
			if (errorBuyWithBUSD) {
				setLoading(false);
				handleWriteMethodError(errorBuyWithBUSD);
			}
		} else {
			//convert BNB sang BUSD
			const isUserApproved = await isUserApprovedERC20(
				NEXT_PUBLIC_BUSD,
				addressWallet,
				Number(presaleTokenTax),
				NEXT_PUBLIC_PRESALE_POOL
			);
			if (!isUserApproved) {
				const [, error] = await handleUserApproveERC20(
					NEXT_PUBLIC_BUSD,
					NEXT_PUBLIC_PRESALE_POOL
				);
				if (error) {
					setLoading(false);
					handleWriteMethodError(error);
				}
			}
			const [amountToBUSD] = await convertBNBtoBUSD(Number(amountTranform));
			const params = {
				amount: toWei(amountToBUSD),
				sale_round_id: saleRoundId,
				nonce: presaleNonces,
			};
			const [dataSignature] = await getSignatureTokenSaleRound(params);
			const signature = get(dataSignature, 'data.signature', '');
			const [resBuyWithBNB, errorBuyWithBNB] = await buyTokenWithExactlyBNB(
				saleRoundId,
				addressWallet,
				signature,
				Number(amountTranform)
			);
			3;
			if (resBuyWithBNB) {
				setLoading(false);
				onCancel();
				handleGetUserPurchasedAmount(saleRoundId);
				message.success(redirectToBSCScan(resBuyWithBNB?.transactionHash));
				getDetailSaleRound();
			}
			if (errorBuyWithBNB) {
				setLoading(false);
				handleWriteMethodError(errorBuyWithBNB);
			}
		}
	};

	const redirectToBSCScan = (tx: string) => (
		<span>
			<a
				target={'_blank'}
				href={`${process.env.NEXT_PUBLIC_BSC_BLOCK_EXPLORER_URL}/tx/${tx}`}
				rel='noreferrer'
			>
				Transaction Completed
			</a>
		</span>
	);

	const validateToken = async (_: unknown, value: string) => {
		const amount = new BigNumber(value.replace(/,/g, ''));
		const { busdBalance, bnbBalance } = balance;
		const royaltyFee = amount.times(ROYALTY_FEE_PURCHASE);
		const amountOfTokensPurchased = new BigNumber(youBought).times(
			exchangeRateConvert
		);

		if (currency === BUSD_CURRENCY && amount.gt(new BigNumber(busdBalance))) {
			return Promise.reject(new Error("You don't have enough BUSD"));
		} else if (
			currency === BNB_CURRENCY &&
			amount.gt(new BigNumber(bnbBalance))
		) {
			return Promise.reject(new Error("You don't have enough BNB"));
		} else if (
			(currency === BUSD_CURRENCY &&
				new BigNumber(busdBalance).lt(amount.plus(royaltyFee))) ||
			(currency === BNB_CURRENCY && new BigNumber(busdBalance).lt(royaltyFee))
		) {
			return Promise.reject(
				new Error(`You don't have enough BUSD in wallet for Tax fee`)
			);
		} else if (
			Number(buyLimit) !== 0 &&
			amount.gt(new BigNumber(buyLimit).minus(amountOfTokensPurchased))
		) {
			return Promise.reject(
				new Error(
					`User can only purchase maximum ${formatNumber(buyLimit)} ${currency}`
				)
			);
		} //....
		if (checkValidate) {
			form.setFields([
				{
					name: 'amount',
					errors: [],
				},
			]);
		}
		return Promise.resolve();
	};

	const antIconLoading = (
		<LoadingOutlined style={{ fontSize: 16, marginRight: '8px' }} spin />
	);

	return (
		<ModalCustom
			key={`presaleround-token-${isShow}`}
			isShow={isShow}
			onCancel={onCancel}
			customClass={
				'text-center w-full !max-w-[calc(100%_-_2rem)] desktop:w-[520px]'
			}
		>
			<div className={'p-4 desktop:p-8'}>
				<div className='font-semibold text-[32px] mb-8'>Token Purchase</div>
				{isLoading ? (
					<Loading />
				) : (
					<>
						<div className='text-gray-20 text-base font-normal mb-6'>
							Choose the amount of token you want to purchase
						</div>
						<Form
							name='verify-email'
							layout='vertical'
							onFinish={onFinish}
							onFinishFailed={() => {}}
							autoComplete='off'
							initialValues={{}}
							className='flex justify-center flex-col'
							form={form}
						>
							<div className='mb-2'>
								<Form.Item
									label=''
									name='amount'
									rules={[
										{ required: true, message: 'This field is required' },
										{ validator: validateToken },
									]}
								>
									<NumericInput
										className='custom-input-wrapper'
										placeholder='1,000.1234'
										onChange={onChangeAmount}
										onBlur={() => {}}
										addonAfter={<div className='w-[90px]'>{currency}</div>}
										value={amount}
									/>
								</Form.Item>
							</div>
							<Form.Item label='' name='amountGXC'>
								<Input
									placeholder='1,000.1234'
									className='custom-input-wrapper'
									addonAfter={
										<div className='w-[90px] flex justify-center'>
											{isLoadingCallGXZ && <Spin indicator={antIconLoading} />}{' '}
											GXZ
										</div>
									}
									value={amountGXC}
									disabled
								/>
							</Form.Item>
							<Button
								isDisabled={
									!amount || Number(amount) === 0 || Number(amountGXC) === 0
								}
								classCustom='bg-purple-30 !rounded-[40px] mx-auto !w-[200px] mt-4'
								htmlType='submit'
								label='Buy'
							/>
						</Form>
					</>
				)}
			</div>
		</ModalCustom>
	);
};

export default ModalPurchase;
