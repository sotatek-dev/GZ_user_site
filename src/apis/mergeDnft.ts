import axiosInstance from './config';

export interface IParamsListDFNT {
	limit: number;
	page: number;
	status: string;
	sortBy?: string;
	rarities?: string | undefined;
	species?: string | undefined;
}
export interface IParamsMergeRuleDFNT {
	ingredient_ids: Array<string>;
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
		.catch((error) => [null, error]);
};
