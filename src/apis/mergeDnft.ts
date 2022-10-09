import axiosInstance from './config';

export interface IParamsListDFNT {
	limit: number;
	page: number;
	status: string | string[];
	sortBy?: string;
	rarities?: string | undefined;
	species?: string | undefined;
}
export interface IParamsMergeRuleDFNT {
	ingredient_ids: Array<string>;
}

export interface IParamsDnftMerge {
	ingredient_ids: Array<string>;
	metadata: {
		species: string;
		rankLevel: string;
		properties: {
			[key: string | number]: {
				type?: string | undefined;
				value?: string | undefined;
			};
		};
	};
}

export const getListDFNT = async (params: IParamsListDFNT) => {
	const queryString = `dnft`;
	return await axiosInstance()
		.get(queryString, { params })
		.then((data) => [data.data, null])
		.catch((error) => [null, error]);
};

export const mergeRuleDFNT = async (params: IParamsMergeRuleDFNT) => {
	const queryString = `dnft/merge/rule`;
	return await axiosInstance()
		.post(queryString, { ...params })
		.then((data) => [data.data, null])
		.catch((error) => [null, error.response.data]);
};

export const dnftPermanentMerge = async (params: IParamsDnftMerge) => {
	const queryString = `dnft/permanent/merge`;
	return await axiosInstance()
		.post(queryString, { ...params })
		.then((data) => [data.data, null])
		.catch((error) => [null, error.response.data]);
};

export const dnftTempoaryMerge = async (params: IParamsDnftMerge) => {
	const queryString = `dnft/temp/merge`;
	return await axiosInstance()
		.post(queryString, { ...params })
		.then((data) => [data.data, null])
		.catch((error) => [null, error.response.data]);
};

export const getDetailDNFT = async (tokenId: string | string[]) => {
	const queryString = `dnft/${tokenId}`;
	return await axiosInstance()
		.get(queryString)
		.then((data) => [data.data, null])
		.catch((error) => [null, error.response.data]);
};

export const getSignatureMerge = async (params: { session_id: string }) => {
	const queryString = `dnft/signature`;
	return await axiosInstance()
		.post(queryString, { ...params })
		.then((data) => [data.data.data.signature, null])
		.catch((error) => [null, error.response.data]);
};
