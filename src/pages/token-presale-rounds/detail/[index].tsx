import { Divider, Progress, RadioChangeEvent } from 'antd';
import {
	checkUserWhitelist,
	getDetailTokenSaleRound,
} from 'apis/tokenSaleRounds';
import BoxPool from 'common/components/boxPool';
import Button from 'common/components/button';
import Countdown from 'common/components/countdown';
import Loading from 'common/components/loading';
import ModalCustom from 'common/components/modals';
import CustomRadio from 'common/components/radio';
import Stepper from 'common/components/steps';
import {
	BNB_CURRENCY,
	BUSD_CURRENCY,
	BUY,
	CLAIMABLE,
	END,
	GXZ_CURRENCY,
	HEX_ZERO,
	TIME_LINE_SALE_ROUND,
	TYPE_SALE_ROUND,
	UPCOMING,
} from 'common/constants/constants';
import {
	convertHexToNumber,
	convertTimeLine,
	convertTimeStampToDate,
	formatNumber,
	fromWei,
} from 'common/utils/functions';
import { get, isEmpty } from 'lodash';
import ModalPurchase from 'modules/purchase/ModalPurchase';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
	claimPurchasedToken,
	convertBUSDtoBNB,
	getSalePhaseInfo,
	getUserPurchasedAmount,
} from 'web3/contracts/useContractTokenSale';

export const selectList = [
	{
		label: <div className='select-card-wrapper'>{BUSD_CURRENCY}</div>,
		value: BUSD_CURRENCY,
	},
	{
		label: <div className='select-card-wrapper'>{BNB_CURRENCY}</div>,
		value: BNB_CURRENCY,
	},
];

const TokenSaleRoundDetail = () => {
	const router = useRouter();
	const {
		query: { index = '' },
	} = router;

	const [detailSaleRound, setDetailSaleRound] = useState<any>({});
	const [statusTimeLine, setStatusTimeLine] = useState<string>(UPCOMING);
	const [timeCountDow, setTimeCountDow] = useState<number>(0);
	const [totalSoldAmount, setTotalSoldAmount] = useState<number>(0);
	const [maxPreSaleAmount, setMaxPreSaleAmount] = useState<number>(0);
	const [maxBUSDUserCanSpend, setMaxBUSDUserCanSpend] = useState<number>(0);
	const [currency, setCurrency] = useState<string>(BUSD_CURRENCY);
	const [price, setPrice] = useState<number>(0);
	const [youBought, setYouBought] = useState<number>(0);
	const [youCanClaimAmount, setYouCanClaimAmount] = useState<number>(0);
	const [isOpenTokenPurchase, setOpenTokenPurchase] = useState<boolean>(false);
	const [isOpenClaimPopup, setOpenClaimPopup] = useState<boolean>(false);
	const [isWhitelist, setWhitelist] = useState<boolean>(false);

	const { addressWallet } = useSelector((state) => state.wallet);
	const { isLogin } = useSelector((state) => state.user);
	const { start_time = 0, end_time = 0 } = get(detailSaleRound, 'buy_time', {});
	const saleRoundId = get(detailSaleRound, 'sale_round');

	useEffect(() => {
		const getDetailSaleRound = async () => {
			const [data] = await getDetailTokenSaleRound(index as string);
			const detailSaleRound = get(data, 'data', {});
			const { start_time, end_time } = get(detailSaleRound, 'buy_time', {});
			const timestampNow = moment().unix();
			const { status, timeCountDow } = convertTimeLine(
				start_time,
				end_time,
				timestampNow
			);
			const exchangeRateBUSD = fromWei(
				get(detailSaleRound, 'exchange_rate', 0)
			);
			setStatusTimeLine(
				get(detailSaleRound, 'current_status_timeline') === 'end' ? END : status
			);
			setTimeCountDow(timeCountDow);
			setDetailSaleRound(detailSaleRound);
			setPrice(exchangeRateBUSD);
		};
		if (index && isEmpty(detailSaleRound)) {
			getDetailSaleRound();
		}
	}, [index, detailSaleRound]);

	useEffect(() => {
		if (!isEmpty(detailSaleRound)) {
			const { claim_configs } = detailSaleRound;
			if (statusTimeLine === CLAIMABLE) {
				const timestampNow = moment().unix();
				claim_configs.forEach(
					(claimConfig: { max_claim: number; start_time: number }) => {
						const { start_time } = claimConfig;
						if (start_time > timestampNow) {
							setTimeCountDow(start_time - timestampNow);
							return;
						}
					}
				);
			}
		}
	}, [statusTimeLine, detailSaleRound]);

	useEffect(() => {
		if (!isEmpty(detailSaleRound)) {
			const { sale_round } = detailSaleRound;
			handleGetSalePhaseInfo(sale_round);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [detailSaleRound]);

	useEffect(() => {
		if (!isEmpty(detailSaleRound)) {
			const saleRoundId = get(detailSaleRound, 'sale_round');

			if (statusTimeLine !== UPCOMING) {
				handleGetUserPurchasedAmount(saleRoundId);
			}
			//call check token user can claim
			if (statusTimeLine === CLAIMABLE || statusTimeLine === END) {
				handleGetUserClaimedAmount(saleRoundId);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [detailSaleRound, statusTimeLine, addressWallet, index]);

	useEffect(() => {
		if (!isEmpty(detailSaleRound)) {
			if (
				statusTimeLine === CLAIMABLE ||
				(statusTimeLine === BUY && addressWallet && index)
			) {
				handleCheckUserWhitelist(addressWallet, index as string);
			}
		}
	}, [detailSaleRound, statusTimeLine, addressWallet, index]);

	// const getDetailSaleRound = async () => {
	// 	const [data] = await getDetailTokenSaleRound(index as string);
	// 	const detailSaleRound = get(data, 'data', {});
	// 	const { start_time, end_time } = get(detailSaleRound, 'buy_time', {});
	// 	const timestampNow = moment().unix();
	// 	const { status, timeCountDow } = convertTimeLine(
	// 		start_time,
	// 		end_time,
	// 		timestampNow
	// 	);
	// 	const priceBUSD = fromWei(get(detailSaleRound, 'exchange_rate', 0));
	// 	console.log('priceBUSD', priceBUSD);

	// 	setStatusTimeLine(status);
	// 	setTimeCountDow(timeCountDow);
	// 	setDetailSaleRound(detailSaleRound);
	// 	setPrice(priceBUSD);
	// };

	const handleGetUserPurchasedAmount = async (saleRoundId: number) => {
		const [youBought] = await getUserPurchasedAmount(
			addressWallet,
			saleRoundId
		);
		setYouBought(youBought);
	};

	const handleGetUserClaimedAmount = async (saleRoundId: number) => {
		const [youCanClaimAmount] = await getUserPurchasedAmount(
			addressWallet,
			saleRoundId
		);
		setYouCanClaimAmount(youCanClaimAmount);
	};

	const handleCheckUserWhitelist = async (address: string, index: string) => {
		const [resCheckWhitelist] = await checkUserWhitelist({
			address: address,
			type: TYPE_SALE_ROUND,
			id: index,
		});
		const isInWhiteList = get(resCheckWhitelist, 'data.isInWhiteList', false);
		setWhitelist(isInWhiteList);
	};

	const handleGetSalePhaseInfo = async (saleRoundId: number) => {
		const [resSalePhaseInfo] = await getSalePhaseInfo(saleRoundId);
		const totalSoldAmount = convertHexToNumber(
			get(resSalePhaseInfo, 'totalSoldAmount._hex', HEX_ZERO)
		);
		const maxPreSaleAmount = convertHexToNumber(
			get(resSalePhaseInfo, 'maxPreSaleAmount._hex', HEX_ZERO)
		);
		const maxBUSDUserCanSpend = convertHexToNumber(
			get(resSalePhaseInfo, 'maxBUSDUserCanSpend._hex', HEX_ZERO)
		);
		setTotalSoldAmount(fromWei(totalSoldAmount));
		setMaxPreSaleAmount(fromWei(maxPreSaleAmount));
		setMaxBUSDUserCanSpend(fromWei(maxBUSDUserCanSpend));
	};

	const renderTokenBuyTime = (startTime: number, endTime: number) => {
		return `${convertTimeStampToDate(startTime)} - ${convertTimeStampToDate(
			endTime
		)}`;
	};

	const handleSelectCurrency = async (event: RadioChangeEvent) => {
		const { value } = event.target;
		setCurrency(value);
		if (value === BNB_CURRENCY) {
			const [priceBNB] = await convertBUSDtoBNB(price);
			setPrice(priceBNB);
		} else {
			const priceBUSD = fromWei(get(detailSaleRound, 'exchange_rate', 0));
			setPrice(priceBUSD);
		}
	};

	const handleClaimToken = async () => {
		setOpenClaimPopup(true);
		const [resClamin, errorClaim] = await claimPurchasedToken(saleRoundId);
		if (resClamin || errorClaim) {
			setOpenClaimPopup(false);
		}
	};

	const renderPriceBuyInfoUpComing = () => {
		return (
			<>
				<div>
					<div className='flex gap-x-2'>
						Price
						<CustomRadio
							onChange={handleSelectCurrency}
							defaultValue={currency}
							options={selectList}
						/>
					</div>
					<div className='text-base font-semibold mt-2'>{`${formatNumber(
						price
					)} ${currency}`}</div>
				</div>
				{youBought > 0 && (
					<div className='border-x-[1px] border-gray-30 px-8 '>
						<div className='text-sm font-normal text-gray-40 mb-2'>
							You bought
						</div>
						<div className='text-base font-semibold'>{`${formatNumber(
							youBought
						)} ${GXZ_CURRENCY}`}</div>
					</div>
				)}
			</>
		);
	};

	const renderPriceBuyInfoClaimableAndEnd = () => {
		return (
			<>
				{youBought > 0 && (
					<div className='pr-8'>
						<div className='text-sm font-normal text-gray-40 mb-2'>
							You bought
						</div>
						<div className='text-base font-semibold'>{`${formatNumber(
							youBought
						)} ${GXZ_CURRENCY}`}</div>
					</div>
				)}
				{youCanClaimAmount > 0 && (
					<div className='border-x-[1px] border-gray-30 px-8'>
						<div className='text-sm font-normal text-gray-40 mb-2 '>
							You can claim
						</div>
						<div className='text-base font-semibold'>{`${formatNumber(
							youCanClaimAmount
						)} ${GXZ_CURRENCY}`}</div>
					</div>
				)}
			</>
		);
	};

	return (
		<div className='flex flex-col gap-y-8'>
			<div className='flex gap-x-8 justify-between'>
				<BoxPool title='Pool Timeline' customClass='w-[50%] bg-gray-50'>
					<div className='py-6'>
						<Stepper steps={TIME_LINE_SALE_ROUND} activeStep={statusTimeLine} />
					</div>
					<Countdown
						millisecondsRemain={timeCountDow}
						title='You can buy tokens in'
						// callBackApi={getDetailSaleRound}
					/>
				</BoxPool>
				<BoxPool
					title='Buy Info'
					customClass='w-[50%] flex flex-col bg-gray-50'
				>
					<div className='pt-6 flex'>
						<div className='flex justify-between w-full'>
							{statusTimeLine === UPCOMING || statusTimeLine === BUY
								? renderPriceBuyInfoUpComing()
								: renderPriceBuyInfoClaimableAndEnd()}
							{statusTimeLine === BUY && isLogin && isWhitelist && (
								<Button
									onClick={() => setOpenTokenPurchase(true)}
									label='Buy'
									classCustom='buy-token'
								/>
							)}
							{statusTimeLine === CLAIMABLE && isLogin && isWhitelist && (
								<Button
									onClick={handleClaimToken}
									label='claim'
									classCustom='buy-token'
								/>
							)}
						</div>
					</div>
					<div className='mt-auto'>
						<div className='text-sm text font-normal'>Buy Progress:</div>
						<Progress
							strokeColor={{
								'0%': '#9E90F3',
								'100%': '#9E90F3',
							}}
							percent={
								maxPreSaleAmount > 0
									? Math.floor((totalSoldAmount / maxPreSaleAmount) * 100)
									: 0
							}
							showInfo={false}
						/>
						<div className='flex justify-between'>
							<div>{`${
								maxPreSaleAmount > 0
									? Math.floor((totalSoldAmount / maxPreSaleAmount) * 100)
									: 0
							}%`}</div>
							<div>{`${formatNumber(
								totalSoldAmount
							)}/${maxPreSaleAmount}`}</div>
						</div>
					</div>
				</BoxPool>
			</div>
			<BoxPool title='Pool Details' customClass='w-full bg-gray-50'>
				<div className='py-9 flex gap-x-6 text-sm'>
					<div className='w-[50%]'>
						<div className='flex gap-x-2 mb-4'>
							<div className='text-dim-gray font-normal'>Token Buy Time:</div>
							<div className='font-medium'>
								{start_time && end_time
									? renderTokenBuyTime(start_time, end_time)
									: 'TBA'}
							</div>
						</div>
						<div className='flex gap-x-2'>
							<div className='text-dim-gray font-normal'>Token Claim Time:</div>
							<div className='font-medium'>TBA</div>
						</div>
					</div>
					<div className='w-[50%]'>
						<div className='flex gap-x-2 mb-4'>
							<div className='text-dim-gray font-normal'>Total Raise:</div>
							<div className='font-medium'>
								{formatNumber(maxPreSaleAmount)}
							</div>
						</div>
						<div className='flex gap-x-2'>
							<div className='text-dim-gray font-normal'>Token Max Buy:</div>
							<div className='font-medium'>
								{formatNumber(maxBUSDUserCanSpend)}
							</div>
						</div>
					</div>
				</div>
				<Divider className='bg-black-velvet mt-0' />
				<div className='text-sm text-dim-gray font-medium'>
					Round Information:
				</div>
			</BoxPool>
			<ModalPurchase
				isShow={isOpenTokenPurchase}
				onCancel={() => setOpenTokenPurchase(false)}
				currency={currency}
				exchangeRate={price}
				detailSaleRound={detailSaleRound}
				handleGetUserPurchasedAmount={handleGetUserPurchasedAmount}
			/>
			<ModalCustom
				isShow={isOpenClaimPopup}
				onCancel={() => setOpenClaimPopup(false)}
				customClass='text-center'
			>
				<Loading />
			</ModalCustom>
		</div>
	);
};

export default TokenSaleRoundDetail;
