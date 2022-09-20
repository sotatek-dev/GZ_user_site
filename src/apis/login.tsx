import axiosInstance from './config';

export interface IPramsLogin {
	wallet_address: string;
	signature: string;
	sign_message: string;
	email: string;
}

export const login = async (params: IPramsLogin) => {
	const queryString = `user/auth`;
	return await axiosInstance()
		.post(queryString, { ...params })
		.then((data) => [data.data, null])
		.catch((error) => [null, error]);
};

export const checkEmailUser = async (address: string) => {
	const queryString = `user/validate/${address}`;
	return await axiosInstance()
		.get(queryString)
		.then((data) => [data?.data?.data, null])
		.catch((error) => [null, error]);
};
