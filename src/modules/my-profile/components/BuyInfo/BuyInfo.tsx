import { useEffect, useState } from 'react';
import { get } from 'lodash';
import dayjs from 'dayjs';
import Image from 'next/image';
import { message, Skeleton } from 'antd';
import BoxPool from 'common/components/boxPool';
import Countdown from 'common/components/countdown';
import CustomRadio from 'common/components/radio';
import { formatCurrency } from 'common/helpers/number';
import myProfileConstants from 'modules/my-profile/constant';
import { useBuyDKeyNFT } from 'modules/my-profile/services/useBuyDKeyNFT';
import { useAppDispatch, useAppSelector } from 'stores';
import { getMyProfileRD } from 'stores/myProfile';
import KeyNftAbi from 'web3/abis/abi-keynft.json';
import PresalePoolAbi from 'web3/abis/abi-presalepool.json';
import { AbiKeynft, AbiPresalepool } from 'web3/abis/types';
import {
	NEXT_PUBLIC_KEYNFT,
	NEXT_PUBLIC_PRESALE_POOL,
} from 'web3/contracts/instance';
import { useContract } from 'web3/contracts/useContract';
import { useNativeBalance } from 'web3/hooks';
import { useBalance } from 'web3/queries';
import Button from '../Button';
import Token2BuyRadio from '../Token2BuyRadio';
import { BuyStatus, buyStatusConfigs, Token2Buy } from './BuyInfo.constants';
import {
	fetchMinDnftToBuyKey,
	fetchStartBuyKeyTime,
} from 'stores/key-dnft/key-dnft.thunks';

export default function BuyInfo() {
	const dispatch = useAppDispatch();
	const keyNftContract = useContract<AbiKeynft>(KeyNftAbi, NEXT_PUBLIC_KEYNFT);
	const presalePoolContract = useContract<AbiPresalepool>(
		PresalePoolAbi,
		NEXT_PUBLIC_PRESALE_POOL
	);
	const { userInfo, dnft_holding_count } = useAppSelector(
		(state) => state.myProfile
	);
	const { systemSetting, busd2Bnb, keyPriceBusd } = useAppSelector(
		(state) => state.systemSetting
	);
	const {
		startBuyKeyTime: startBuyKeyUnixTime,
		loading: isGetStartBuyKeyTime,
		minDnftToBuyKey,
	} = useAppSelector((state) => state.keyDnft);

	useEffect(() => {
		if (!keyNftContract) return;

		dispatch(fetchMinDnftToBuyKey(keyNftContract));
		dispatch(fetchStartBuyKeyTime(keyNftContract));
	}, [dispatch, keyNftContract]);

	// BUSD balance
	const busdBalance = useBalance(process.env.NEXT_PUBLIC_BUSD_ADDRESS || '');
	const bnbBalance = useNativeBalance();

	const { buyDKeyNFT, isBuyDNFT } = useBuyDKeyNFT();
	const [tokenCode, setTokenCode] = useState(Token2Buy.BUSD);

	const handleBuyKey = async () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
		const [tx, _]: any = await buyDKeyNFT({
			keyPrice: keyPriceBusd?.toNumber(),
			token2Buy: tokenCode,
		});
		if (tx) {
			message.success(redirectToBSCScan(tx && tx?.transactionHash));
		}

		dispatch(getMyProfileRD({ presalePoolContract, keyNftContract }));
	};

	const isEnoughRoyalty = () => {
		let isEnoughRoyalty = false;

		if (tokenCode === Token2Buy.BUSD) {
			isEnoughRoyalty =
				!!keyPriceBusd && keyPriceBusd.times(1.08).lte(busdBalance);
		}

		if (tokenCode === Token2Buy.BNB && busd2Bnb) {
			isEnoughRoyalty =
				!!keyPriceBusd && keyPriceBusd.times(0.08).lte(busdBalance);
		}

		return isEnoughRoyalty;
	};

	const isEnoughBalance = () => {
		let isEnoughBalance = false;
		if (tokenCode === Token2Buy.BUSD) {
			isEnoughBalance = !!keyPriceBusd && keyPriceBusd.lte(busdBalance);
		}

		if (tokenCode === Token2Buy.BNB && busd2Bnb) {
			isEnoughBalance =
				!!keyPriceBusd && busd2Bnb.times(keyPriceBusd).lte(bnbBalance);
		}

		return isEnoughBalance;
	};

	const { actualStartBuyKeyTime, mintKeyDays } = getActualStartBuyKeyTime(
		startBuyKeyUnixTime || 0,
		systemSetting?.mint_days || 0
	);

	const { timeLeft, buyKeyStatus } = getTimeLeftToBuyKey(
		actualStartBuyKeyTime,
		mintKeyDays
	);

	const isOnBuyKeyTime = buyKeyStatus === BuyKeyState.Available;

	const getBuyKeyState = () => {
		if (
			!userInfo ||
			!systemSetting ||
			!startBuyKeyUnixTime ||
			minDnftToBuyKey == undefined
		) {
			return buyStatusConfigs[BuyStatus.Unavailable];
		}

		if (!isOnBuyKeyTime) {
			return buyStatusConfigs[BuyStatus.Upcomming];
		}

		if (dnft_holding_count < minDnftToBuyKey) {
			return buyStatusConfigs[BuyStatus.NFTRequired];
		}

		if (!isEnoughRoyalty()) {
			return buyStatusConfigs[BuyStatus.NotEnoughRoyalty];
		}

		if (!isEnoughBalance()) {
			return buyStatusConfigs[BuyStatus.NotEnoughBalance];
		}

		return buyStatusConfigs[BuyStatus.Available];
	};

	const getPrice = () => {
		if (tokenCode === Token2Buy.BUSD) {
			return keyPriceBusd;
		}

		return busd2Bnb && keyPriceBusd && busd2Bnb.times(keyPriceBusd);
	};

	const price = getPrice()?.toNumber();
	const buyKeyState = getBuyKeyState();

	const isEnableBuyKey = isEnoughRoyalty() && isEnoughBalance();

	const renderCountdown = () => {
		if (isGetStartBuyKeyTime === 'pending') {
			return (
				<>
					<Skeleton title={false} active style={{ marginTop: '1rem' }} />
					<br />
					<br />
					<Skeleton.Input size='large' active />
				</>
			);
		}

		return (
			<Countdown
				descriptionStyle='!text-[#ffffff80] !text-[12px] !leading-4 '
				boxStyle='!bg-[#8080801a] !text-[white]'
				titleStyle='!font-normal !text-[#ffffff80]'
				customClass='mt-[20px] '
				title={
					isOnBuyKeyTime
						? myProfileConstants.ON_BUY_KEY_TIME
						: myProfileConstants.NOT_ON_BUY_KEY_TIME
				}
				millisecondsRemain={timeLeft}
			/>
		);
	};

	const renderBuyInfo = () => {
		if (!buyKeyState) {
			return <Skeleton.Input active block style={{ height: '46px' }} />;
		}

		return (
			<div className={buyKeyState.boxStyle}>
				<Image src={buyKeyState.icon} width='20' height='20' alt='' />
				<p className={`${buyKeyState.messageStyle} text-[0.875rem]`}>
					{buyKeyState.message}
				</p>
			</div>
		);
	};

	return (
		<BoxPool customClass='desktop:w-[50%]'>
			<h5 className='text-[18px] font-semibold text-white  pb-[27px]'>
				Buy Info
			</h5>
			{renderBuyInfo()}

			<div className='flex items-center  justify-between  mt-6 text-[#ffffff80] pb-[24px] border-b-[2px] border-[#ffffff12]'>
				<div className='flex items-center'>
					<div className='text-[14px] mr-[10px]'>Price:</div>
					<CustomRadio
						onChange={(e) => setTokenCode(e.target.value)}
						options={token2BuyOptions}
						defaultValue={tokenCode}
					/>
				</div>

				{price && (
					<div className='text-[16px] text-[white] font-semibold'>
						{formatCurrency(price)} {tokenCode}
					</div>
				)}
			</div>
			{renderCountdown()}

			{get(buyKeyState, 'canBuy') && isOnBuyKeyTime && (
				<Button
					loading={isBuyDNFT}
					onClick={handleBuyKey}
					disabled={!isEnableBuyKey}
				>
					Buy
				</Button>
			)}
		</BoxPool>
	);
}

export const token2BuyOptions = [
	{
		label: <Token2BuyRadio token={Token2Buy.BUSD} />,
		value: Token2Buy.BUSD,
	},
	{
		label: <Token2BuyRadio token={Token2Buy.BNB} />,
		value: Token2Buy.BNB,
	},
];

const redirectToBSCScan = (tx: string) => (
	<span>
		<a
			target={'_blank'}
			href={`${process.env.NEXT_PUBLIC_BSC_BLOCK_EXPLORER_URL}/tx/${tx}`}
			rel='noreferrer'
		>
			{myProfileConstants.TRANSACTION_COMPLETED}
		</a>
	</span>
);

/**
 * Calculate start buy key time base on minting days setting & available time
 * @param startBuyKeyTime from this tmme, `Minting key` feature will be online, in `Unix timestamp`
 */
const getActualStartBuyKeyTime = (
	buyKeyStartTime: number,
	mintKeyDays: number
) => {
	const startBuyKeyTime = dayjs.unix(buyKeyStartTime);

	const maxDayInCurrentMonth = startBuyKeyTime.daysInMonth();
	const startBuyKeyDate = startBuyKeyTime.date();

	// If set mint_days = 31, but days_in_month is 28/29/30 days
	let maxAvaiMintKeyDays = Math.min(mintKeyDays, maxDayInCurrentMonth);

	if (startBuyKeyDate <= maxAvaiMintKeyDays) {
		return {
			actualStartBuyKeyTime: startBuyKeyTime,
			mintKeyDays: maxAvaiMintKeyDays,
		};
	}

	// Start buy key time will be set for start time of next month
	const nextMonthStartTime = startBuyKeyTime.add(1, 'month').startOf('month');
	maxAvaiMintKeyDays = Math.min(mintKeyDays, nextMonthStartTime.daysInMonth());

	return {
		actualStartBuyKeyTime: nextMonthStartTime,
		mintKeyDays: maxAvaiMintKeyDays,
	};
};

enum BuyKeyState {
	Incomming,
	Available,
}

const getTimeLeftToBuyKey = (
	startBuyKeyTime: dayjs.Dayjs,
	mintKeyDays: number
) => {
	const now = dayjs();

	if (now.isBefore(startBuyKeyTime)) {
		return {
			buyKeyStatus: BuyKeyState.Incomming,
			timeLeft: startBuyKeyTime.diff(now, 'second'),
		};
	}

	if (now.date() > mintKeyDays) {
		const nextMintKeyStartTime = now.add(1, 'month').startOf('month');
		return {
			buyKeyStatus: BuyKeyState.Incomming,
			timeLeft: nextMintKeyStartTime.diff(now),
		};
	}

	return {
		buyKeyStatus: BuyKeyState.Available,
		timeLeft: now.startOf('month').add(mintKeyDays, 'days').diff(now, 'second'),
	};
};
