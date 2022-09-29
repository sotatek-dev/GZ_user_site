import axiosInstance from 'apis/config';

export const getMintDnftSignature = async (): Promise<string> => {
	const res = await axiosInstance().get('/setting-mint/signature');
	return res.data.data.signature;
};
