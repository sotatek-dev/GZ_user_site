import axiosInstance from './config';

export const getMyProfile = async () => {
	const queryString = `profile/user`;
	return axiosInstance().get(queryString);
};

interface IParamsUpdateProfile {
	firstname?: string;
	lastname?: string;
	email?: string;
}

export const updateMyProfile = async (
	{ firstname, lastname, email }: IParamsUpdateProfile,
	successCallback: (data: object) => void,
	failCallback: (error: object) => void
) => {
	const queryString = `profile/user`;
	return await axiosInstance()
		.put(queryString, { firstname, lastname, email })
		.then((data) => successCallback(data))
		.catch((error) => failCallback(error));
};

export interface IParamsGetDNFTs {
	page: number;
	limit: number;

	sortBy?: string;
	direction?: string;
	query?: string;
}
export const getMyDNFTs = async (params: IParamsGetDNFTs) => {
	const queryString = `dnft`;
	return await axiosInstance().get(queryString, {
		params,
	});
};
