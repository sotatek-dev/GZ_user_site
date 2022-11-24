import { useEffect, useState } from 'react';
import { get } from 'lodash';
import { message } from 'antd';
import BoxPool from 'common/components/boxPool';
import CustomRadio from 'common/components/radio';
import myProfileConstants from 'modules/my-profile/constant';
import { useBuyDKeyNFT } from 'modules/my-profile/services/useBuyDKeyNFT';
import { useAppDispatch, useAppSelector } from 'stores';
import KeyNftAbi from 'web3/abis/abi-keynft.json';
import { AbiKeynft } from 'web3/abis/types';
import { NEXT_PUBLIC_KEYNFT } from 'web3/contracts/instance';
import { useContract } from 'web3/contracts/useContract';
import { useActiveWeb3React, useNativeBalance } from 'web3/hooks';
import Button from '../Button';
import Token2BuyRadio from '../Token2BuyRadio';
import { BuyStatus, buyStatusConfigs, Token2Buy } from './BuyInfo.constants';
import {
	fetchKeyBalance,
	fetchMinDnftToBuyKey,
	fetchStartBuyKeyTime,
} from 'stores/key-dnft/key-dnft.thunks';
import BuyAlert from './BuyAlert';
import {
	BuyKeyState,
	getActualStartBuyKeyTime,
	getTimeLeftToBuyKey,
} from './BuyInfo.helpers';
import BuyTimeCountdown from './BuyTimeCountdown';
import { formatBigNumber } from 'common/utils/functions';

export default function BuyInfo() {
	const { account } = useActiveWeb3React();
	const dispatch = useAppDispatch();
	const keyNftContract = useContract<AbiKeynft>(KeyNftAbi, NEXT_PUBLIC_KEYNFT);
	const { userInfo, dnft_holding_count } = useAppSelector(
		(state) => state.myProfile
	);
	const { systemSetting, busd2Bnb, keyPriceBusd } = useAppSelector(
		(state) => state.systemSetting
	);
	const { startBuyKeyTime: startBuyKeyUnixTime, minDnftToBuyKey } =
		useAppSelector((state) => state.keyDnft);

	useEffect(() => {
		if (!keyNftContract) return;

		dispatch(fetchMinDnftToBuyKey(keyNftContract));
		dispatch(fetchStartBuyKeyTime(keyNftContract));
	}, [dispatch, keyNftContract]);

	// BUSD balance
	const busdBalance = useAppSelector(
		(state) => state.wallet.balance.busdBalance
	);
	const bnbBalance = useNativeBalance();

	const { buyDKeyNFT, isBuyDNFT } = useBuyDKeyNFT();
	const [tokenCode, setTokenCode] = useState(Token2Buy.BUSD);

	const handleBuyKey = async () => {
		if (!keyNftContract || !account) return;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
		const [tx, _]: any = await buyDKeyNFT({
			keyPrice: keyPriceBusd?.toNumber(),
			token2Buy: tokenCode,
		});
		if (tx) {
			message.success(redirectToBSCScan(tx && tx?.transactionHash));
		}

		dispatch(fetchKeyBalance({ keyNftContract, account }));
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

	const { buyKeyStatus } = getTimeLeftToBuyKey(
		actualStartBuyKeyTime,
		mintKeyDays
	);

	const isOnBuyKeyTime = buyKeyStatus === BuyKeyState.Available;

	const getBuyKeyState = () => {
		if (
			userInfo == undefined ||
			systemSetting == undefined ||
			startBuyKeyUnixTime == undefined ||
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

		if (!isEnoughBalance()) {
			if (tokenCode === Token2Buy.BUSD) {
				return buyStatusConfigs[BuyStatus.NotEnoughBUSDBalance];
			} else if (tokenCode === Token2Buy.BNB) {
				return buyStatusConfigs[BuyStatus.NotEnoughBNBBalance];
			}
		}

		if (!isEnoughRoyalty()) {
			return buyStatusConfigs[BuyStatus.NotEnoughRoyalty];
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

	return (
		<BoxPool customClass='desktop:w-[50%]'>
			<h5 className='text-[18px] font-semibold text-white  pb-[27px]'>
				Buy Info
			</h5>
			<BuyAlert buyStatus={buyKeyState} />

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
						{formatBigNumber(price)} {tokenCode}
					</div>
				)}
			</div>
			<BuyTimeCountdown />

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
