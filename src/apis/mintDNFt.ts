import axiosInstance from './config';

export const getListPhaseMintNft = async () => {
	const queryString = `nft`;
	return await axiosInstance()
		.get(queryString)
		.then((data) => [data.data, null])
		.catch((error) => [null, error]);
};
