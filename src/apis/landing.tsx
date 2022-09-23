import axiosInstance from 'apis/config';

export const getStatistics = async () => {
	const queryString = `token-status`;
	return await axiosInstance()
		.get(queryString)
		.then((res) => [res.data, null])
		.catch((error) => [null, error]);
};
