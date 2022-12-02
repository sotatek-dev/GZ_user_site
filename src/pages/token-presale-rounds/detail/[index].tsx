/* eslint-disable @typescript-eslint/no-explicit-any */
import { Divider, message, Progress, RadioChangeEvent } from 'antd';
import {
	checkUserWhitelist,
	getDetailTokenSaleRound,
	getSignatureTokenSaleRoundSpecial,
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
	toWei,
} from 'common/utils/functions';
import { get, isEmpty } from 'lodash';
import ModalPurchase from 'modules/purchase/ModalPurchase';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import {
	buyTokenWithoutFee,
	claimPurchasedToken,
	convertBUSDtoBNB,
	getNonces,
	getRemainingClaimableAmount,
	getSalePhaseInfo,
	getUserClaimedAmount,
	getUserPurchasedAmount,
} from 'web3/contracts/useContractTokenSale';
import { buyTimeDefault, ITokenSaleRoundState } from '..';
import usePrevious from 'common/hooks/usePrevious';
import { useAppSelector } from 'stores';
import { handleWriteMethodError } from 'common/helpers/handleError';

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
	const [priceRender, setPriceRender] = useState<string>('0');
	const [youBought, setYouBought] = useState<number>(0);
	const [youCanClaimAmount, setYouCanClaimAmount] = useState<number>(0);
	const [isOpenTokenPurchase, setOpenTokenPurchase] = useState<boolean>(false);
	const [isOpenClaimPopup, setOpenClaimPopup] = useState<boolean>(false);
	const [isWhitelist, setWhitelist] = useState<boolean>(false);
	const [isLoading, setLoading] = useState<boolean>(false);
	const buyLimit = get(detailSaleRound, 'details.buy_limit');
	const { addressWallet } = useAppSelector((state) => state.wallet);
	const { isLogin } = useAppSelector((state) => state.user);
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
		Number(price) === 0
			? statusTimeLine === BUY &&
			  isLogin &&
			  isWhitelist &&
			  isCurrentSaleRound &&
			  Number(price) === 0 &&
			  Number(youBought) === 0 &&
			  statusTimeLine === BUY && // case
			  detailSaleRound?.current_status_timeline !== 'claimable_upcoming'
			: statusTimeLine === BUY &&
			  isLogin &&
			  isWhitelist &&
			  isCurrentSaleRound &&
			  Number(totalSoldAmount) !== Number(maxPreSaleAmount) &&
			  Number(totalSoldAmount) <= Number(maxPreSaleAmount) &&
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
		const { claim_configs, current_status_timeline, sale_round } =
			detailSaleRound;
		const { start_time, end_time } = get(detailSaleRound, 'buy_time');
		const timestampNow = dayjs().unix();
		const { status, timeCountDown, startTimeClaim } = await convertTimeLine(
			Number(start_time),
			Number(end_time),
			timestampNow,
			current_status_timeline,
			claim_configs,
			addressWallet,
			sale_round
		);
		const exchangeRateBUSD = fromWei(get(detailSaleRound, 'exchange_rate', 0));

		setPrice(Number(exchangeRateBUSD));
		setStatusTimeLine(status);
		setDetailSaleRound(detailSaleRound);
		setTokenClaimTime(startTimeClaim);
		setTimeCountDow(timeCountDown);
		setLoading(false);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [index, isLoading, addressWallet]);

	const handleClaimToken = async () => {
		setOpenClaimPopup(true);
		const [resClamin, errorClaim] = await claimPurchasedToken(saleRoundId);
		if (resClamin) {
			getDetailSaleRound();
			message.success(redirectToBSCScan(resClamin?.transactionHash));
			setOpenClaimPopup(false);
		}
		if (errorClaim) {
			setOpenClaimPopup(false);
			handleWriteMethodError(errorClaim);
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

	useEffect(() => {
		if (index && !prevLoading) {
			getDetailSaleRound();
		}
		calculatorCurrency(currency);
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
			youBought * (claimableRate / 10000) - Number(totalClaimedAmount);
		setClaimedAmount(claimedAmount);
	};

	const handleGetUserPurchasedAmount = async (saleRoundId: number) => {
		const [youBought, error] = await getUserPurchasedAmount(
			addressWallet,
			saleRoundId
		);
		if (error) return setYouBought(0);
		setYouBought(Number(youBought));
	};

	const handleGetUserClaimedAmount = async (saleRoundId: number) => {
		const [youCanClaimAmount, error] = await getRemainingClaimableAmount(
			addressWallet,
			saleRoundId
		);
		if (error) {
			return setYouCanClaimAmount(0);
		}
		setYouCanClaimAmount(Number(youCanClaimAmount));
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

		setTotalSoldAmount(fromWei(totalSoldAmount) as any);
		setMaxPreSaleAmount(fromWei(maxPreSaleAmount) as any);
	};

	const renderTokenBuyTime = (startTime: number, endTime: number) => {
		return `${convertTimeStampToDate(startTime)} - ${convertTimeStampToDate(
			endTime
		)}`;
	};

	const handleSelectCurrency = async (event: RadioChangeEvent) => {
		const { value } = event.target;
		setCurrency(value);
		await calculatorCurrency(value);
	};

	const calculatorCurrency = async (val: string) => {
		if (val === BNB_CURRENCY) {
			const [priceBNB] = await convertBUSDtoBNB(price);
			if (Number(priceBNB) === 0) {
				return setPriceRender('0');
			} else if (Number(priceBNB) < 0.0001) {
				return setPriceRender('< 0.0001');
			} else {
				return setPriceRender(formatNumber(Number(priceBNB)));
			}
		} else {
			const priceBUSD = fromWei(get(detailSaleRound, 'exchange_rate', 0));
			setPriceRender(formatNumber(Number(priceBUSD)));
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

	const handleBuyToken = async () => {
		const exchangeRateBUSD = fromWei(get(detailSaleRound, 'exchange_rate', 0));
		if (!saleRoundId) return;
		if (Number(exchangeRateBUSD) === 0) {
			const [nonce] = await getNonces(addressWallet);
			const params = {
				amount: toWei(0),
				sale_round_id: saleRoundId,
				nonce: nonce,
			};

			const [dataSignature] = await getSignatureTokenSaleRoundSpecial(params);
			const signature = get(dataSignature, 'data._signature', '');
			const numberOfCandidate = get(
				dataSignature,
				'data._numberOfCandidate',
				''
			);
			const [resBuyWithFree, errorBuyWithFree] = await buyTokenWithoutFee(
				saleRoundId,
				addressWallet,
				numberOfCandidate,
				signature
			);
			if (resBuyWithFree) {
				message.success(redirectToBSCScan(resBuyWithFree?.transactionHash));
				getDetailSaleRound();
				return;
			}
			if (errorBuyWithFree) {
				handleWriteMethodError(errorBuyWithFree);
			}
		} else {
			setOpenTokenPurchase(true);
		}
	};

	const renderPriceBuyInfoUpComing = () => {
		return (
			<>
				<div className='flex flex-col gap-2'>
					<div className='flex gap-x-[10px] items-center text-gray-40'>
						Price
						<CustomRadio
							onChange={handleSelectCurrency}
							defaultValue={currency}
							options={selectList}
						/>
					</div>
					<div className='text-base font-semibold desktop:pt-[0rem] desktop:pb-0 pb-4 pt-[0.625rem]'>{`${priceRender} ${currency}`}</div>
				</div>
				{youBought > 0 && (
					<div className='desktop:border-x-[1px] desktop:border-y-[0px] border-y-[1px] border-gray-30 desktop:px-8'>
						<div className='text-sm font-normal text-gray-40 mb-2 whitespace-nowrap desktop:pt-0 pt-4'>
							You bought
						</div>
						<div className='text-base font-semibold desktop:pb-0 pb-4'>{`${formatNumber(
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
						<div className='text-base font-semibold desktop:pb-0 pb-4'>{`${formatNumber(
							youBought
						)} ${GXZ_CURRENCY}`}</div>
					</div>
				)}
				{youCanClaimAmount > 0 && (
					<div className='desktop:border-l-[1px] desktop:border-l-[0px] border-l-[1px] border-gray-30 desktop:px-8'>
						<div className='text-sm font-normal text-gray-40 mb-2 whitespace-nowrap desktop:pt-0 pt-4'>
							You can claim
						</div>
						<div className='text-base font-semibold desktop:pb-0 pb-4'>{`${formatNumber(
							youCanClaimAmount
						)} ${GXZ_CURRENCY}`}</div>
					</div>
				)}
			</>
		);
	};

	const renderPriceBuyInfoEnd = () => {
		return (
			<div className='flex flex-col justify-between h-ful'>
				<div>
					<div className='text-sm font-normal text-gray-40 mb-2 '>
						You can claim
					</div>
					<div className='text-base font-semibold'>{`${formatNumber(
						youCanClaimAmount
					)} ${GXZ_CURRENCY}`}</div>
				</div>
				<div>
					<div className='text-sm font-normal text-gray-40 mb-2 '>
						Total Buy
					</div>
					<div className='text-base font-semibold'>
						{`${formatNumber(totalSoldAmount)}/${formatNumber(
							maxPreSaleAmount
						)} ${GXZ_CURRENCY}`}
					</div>
				</div>
			</div>
		);
	};

	const renderInprogessBuy = () => {
		const buyProgess = Math.floor((totalSoldAmount / maxPreSaleAmount) * 100);

		return (
			<>
				<div className='text-sm text font-normal pb-2'>Buy Progress:</div>
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
				<div className='flex justify-between pt-[0.313rem]'>
					<div className='text-[#36C1FF]'>{`${
						buyProgess > 0 ? buyProgess : 0
					}%`}</div>
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
				<div className='text-sm text font-normal pb-2'>Claim Progress:</div>
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
				<div className='flex justify-between pt-[0.313rem]'>
					<div className='text-[#36C1FF]'>{`${
						claimProgess > 0 ? claimProgess : 0
					}%`}</div>
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
					<div className='pt-[1.688rem] h-full'>
						<div className='flex justify-between w-full h-full desktop:flex-row flex-col'>
							{(statusTimeLine === UPCOMING || statusTimeLine === BUY) &&
								renderPriceBuyInfoUpComing()}
							{statusTimeLine === CLAIMABLE && renderPriceBuyInfoClaimable()}
							{statusTimeLine === END && renderPriceBuyInfoEnd()}
							{(isShowButtonBuy || isShowButtonClaim) && (
								<div className='flex desktop:py-0 py-[1.563rem] desktop:items-center desktop:justify-center justify-end'>
									{isShowButtonBuy && (
										<Button
											onClick={handleBuyToken}
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
							)}
						</div>
					</div>
					<div
						className={`mt-auto desktop:pt-0 ${
							!isShowButtonBuy && !isShowButtonClaim && 'pt-[0.563rem]'
						}`}
					>
						{statusTimeLine === BUY && renderInprogessBuy()}
						{statusTimeLine === CLAIMABLE && renderInprogessClaim()}
					</div>
				</BoxPool>
			</div>
			<BoxPool title='Pool Details' customClass='w-full bg-gray-50'>
				<div className='py-9 flex flex-col desktop:flex-row gap-6 text-sm'>
					<div className='flex flex-col gap-6 desktop:gap-4 desktop:w-[50%]'>
						<div className='flex gap-x-2 mb-4'>
							<div className='text-[#36C1FF] desktop:text-[#FFFFFF80] font-normal whitespace-nowrap'>
								Token Buy Time:
							</div>
							<div className='font-medium'>
								{start_time && end_time
									? renderTokenBuyTime(start_time, end_time)
									: 'TBA'}
							</div>
						</div>
						<div className='flex gap-x-2'>
							{tokenClaimTime > 0 && (
								<>
									<div className='text-[#36C1FF] desktop:text-[#FFFFFF80] font-normal whitespace-nowrap'>
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
							<div className='text-[#36C1FF] desktop:text-[#FFFFFF80] font-normal whitespace-nowrap'>
								Available to Purchase:
							</div>
							<div className='font-medium'>
								{formatNumber(
									fromWei(get(detailSaleRound, 'token_info.total_sold_coin', 0))
								)}{' '}
								{GXZ_CURRENCY}
							</div>
						</div>
						<div className='flex gap-x-2'>
							<div className='text-[#36C1FF] desktop:text-[#FFFFFF80] font-normal whitespace-nowrap'>
								Buy Limit:
							</div>
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
							<div className='text-[#36C1FF] desktop:text-[#FFFFFF80] font-normal whitespace-pre whitespace-nowrap'>
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
				exchangeRateConvert={Number(priceRender)}
				detailSaleRound={detailSaleRound}
				maxPreSaleAmount={maxPreSaleAmount}
				youBought={youBought}
				totalSoldAmount={totalSoldAmount}
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
