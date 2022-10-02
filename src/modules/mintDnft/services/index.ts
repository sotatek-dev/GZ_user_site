import axiosInstance from 'apis/config';
import { ROUND_TYPE } from 'common/constants/constants';
import { MINT_PHASE } from 'modules/mintDnft/constants';

export const getMintDnftSignature = async (): Promise<string> => {
	const res = await axiosInstance().get('/setting-mint/signature');
	return res.data.data.signature;
};

export const checkWhitelist = async (
	address: string,
	type: ROUND_TYPE,
	id: MINT_PHASE | string
): Promise<boolean> => {
	const params = {
		address,
		type,
		id,
	};
	const res = await axiosInstance().get('/whitelisted-user/check', { params });
	return res.data.data.isInWhiteList || false;
};
