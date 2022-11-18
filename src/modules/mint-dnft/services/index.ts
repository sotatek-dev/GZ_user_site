import axiosInstance from 'apis/config';
import { SettingMint } from 'modules/mint-dnft/interfaces';
import { AbiDnft, AbiKeynft, AbiPresalepool } from 'web3/abis/types';

export const getMintDnftSignature = async (params: {
	nonce: string;
}): Promise<string> => {
	const res = await axiosInstance().get('/setting-mint/signature', { params });
	return res.data.data.signature;
};

export const getListPhase = async (): Promise<Array<SettingMint>> => {
	const res = await axiosInstance().get('/setting-mint/public/all');
	return res.data.data;
};

export const getNonces = async (
	contract: AbiDnft | AbiKeynft | AbiPresalepool,
	account: string
) => {
	return (await contract.nonces(account)).toString();
};
