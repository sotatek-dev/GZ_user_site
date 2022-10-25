/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from 'react-query';
import axiosInstance from 'apis/config';
import { convertTimeLine } from 'common/utils/functions';
import dayjs from 'dayjs';

interface IPramsTokenSaleRounds {
	limit: number;
	page: number;
}

type Request = IPramsTokenSaleRounds;

type Response = any;

const APIs = {
	getSaleRoundList: () => `/sale-round/public/view`,
};

const fetcher = async (payload: Request, addressWallet: string) => {
	const { data } = await axiosInstance().get<Request, Response>(
		APIs.getSaleRoundList(),
		{
			params: payload,
		}
	);
	const newData = await handleConvertListTokenSaleRound(
		data.data.list,
		addressWallet
	);

	return {
		list: newData,
		pagination: data.data.pagination,
	};
};

export const useTokenPresaleList = (
	payload: IPramsTokenSaleRounds,
	addressWallet: string
) => {
	return useQuery([APIs.getSaleRoundList(), payload], () =>
		fetcher(payload, addressWallet)
	);
};

const handleConvertListTokenSaleRound = async (
	resultTokenSaleRound: any,
	addressWallet: string
) => {
	return await Promise.all(
		resultTokenSaleRound.map(async (saleRound: any) => {
			const timestampNow = dayjs().unix();
			const { claim_configs, sale_round, current_status_timeline, buy_time } =
				saleRound;
			const { start_time, end_time } = buy_time;
			const { statusListSaleRound } = await convertTimeLine(
				Number(start_time),
				Number(end_time),
				timestampNow,
				current_status_timeline,
				claim_configs,
				addressWallet,
				sale_round
			);
			return { ...saleRound, statusListSaleRound };
		})
	);
};
