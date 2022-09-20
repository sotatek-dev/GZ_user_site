import axiosInstance from './config';

export interface IPramsTokenSaleRounds {
	limit: number;
	page: number;
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
