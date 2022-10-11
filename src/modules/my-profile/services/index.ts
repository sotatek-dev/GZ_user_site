import { message } from 'antd';
import axiosInstance from 'apis/config';
import BigNumber from 'bignumber.js';
import { AbiKeynft } from 'web3/abis/types';

export async function copyToClipboard(text: string) {
	await navigator.clipboard.writeText(text);
	message.info('Copied to clipboard');
}

const API_GET_SIGNATURE = '/setting-mint/signature/key';
export const getSignature = async () => {
	return await axiosInstance()
		.get<null, { data: { data: { signature: string } } }>(API_GET_SIGNATURE)
		.then((res) => [res.data.data.signature, null])
		.catch((error) => [null, error]);
};

export const getBnb2BusdRate = async (dKeyNFTContract: AbiKeynft | null) => {
	if (!dKeyNFTContract) {
		return null;
	}

	const ONE_BUSD = new BigNumber(1e18).toString();
	const bnbAmount = await dKeyNFTContract.convertBUSDToBNB(ONE_BUSD);

	return new BigNumber(bnbAmount.toString()).div(ONE_BUSD);
};
