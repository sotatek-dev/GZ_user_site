import { Divider, message, Progress, RadioChangeEvent } from 'antd';
import {
	checkUserWhitelist,
	getDetailTokenSaleRound,
} from 'apis/tokenSaleRounds';
import BoxPool from 'common/components/boxPool';
import Button from 'common/components/button';
import Countdown from 'common/components/countdown';
import HelmetCommon from 'common/components/helmet';
import Loading from 'common/components/loading';
import ModalCustom from 'common/components/modals';
import CustomRadio from 'common/components/radio';
import ReactGa from 'react-ga';
import Stepper from 'common/components/steps';
import {
	BNB_CURRENCY,
	BUSD_CURRENCY,
	BUY,
	CLAIMABLE,
	END,
	GXZ_CURRENCY,
	HEX_ZERO,
	ROUTES,
	TIME_LINE_SALE_ROUND,
	TYPE_SALE_ROUND,
	UPCOMING,
} from 'common/constants/constants';
import {
	convertHexToNumber,
	convertTimeLine,
	convertTimeStampToDate,
	formatBignumberToNumber,
	formatNumber,
	fromWei,
} from 'common/utils/functions';
import { get, isEmpty } from 'lodash';
import ModalPurchase from 'modules/purchase/ModalPurchase';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
	claimPurchasedToken,
	convertBUSDtoBNB,
	getSalePhaseInfo,
	getUserPurchasedAmount,
} from 'web3/contracts/useContractTokenSale';
import { buyTimeDefault, ITokenSaleRoundState } from '..';

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

	const [detailSaleRound, setDetailSaleRound] = useState<
		ITokenSaleRoundState | undefined
	>();
	const [statusTimeLine, setStatusTimeLine] = useState<string>(UPCOMING);
	const [timeCountDow, setTimeCountDow] = useState<number>(-1);
	const [tokenClaimTime, setTokenClaimTime] = useState<number>(0);
	const [totalSoldAmount, setTotalSoldAmount] = useState<number>(0);
	const [maxPreSaleAmount, setMaxPreSaleAmount] = useState<number>(0);
	const [currency, setCurrency] = useState<string>(BUSD_CURRENCY);
	const [price, setPrice] = useState<number>(0);
	const [youBought, setYouBought] = useState<number>(0);
	const [youCanClaimAmount, setYouCanClaimAmount] = useState<number>(0);
	const [isOpenTokenPurchase, setOpenTokenPurchase] = useState<boolean>(false);
	const [isOpenClaimPopup, setOpenClaimPopup] = useState<boolean>(false);
	const [isWhitelist, setWhitelist] = useState<boolean>(false);
	const buyLimit = get(detailSaleRound, 'details.buy_limit');
	const { addressWallet } = useSelector((state) => state.wallet);
	const { isLogin } = useSelector((state) => state.user);
	const { start_time, end_time } = get(
		detailSaleRound,
		'buy_time',
		buyTimeDefault
	);
	const isCurrentSaleRound = get(
		detailSaleRound,
		'is_current_sale_round',
		false
	);
	const saleRoundId = get(detailSaleRound, 'sale_round');

	const isShowButtonBuy =
		statusTimeLine === BUY &&
		isLogin &&
		isWhitelist &&
		isCurrentSaleRound &&
		detailSaleRound?.current_status_timeline !== 'claimable_upcoming';

	const getDetailSaleRound = useCallback(async () => {
		const [data] = await getDetailTokenSaleRound(index as string);
		const detailSaleRound = get(data, 'data', {});
		const { claim_configs, current_status_timeline } = detailSaleRound;
		const { start_time, end_time } = get(detailSaleRound, 'buy_time');
		const timestampNow = moment().unix();
		const { status, timeCountDown, startTimeClaim } = convertTimeLine(
			Number(start_time),
			Number(end_time),
			timestampNow,
			current_status_timeline,
			claim_configs
		);
		const exchangeRateBUSD = fromWei(get(detailSaleRound, 'exchange_rate', 0));
		setStatusTimeLine(status);
		setDetailSaleRound(detailSaleRound);
		setPrice(exchangeRateBUSD);
		setTokenClaimTime(startTimeClaim);
		setTimeCountDow(timeCountDown);
	}, [index]);

	useEffect(() => {
		if (index && isEmpty(detailSaleRound)) {
			getDetailSaleRound();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [index, detailSaleRound]);

	useEffect(() => {
		ReactGa.initialize(process?.env?.NEXT_PUBLIC_GA_TRACKING_CODE || '');
		// to report page view Google Analytics
		ReactGa.pageview(router?.pathname || '');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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
		setTotalSoldAmount(fromWei(totalSoldAmount));
		setMaxPreSaleAmount(fromWei(maxPreSaleAmount));
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
		if (resClamin) {
			message.success('Transaction Completed');
			setOpenClaimPopup(false);
		}
		if (errorClaim) {
			setOpenClaimPopup(false);
			message.error('Transaction Rejected');
		}
	};

	const renderPriceBuyInfoUpComing = () => {
		return (
			<>
				<HelmetCommon
					title='Token presale rounds detail'
					description='Description token presale rounds detail...'
					href={ROUTES.TOKEN_PRESALE_ROUNDS_DETAIL}
				/>
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

	const renderPriceBuyInfoClaimable = () => {
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

	const renderPriceBuyInfoEnd = () => {
		return (
			<div className='border-x-[1px] border-gray-30 px-8'>
				<div className='text-sm font-normal text-gray-40 mb-2 '>
					You can claim
				</div>
				<div className='text-base font-semibold'>{`${formatNumber(
					youCanClaimAmount
				)} ${GXZ_CURRENCY}`}</div>
			</div>
		);
	};

	return (
		<div className='flex flex-col gap-2.5 desktop:gap-8'>
			<div className='flex flex-col desktop:flex-row gap-2.5 desktop:gap-8 justify-between'>
				<BoxPool
					title='Pool Timeline'
					customClass='w-full desktop:w-[50%] bg-gray-50'
				>
					<div className='py-6'>
						<Stepper steps={TIME_LINE_SALE_ROUND} activeStep={statusTimeLine} />
					</div>
					<Countdown
						millisecondsRemain={timeCountDow}
						title='You can buy tokens in'
						callBackApi={getDetailSaleRound}
					/>
				</BoxPool>
				<BoxPool
					title='Buy Info'
					customClass='desktop:w-[50%] flex flex-col bg-gray-50'
				>
					<div className='pt-6 flex'>
						<div className='flex justify-between w-full'>
							{statusTimeLine === UPCOMING ||
								(statusTimeLine === BUY && renderPriceBuyInfoUpComing())}
							{statusTimeLine === CLAIMABLE && renderPriceBuyInfoClaimable()}
							{statusTimeLine === END && renderPriceBuyInfoEnd()}
							{isShowButtonBuy && (
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
				<div className='py-9 flex flex-col desktop:flex-row gap-6 text-sm'>
					<div className='flex flex-col gap-6 desktop:gap-4 desktop:w-[50%]'>
						<div className='flex gap-x-2 mb-4'>
							<div className='text-dim-gray font-normal'>Token Buy Time:</div>
							<div className='font-medium'>
								{start_time && end_time
									? renderTokenBuyTime(start_time, end_time)
									: 'TBA'}
							</div>
						</div>
						<div className='flex gap-x-2'>
							{tokenClaimTime > 0 && (
								<>
									<div className='text-dim-gray font-normal'>
										Token Claim Time:
									</div>
									<div className='font-medium'>
										{convertTimeStampToDate(tokenClaimTime)}
									</div>
								</>
							)}
						</div>
					</div>
					<div className='flex flex-col gap-6 desktop:gap-4 desktop:w-[50%]'>
						<div className='flex gap-x-2 mb-4'>
							<div className='text-dim-gray font-normal'>Total Raise:</div>
							<div className='font-medium'>
								{formatNumber(
									fromWei(get(detailSaleRound, 'token_info.total_sold_coin', 0))
								)}{' '}
								{GXZ_CURRENCY}
							</div>
						</div>
						<div className='flex gap-x-2'>
							<div className='text-dim-gray font-normal'>Buy Limit:</div>
							<div className='font-medium'>
								{buyLimit > 0
									? `${formatBignumberToNumber(buyLimit)} ${BUSD_CURRENCY}`
									: 'No Limit'}
							</div>
						</div>
					</div>
				</div>
				<Divider className='bg-black-velvet mt-0' />
				<div className='flex gap-x-2'>
					{detailSaleRound?.description && (
						<>
							<div className='text-dim-gray font-normal whitespace-pre'>
								Round Information:
							</div>
							<div className='font-medium'>{detailSaleRound?.description}</div>
						</>
					)}
				</div>
			</BoxPool>
			<ModalPurchase
				isShow={isOpenTokenPurchase}
				onCancel={() => setOpenTokenPurchase(false)}
				currency={currency}
				exchangeRate={price}
				detailSaleRound={detailSaleRound}
				maxPreSaleAmount={maxPreSaleAmount}
				youBought={youBought}
				handleGetUserPurchasedAmount={handleGetUserPurchasedAmount}
			/>
			<ModalCustom
				isShow={isOpenClaimPopup}
				onCancel={() => setOpenClaimPopup(false)}
				customClass='text-center'
			>
				<div className='font-semibold text-[32px] mb-8'>Claiming Token</div>
				<Loading />
			</ModalCustom>
		</div>
	);
};

export default TokenSaleRoundDetail;
