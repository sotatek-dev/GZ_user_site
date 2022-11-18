import axiosInstance from './config';

export interface IPramsTokenSaleRounds {
	limit: number;
	page: number;
}

export interface IPramsSignatureTokenSaleRound {
	amount: number | string;
	sale_round_id: number;
	nonce: string;
}

export interface IPramsCheckUserWhitelist {
	address: number | string;
	type: number | string;
	id: string | undefined;
}

export const getListSaleRound = async (params: IPramsTokenSaleRounds) => {
	const queryString = `sale-round/public/view`;
	return await axiosInstance()
		.get(queryString, { params })
		.then((data) => [data.data, null])
		.catch((error) => [null, error]);
};

export const getDetailTokenSaleRound = async (index: string) => {
	const queryString = `sale-round/public/view/${index}`;
	return await axiosInstance()
		.get(queryString)
		.then((data) => [data.data, null])
		.catch((error) => [null, error]);
};

export const getSignatureTokenSaleRound = async (
	params: IPramsSignatureTokenSaleRound
) => {
	const queryString = `/sale-round/signature`;
	return await axiosInstance()
		.post(queryString, { ...params })
		.then((data) => [data.data, null])
		.catch((error) => [null, error]);
};

export const checkUserWhitelist = async (params: IPramsCheckUserWhitelist) => {
	const queryString = `/whitelisted-user/check`;
	return await axiosInstance()
		.get(queryString, { params })
		.then((data) => [data.data, null])
		.catch((error) => [null, error]);
};
