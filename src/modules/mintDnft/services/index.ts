import axiosInstance from 'apis/config';
import { SettingMint } from 'modules/mintDnft/interfaces';

export const getMintDnftSignature = async (): Promise<string> => {
	const res = await axiosInstance().get('/setting-mint/signature');
	return res.data.data.signature;
};

export const getListPhase = async (): Promise<Array<SettingMint>> => {
	const res = await axiosInstance().get('/setting-mint/public/all');
	return res.data.data;
};
