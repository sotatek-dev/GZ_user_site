import axiosInstance from './config';

export interface IParamsListDFNT {
	limit: number;
	page: number;
	status: string;
	sortBy?: string;
	rarities?: string | undefined;
	species?: string | undefined;
}

export const getListDFNT = async (params: IParamsListDFNT) => {
	const queryString = `dnft`;
	return await axiosInstance()
		.get(queryString, { params })
		.then((data) => [data.data, null])
		.catch((error) => [null, error]);
};
