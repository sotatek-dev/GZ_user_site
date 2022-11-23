import axiosInstance from 'apis/config';

export const getDNFTDetail = async (tokenId: string) => {
	const queryString = `dnft/${tokenId}`;

	return await axiosInstance().get(queryString);
};

export const getDNFTSignature = async (params: {
	session_id: string;
	nonce: string;
}) => {
	const queryString = `dnft/signature`;

	return await axiosInstance().post(queryString, params);
};
