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
	TITLE_TIME_COUNTDOWN,
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
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
	claimPurchasedToken,
	convertBUSDtoBNB,
	getRemainingClaimableAmount,
	getSalePhaseInfo,
	getUserClaimedAmount,
	getUserPurchasedAmount,
} from 'web3/contracts/useContractTokenSale';
import { buyTimeDefault, ITokenSaleRoundState } from '..';
import usePrevious from 'common/hooks/usePrevious';

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

interface claimConfig {
	max_claim: string | number;
	start_time: string | number;
}

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
	const [claimedAmount, setClaimedAmount] = useState<number>(0);
	const [titleTimeCountDown, setTitleTimeCountDown] = useState<string>(
		TITLE_TIME_COUNTDOWN.UPCOMING
	);
	const [totalSoldAmount, setTotalSoldAmount] = useState<number>(0);
	const [maxPreSaleAmount, setMaxPreSaleAmount] = useState<number>(0);
	const [currency, setCurrency] = useState<string>(BUSD_CURRENCY);
	const [price, setPrice] = useState<number>(0);
	const [youBought, setYouBought] = useState<number>(0);
	const [youCanClaimAmount, setYouCanClaimAmount] = useState<number>(0);
	const [isOpenTokenPurchase, setOpenTokenPurchase] = useState<boolean>(false);
	const [isOpenClaimPopup, setOpenClaimPopup] = useState<boolean>(false);
	const [isWhitelist, setWhitelist] = useState<boolean>(false);
	const [isLoading, setLoading] = useState<boolean>(false);
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
	const prevLoading = usePrevious(isLoading);

	const isShowButtonBuy =
		statusTimeLine === BUY &&
		isLogin &&
		isWhitelist &&
		isCurrentSaleRound &&
		detailSaleRound?.current_status_timeline !== 'claimable_upcoming';

	const isShowButtonClaim =
		statusTimeLine === CLAIMABLE &&
		isLogin &&
		isWhitelist &&
		youCanClaimAmount > 0;

	const getDetailSaleRound = useCallback(async () => {
		if (isLoading || !index) return;
		setLoading(true);
		const [data, error] = await getDetailTokenSaleRound(index as string);
		if (error) {
			return setLoading(false);
		}
		const detailSaleRound = get(data, 'data', {});
		const { claim_configs, current_status_timeline } = detailSaleRound;
		const { start_time, end_time } = get(detailSaleRound, 'buy_time');
		const timestampNow = dayjs().unix();
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
		setLoading(false);
	}, [index, isLoading]);

	const handleClaimToken = async () => {
		setOpenClaimPopup(true);
		const [resClamin, errorClaim] = await claimPurchasedToken(saleRoundId);
		if (resClamin) {
			getDetailSaleRound();
			message.success('Transaction Completed');
			setOpenClaimPopup(false);
		}
		if (errorClaim) {
			setOpenClaimPopup(false);
			message.error('Transaction Rejected');
		}
	};

	useEffect(() => {
		if (index && !prevLoading) {
			getDetailSaleRound();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [index, detailSaleRound, isLoading, isLogin]);

	useEffect(() => {
		checkTitleTimeCountdown(statusTimeLine);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [statusTimeLine, claimedAmount]);

	useEffect(() => {
		if (!isEmpty(detailSaleRound)) {
			const { sale_round } = detailSaleRound;
			handleGetSalePhaseInfo(sale_round);
			if (youBought) {
				getClaimableAmount(addressWallet, sale_round);
			}
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [detailSaleRound, youBought]);

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

	const getClaimableAmount = async (address: string, saleRoundId: number) => {
		const timestampNow = dayjs().unix();
		const claimConfigs = get(
			detailSaleRound,
			'claim_configs',
			[]
		) as Array<claimConfig>;
		const [totalClaimedAmount] = await getUserClaimedAmount(
			address,
			saleRoundId
		);
		let claimableRate = 0;
		for (let i = 0; i < claimConfigs.length; i++) {
			if (timestampNow >= Number(claimConfigs[i].start_time)) {
				claimableRate += Number(claimConfigs[i].max_claim);
			}
		}
		const claimedAmount =
			youBought * (claimableRate / 10000) - totalClaimedAmount;
		setClaimedAmount(claimedAmount);
	};

	const handleGetUserPurchasedAmount = async (saleRoundId: number) => {
		const [youBought, error] = await getUserPurchasedAmount(
			addressWallet,
			saleRoundId
		);
		if (error) return setYouBought(0);
		setYouBought(youBought);
	};

	const handleGetUserClaimedAmount = async (saleRoundId: number) => {
		const [youCanClaimAmount, error] = await getRemainingClaimableAmount(
			addressWallet,
			saleRoundId
		);
		if (error) {
			return setYouCanClaimAmount(0);
		}
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

	const checkTitleTimeCountdown = async (statusTimeLine: string) => {
		let title = TITLE_TIME_COUNTDOWN.UPCOMING;
		if (statusTimeLine === BUY) {
			title = TITLE_TIME_COUNTDOWN.BUY;
		} else if (statusTimeLine === CLAIMABLE) {
			const claimConfigs = get(
				detailSaleRound,
				'claim_configs',
				[]
			) as Array<claimConfig>;
			if (claimConfigs.length === 1) {
				// nếu chỉ có 1 time claim sẽ lấy luôn youbought vì max laim percent là 100%
				title = TITLE_TIME_COUNTDOWN.CLAIMABLE_ONE_TIME_ONLY.replace(
					'amount',
					`${formatNumber(youBought)}`
				);
			} else {
				title = TITLE_TIME_COUNTDOWN.CLAIMABLE_MORE_THAN.replace(
					'amount',
					`${formatNumber(claimedAmount.toFixed(2))}`
				);
			}
		} else if (statusTimeLine === END) {
			title = TITLE_TIME_COUNTDOWN.END;
		} else {
			title = TITLE_TIME_COUNTDOWN.UPCOMING;
		}
		setTitleTimeCountDown(title);
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

	const renderInprogessBuy = () => {
		const buyProgess = Math.floor((totalSoldAmount / maxPreSaleAmount) * 100);
		return (
			<>
				<div className='text-sm text font-normal'>Buy Progress:</div>
				<Progress
					strokeColor={{
						'0%': '#40bbfd',
						'7%': '#36C1FF',
						'47%': '#77A3F8',
						'71%': '#BD81F1',
						'100%': '#CF79EE',
					}}
					trailColor='#ffffff0d'
					percent={buyProgess > 0 ? buyProgess : 0}
					showInfo={false}
					status='active'
				/>
				<div className='flex justify-between'>
					<div>{`${buyProgess > 0 ? buyProgess : 0}%`}</div>
					<div>{`${formatNumber(totalSoldAmount)}/${formatNumber(
						maxPreSaleAmount
					)}`}</div>
				</div>
			</>
		);
	};

	const renderInprogessClaim = () => {
		const totalClaimed = youBought - youCanClaimAmount;
		const claimProgess = Math.floor((totalClaimed / youBought) * 100);

		return (
			<>
				<div className='text-sm text font-normal'>Claim Progress:</div>
				<Progress
					strokeColor={{
						'0%': '#40bbfd',
						'7%': '#36C1FF',
						'47%': '#77A3F8',
						'71%': '#BD81F1',
						'100%': '#CF79EE',
					}}
					trailColor='#ffffff0d'
					percent={claimProgess > 0 ? claimProgess : 0}
					showInfo={false}
					status='active'
				/>
				<div className='flex justify-between'>
					<div>{`${claimProgess > 0 ? claimProgess : 0}%`}</div>
					<div>{`${formatNumber(totalClaimed)}/${formatNumber(
						youBought
					)}`}</div>
				</div>
			</>
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
						title={titleTimeCountDown}
						callBackApi={getDetailSaleRound}
					/>
				</BoxPool>
				<BoxPool
					title='Buy Info'
					customClass='desktop:w-[50%] flex flex-col bg-gray-50'
				>
					<div className='pt-6 flex'>
						<div className='flex justify-between w-full'>
							{(statusTimeLine === UPCOMING || statusTimeLine === BUY) &&
								renderPriceBuyInfoUpComing()}
							{statusTimeLine === CLAIMABLE && renderPriceBuyInfoClaimable()}
							{statusTimeLine === END && renderPriceBuyInfoEnd()}
							{isShowButtonBuy && (
								<Button
									onClick={() => setOpenTokenPurchase(true)}
									label='Buy'
									classCustom='buy-token'
								/>
							)}
							{isShowButtonClaim && (
								<Button
									onClick={handleClaimToken}
									label='Claim'
									classCustom='buy-token'
								/>
							)}
						</div>
					</div>
					<div className='mt-auto'>
						{statusTimeLine === BUY && renderInprogessBuy()}
						{statusTimeLine === CLAIMABLE && renderInprogessClaim()}
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
				getDetailSaleRound={getDetailSaleRound}
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
