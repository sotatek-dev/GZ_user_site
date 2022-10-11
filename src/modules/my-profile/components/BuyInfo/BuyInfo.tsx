import BoxPool from 'common/components/boxPool';
import Countdown from 'common/components/countdown';
import CustomRadio from 'common/components/radio';
import { formatCurrency } from 'common/helpers/number';
import dayjs from 'dayjs';
import { get } from 'lodash';
import myProfileConstants from 'modules/my-profile/constant';
import { useBuyDKeyNFT } from 'modules/my-profile/services/useBuyDKeyNFT';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'stores';
import { getMyProfileRD } from 'stores/my-profile';
import { AbiKeynft } from 'web3/abis/types';
import { NEXT_PUBLIC_KEYNFT } from 'web3/contracts/instance';
import { useContract } from 'web3/contracts/useContract';
import { useBalance } from 'web3/queries';
import Button from '../Button';
import Token2BuyRadio from '../Token2BuyRadio';
import { BuyStatus, buyStatusConfigs, Token2Buy } from './BuyInfo.constants';
import KeyNftAbi from 'web3/abis/abi-keynft.json';

export default function BuyInfo() {
	const { userInfo, dnft_holding_count } = useAppSelector(
		(state) => state.myProfile
	);
	// BUSD balance
	const busdBalance = useBalance(process.env.NEXT_PUBLIC_BUSD_ADDRESS || '');
	const { systemSetting, busd2Bnb } = useAppSelector(
		(state) => state.systemSetting
	);
	const { buyDKeyNFT, isBuyDNFT } = useBuyDKeyNFT();
	const [tokenCode, setTokenCode] = useState(Token2Buy.BUSD);
	const keynftContract = useContract<AbiKeynft>(KeyNftAbi, NEXT_PUBLIC_KEYNFT);

	const dispatch = useAppDispatch();

	const handleBuyKey = async () => {
		await buyDKeyNFT({
			keyPrice: systemSetting?.key_price,
			token2Buy: tokenCode,
		});
		dispatch(getMyProfileRD(keynftContract));
	};

	const buyKeyState = useMemo(() => {
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

		let isEnoughRoyalty = false;

		if (tokenCode === Token2Buy.BUSD) {
			isEnoughRoyalty = +busdBalance >= systemSetting.key_price * 0.08;
		}

		if (tokenCode === Token2Buy.BNB && busd2Bnb) {
			isEnoughRoyalty =
				+busdBalance >= +busd2Bnb.times(systemSetting.key_price) * 1.08;
		}

		if (!isEnoughRoyalty) {
			return buyStatusConfigs[BuyStatus.NotEnoughRoyalty];
		}

		let isEnoughBalance = false;
		if (tokenCode === Token2Buy.BUSD) {
			isEnoughBalance = +busdBalance >= systemSetting.key_price;
		}

		if (tokenCode === Token2Buy.BNB && busd2Bnb) {
			isEnoughBalance =
				+busdBalance >= busd2Bnb.times(systemSetting.key_price).toNumber();
		}

		if (!isEnoughBalance) {
			return buyStatusConfigs[BuyStatus.NotEnoughBalance];
		}

		return buyStatusConfigs[BuyStatus.Available];
	}, [
		userInfo,
		systemSetting,
		tokenCode,
		busdBalance,
		busd2Bnb,
		dnft_holding_count,
	]);

	const { inTimeBuyKey, secondsRemain } = useMemo(() => {
		if (!systemSetting) {
			return {
				inTimeBuyKey: false,
				secondsRemain: 0,
			};
		}
		const currentDate = dayjs().date();
		if (currentDate > systemSetting.mint_days) {
			const secondsRemain = dayjs().endOf('month').diff(dayjs(), 'second');
			return {
				inTimeBuyKey: false,
				secondsRemain,
			};
		}
		const secondsRemain = dayjs(
			`${dayjs().format('YYYY-MM')}-${systemSetting.mint_days} 00:00:00`
		).diff(dayjs(), 'second');

		return {
			inTimeBuyKey: true,
			secondsRemain,
		};
	}, [systemSetting]);

	const getPrice = () => {
		if (tokenCode === Token2Buy.BUSD) {
			return systemSetting?.key_price;
		}

		return (
			busd2Bnb &&
			systemSetting &&
			busd2Bnb.times(systemSetting.key_price).toNumber()
		);
	};

	const price = getPrice();

	return (
		<BoxPool customClass='desktop:w-[50%]'>
			<h5 className='text-[18px] font-semibold text-white  pb-[27px]'>
				Buy Info
			</h5>
			{buyKeyState && (
				<div className={buyKeyState.boxStyle}>
					<Image src={buyKeyState.icon} width='20' height='20' alt='' />
					<p className={buyKeyState.messageStyle}>{buyKeyState.message}</p>
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
					inTimeBuyKey
						? myProfileConstants.COUNTDOWN_INTIME
						: myProfileConstants.COUNTDOWN_OUTTIME
				}
				millisecondsRemain={secondsRemain}
			/>

			{get(buyKeyState, 'canBuy') && inTimeBuyKey && (
				<Button loading={isBuyDNFT} onClick={handleBuyKey} className={``}>
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
