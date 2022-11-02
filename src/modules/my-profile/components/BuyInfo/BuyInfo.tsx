import BoxPool from 'common/components/boxPool';
import Countdown from 'common/components/countdown';
import CustomRadio from 'common/components/radio';
import { formatCurrency } from 'common/helpers/number';
import dayjs from 'dayjs';
import { get } from 'lodash';
import myProfileConstants from 'modules/my-profile/constant';
import { useBuyDKeyNFT } from 'modules/my-profile/services/useBuyDKeyNFT';
import Image from 'next/image';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from 'stores';
import { getMyProfileRD } from 'stores/my-profile';
import KeyNftAbi from 'web3/abis/abi-keynft.json';
import { AbiKeynft } from 'web3/abis/types';
import { NEXT_PUBLIC_KEYNFT } from 'web3/contracts/instance';
import { useContract } from 'web3/contracts/useContract';
import { useNativeBalance } from 'web3/hooks';
import { useBalance } from 'web3/queries';
import Button from '../Button';
import Token2BuyRadio from '../Token2BuyRadio';
import { BuyStatus, buyStatusConfigs, Token2Buy } from './BuyInfo.constants';
import { message } from 'antd';

export default function BuyInfo() {
	const { userInfo, dnft_holding_count } = useAppSelector(
		(state) => state.myProfile
	);
	// BUSD balance
	const busdBalance = useBalance(process.env.NEXT_PUBLIC_BUSD_ADDRESS || '');
	const bnbBalance = useNativeBalance();
	const { systemSetting, busd2Bnb, keyPriceBusd } = useAppSelector(
		(state) => state.systemSetting
	);
	const { buyDKeyNFT, isBuyDNFT } = useBuyDKeyNFT();
	const [tokenCode, setTokenCode] = useState(Token2Buy.BUSD);
	const keynftContract = useContract<AbiKeynft>(KeyNftAbi, NEXT_PUBLIC_KEYNFT);

	const dispatch = useAppDispatch();

	const handleBuyKey = async () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
		const [tx, _]: any = await buyDKeyNFT({
			keyPrice: keyPriceBusd?.toNumber(),
			token2Buy: tokenCode,
		});
		if (tx) {
			message.success(redirectToBSCScan(tx && tx?.transactionHash));
		}

		dispatch(getMyProfileRD(keynftContract));
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

	const getBuyKeyState = () => {
		if (!userInfo || !systemSetting) {
			return buyStatusConfigs[BuyStatus.Unavailable];
		}

		const currentDate = dayjs().date();
		if (currentDate > systemSetting.mint_days) {
			return buyStatusConfigs[BuyStatus.Upcomming];
		}

		if (dnft_holding_count <= 0) {
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

	const getBuyKeyTimeRemain = () => {
		if (!systemSetting) {
			return {
				onBuyKeyTime: false,
				secondsRemain: 0,
			};
		}
		const currentDayInMonth = dayjs().date();

		if (currentDayInMonth > systemSetting.mint_days) {
			const timeTillBuyTime = dayjs()
				.add(1, 'month')
				.startOf('month')
				.diff(dayjs(), 'second');

			return {
				onBuyKeyTime: false,
				secondsRemain: timeTillBuyTime,
			};
		}

		const endBuyKeyTime = dayjs()
			.startOf('month')
			.add(systemSetting.mint_days - 1, 'day')
			.endOf('day');

		const buyKeyTimeRemain = endBuyKeyTime.diff(dayjs(), 'second');

		return {
			onBuyKeyTime: true,
			secondsRemain: buyKeyTimeRemain,
		};
	};

	const getPrice = () => {
		if (tokenCode === Token2Buy.BUSD) {
			return keyPriceBusd;
		}

		return busd2Bnb && keyPriceBusd && busd2Bnb.times(keyPriceBusd);
	};

	const price = getPrice()?.toNumber();
	const buyKeyState = getBuyKeyState();
	const { onBuyKeyTime, secondsRemain } = getBuyKeyTimeRemain();
	const isEnableBuyKey = isEnoughRoyalty() && isEnoughBalance();

	return (
		<BoxPool customClass='desktop:w-[50%]'>
			<h5 className='text-[18px] font-semibold text-white  pb-[27px]'>
				Buy Info
			</h5>
			{buyKeyState && (
				<div className={buyKeyState.boxStyle}>
					<Image src={buyKeyState.icon} width='20' height='20' alt='' />
					<p className={`${buyKeyState.messageStyle} text-[0.875rem]`}>
						{buyKeyState.message}
					</p>
				</div>
			)}

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
			<Countdown
				descriptionStyle='!text-[#ffffff80] !text-[12px] !leading-4 '
				boxStyle='!bg-[#8080801a] !text-[white]'
				titleStyle='!font-normal !text-[#ffffff80]'
				customClass='mt-[20px] '
				title={
					onBuyKeyTime
						? myProfileConstants.ON_BUY_KEY_TIME
						: myProfileConstants.NOT_ON_BUY_KEY_TIME
				}
				millisecondsRemain={secondsRemain}
			/>

			{get(buyKeyState, 'canBuy') && onBuyKeyTime && (
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
