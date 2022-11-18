import { message } from 'antd';
import axiosInstance from 'apis/config';
import BigNumber from 'bignumber.js';
import { formatEther } from 'ethers/lib/utils';
import { AbiKeynft, AbiPresalepool } from 'web3/abis/types';

export async function copyToClipboard(text: string) {
	await navigator.clipboard.writeText(text);
	message.info('Copied');
}

const API_GET_SIGNATURE = '/setting-mint/signature/key';
export const getSignature = async () => {
	return await axiosInstance()
		.get<null, { data: { data: { signature: string } } }>(API_GET_SIGNATURE)
		.then((res) => [res.data.data.signature, null])
		.catch((error) => [null, error]);
};

export const getBusb2Bnb = async (
	presalePoolContract: AbiPresalepool | null,
	busdVal: BigNumber.Value
) => {
	if (!presalePoolContract) {
		return null;
	}

	const bnbAmount = await presalePoolContract.convertBUSDToBNB(
		busdVal.toString()
	);
	return new BigNumber(bnbAmount.toString());
};

export const getKeyPriceBusd = async (dKeyNFTContract: AbiKeynft | null) => {
	if (!dKeyNFTContract) {
		return null;
	}

	const bnbAmount = await dKeyNFTContract.keyPrice();
	return new BigNumber(formatEther(bnbAmount));
};

export const getStartBuyKeyTime = async (dKeyNFTContract: AbiKeynft | null) => {
	if (!dKeyNFTContract) {
		return null;
	}

	const startBuyKeyTime = await dKeyNFTContract.buyTime();
	return startBuyKeyTime.toNumber();
};
