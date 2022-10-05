import axiosInstance from './config';

export const getMyProfile = async (
	successCallback: (data: object) => void,
	failCallback: (error: object) => void
) => {
	const queryString = `profile/user`;
	return await axiosInstance()
		.get(queryString)
		.then((data) => successCallback(data))
		.catch((error) => failCallback(error));
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

export const getMyDNFTs = async (page: number) => {
	const queryString = `dnft`;
	return await axiosInstance().get(queryString, {
		params: {
			page,
			limit: 10,
		},
	});
};
