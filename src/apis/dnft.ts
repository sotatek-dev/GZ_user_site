import axiosInstance from 'apis/config';

export const getDNFTDetail = async (tokenId: string) => {
	const queryString = `dnft/${tokenId}`;

	return await axiosInstance().get(queryString);
};
