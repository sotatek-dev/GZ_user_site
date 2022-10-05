import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import BoxPool from 'common/components/boxPool';
import Countdown from 'common/components/countdown';
import CustomRadio from 'common/components/radio';
import { BuyStatus, buyStatusConfigs, Token2Buy } from './BuyInfo.constants';
import { useMemo, useState } from 'react';
import { formatConcurrency } from 'common/helpers/number';
import Token2BuyRadio from '../Token2BuyRadio';
import { get } from 'lodash';
import { useBuyDKeyNFT } from './BuyKey.services';
import { getSignature } from 'modules/my-profile/services';

export default function BuyInfo() {
	const { userInfo } = useSelector(
		(state: { myProfile: { userInfo: unknown } }) => state.myProfile
	);
	const { systemSetting } = useSelector(
		(state: {
			systemSetting: {
				systemSetting: { mint_days: number; key_price: number };
			};
		}) => state.systemSetting
	);
	const [tokenCode, setTokenCode] = useState('BUSD');
	useBuyDKeyNFT();

	const handleBuyKey = async () => {
		const signature = await getSignature();
		console.log({ signature });
	};

	const buyState = () => {
		if (!userInfo || !systemSetting) {
			return buyStatusConfigs[BuyStatus.Unavailable];
		}

		const currentDate = dayjs().date();
		if (currentDate > systemSetting.mint_days) {
			return buyStatusConfigs[BuyStatus.Upcomming];
		}

		if (get(userInfo, 'nft_holding') < 1) {
			return buyStatusConfigs[BuyStatus.NFTRequired];
		}
		return buyStatusConfigs[BuyStatus.Available];
	};

	const buyKeyState = buyState();

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

	return (
		<BoxPool customClass='desktop:w-[50%]'>
			<h5 className='text-[18px] font-semibold text-white  pb-[27px]'>
				Buy Info
			</h5>
			{buyKeyState && (
				<div className={buyKeyState.boxStyle}>
					<img src={buyKeyState.icon} className='mr-[10px]' />
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

				{systemSetting && (
					<div className='text-[16px] text-[white] font-semibold'>
						{formatConcurrency(systemSetting.key_price)} {tokenCode}
					</div>
				)}
			</div>
			<Countdown
				descriptionStyle='!text-[#ffffff80] !text-[12px] !leading-4 '
				boxStyle='!bg-[#8080801a] !text-[white]'
				titleStyle='!font-normal !text-[#ffffff80]'
				customClass='mt-[20px] '
				title={inTimeBuyKey ? 'You can not buy key in' : 'You can buy key in'}
				millisecondsRemain={secondsRemain}
			/>

			{get(buyKeyState, 'canBuy') && inTimeBuyKey && (
				<button
					onClick={handleBuyKey}
					className={`w-[100%] rounded-[40px] h-fit font-semibold !py-[9px] mt-[36px] btn-gradient`}
				>
					Buy
				</button>
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
