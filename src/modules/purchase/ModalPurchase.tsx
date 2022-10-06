import { Form, Input, InputRef, message } from 'antd';
import { getSignatureTokenSaleRound } from 'apis/tokenSaleRounds';
import Button from 'common/components/button';
import Loading from 'common/components/loading';
import ModalCustom from 'common/components/modals';
import { BUSD_CURRENCY } from 'common/constants/constants';
import { formatNumber, fromWei } from 'common/utils/functions';
import { get } from 'lodash';
import { ITokenSaleRoundState } from 'pages/token-presale-rounds';
import { FC, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { NEXT_PUBLIC_BUSD } from 'web3/contracts/instance';
import {
	buyTokenWithExactlyBNB,
	buyTokenWithExactlyBUSD,
	getTokenAmountFromBUSD,
} from 'web3/contracts/useContractTokenSale';
import {
	handleUserApproveERC20,
	isUserApprovedERC20,
} from 'web3/contracts/useErc20Contract';

interface IModalPurchaseProps {
	isShow: boolean;
	onCancel: () => void;
	currency: string;
	exchangeRate: number;
	detailSaleRound: ITokenSaleRoundState | undefined;
	handleGetUserPurchasedAmount: (saleRoundId: number) => void;
	maxPreSaleAmount: number;
	youBought: number;
}

const ModalPurchase: FC<IModalPurchaseProps> = ({
	isShow,
	onCancel,
	currency,
	exchangeRate,
	detailSaleRound = {},
	handleGetUserPurchasedAmount,
	maxPreSaleAmount,
	youBought,
}) => {
	const [form] = Form.useForm();
	const { addressWallet, balance } = useSelector((state) => state.wallet);
	const [amountGXC, setAmountGXC] = useState<number>(0);
	const [amount, setAmount] = useState<number>(0);
	const [isLoading, setLoading] = useState<boolean>(false);
	const amountBUSDRef = useRef<InputRef | null>(null);

	useEffect(() => {
		if (isShow) {
			setTimeout(() => {
				amountBUSDRef?.current?.focus();
			}, 300);
		}

		if (!isShow) {
			setAmountGXC(0);
			setAmount(0);
			form.setFieldValue('amountGXC', '');
			form.setFieldValue('amount', '');
		}
	}, [isShow, form]);

	const handleChangeBUSD = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const value = event.target.valueAsNumber;
		setAmount(value);
		const [amountGXC] = await getTokenAmountFromBUSD(value, exchangeRate);
		form.setFieldValue('amountGXC', formatNumber(amountGXC));
		setAmountGXC(amountGXC);
		if (amountGXC > maxPreSaleAmount - youBought) {
			form.setFields([
				{
					name: 'amount',
					errors: [
						`The round only have ${
							maxPreSaleAmount - youBought
						} Galactix tokens left to be purchased`,
					],
				},
			]);
		} else {
			form.setFields([
				{
					name: 'amount',
					errors: [],
				},
			]);
		}
	};

	const onFinish = () => {
		handleBuyToken();
	};

	const handleBuyToken = async () => {
		const saleRoundId = get(detailSaleRound, 'sale_round');
		const params = {
			amount: amount,
			sale_round_id: saleRoundId,
		};
		const [dataSignature] = await getSignatureTokenSaleRound(params);
		const signature = get(dataSignature, 'data.signature', '');
		setLoading(true);
		if (currency === BUSD_CURRENCY) {
			const isUserApproved = await isUserApprovedERC20(
				NEXT_PUBLIC_BUSD,
				addressWallet,
				amount
			);
			if (!isUserApproved) {
				const [, error] = await handleUserApproveERC20(NEXT_PUBLIC_BUSD);
				if (error) {
					return;
				}
			}
			const [resBuyWithBUSD, errorBuyWithBUSD] = await buyTokenWithExactlyBUSD(
				saleRoundId,
				addressWallet,
				amount,
				signature
			);

			if (resBuyWithBUSD) {
				setLoading(false);
				onCancel();
				handleGetUserPurchasedAmount(saleRoundId);
				message.success('Transaction Completed');
			}
			if (errorBuyWithBUSD) {
				setLoading(false);
				message.error('Transaction Rejected');
			}
		} else {
			const [resBuyWithBNB, errorBuyWithBNB] = await buyTokenWithExactlyBNB(
				saleRoundId,
				addressWallet,
				signature,
				amount
			);
			if (resBuyWithBNB) {
				setLoading(false);
				onCancel();
				handleGetUserPurchasedAmount(saleRoundId);
				message.success('Transaction Completed');
			}
			if (errorBuyWithBNB) {
				setLoading(false);
				message.error('Transaction Rejected');
			}
		}
	};

	const validateToken = (_: any, value: string) => {
		const { busdBalance } = balance;
		const buyLimit = fromWei(get(detailSaleRound, 'details.buy_limit', 0));

		if (!value) {
			return Promise.resolve();
		} else if (
			currency === BUSD_CURRENCY &&
			Number(value) > Number(busdBalance)
		) {
			return Promise.reject(new Error('Insufficient amount!'));
		} else if (
			currency === BUSD_CURRENCY &&
			buyLimit !== 0 &&
			Number(value) > buyLimit - youBought
		) {
			return Promise.reject(
				new Error(
					`User can only purchase maximum ${formatNumber(buyLimit)} BUSD`
				)
			);
		} else {
			return Promise.resolve();
		}
	};

	return (
		<ModalCustom
			isShow={isShow}
			onCancel={onCancel}
			customClass={'text-center w-full max-w-[95%] desktop:w-[520px]'}
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
							<Form.Item label='' name='amountGXC'>
								<Input
									placeholder='1,000.1234'
									className='custom-input-wrapper'
									addonAfter={<div>GXC</div>}
									value={amountGXC}
									disabled
								/>
							</Form.Item>
							<Form.Item
								label=''
								name='amount'
								rules={[
									{ required: true, message: 'This field is required' },
									{ validator: validateToken },
								]}
							>
								<Input
									ref={amountBUSDRef}
									placeholder='1,000.1234'
									className='custom-input-wrapper'
									addonAfter={<div>{currency}</div>}
									onChange={handleChangeBUSD}
									value={amount}
									type='number'
								/>
							</Form.Item>
							<Button
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
