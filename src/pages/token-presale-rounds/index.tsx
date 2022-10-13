import { getListSaleRound, IPramsTokenSaleRounds } from 'apis/tokenSaleRounds';
import MyTable from 'common/components/table';
import { CURRENCY, LIMIT_10, ROUTES } from 'common/constants/constants';
import { convertTimeLine, formatNumber, fromWei } from 'common/utils/functions';
import { get } from 'lodash';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Pagination, Spin } from 'antd';
import HelmetCommon from 'common/components/helmet';
import ReactGa from 'react-ga';
export const buyTimeDefault = {
	start_time: 0,
	end_time: 0,
};

export interface ITokenSaleRoundState {
	buy_time: {
		start_time: number;
		end_time: number;
	};
	claim_configs: Array<{ [key: string]: string | number }>;
	created_at: Date;
	current_status_timeline: string;
	description: string;
	details: {
		[key: string]: number | string;
	};
	eventData: string;
	event_data: string;
	exchange_rate: number;
	have_list_user: boolean;
	is_current_sale_round: boolean;
	last_event: string;
	last_event_status: string;
	name: string;
	sale_round: number;
	status: string;
	token_info: {
		[key: string]: number;
	};
	updated_at: Date;
	_id: string;
}

const TokenPresaleRound = () => {
	const router = useRouter();
	const [perPage, setPerPage] = useState<number>(1);
	const [listTokenSaleRound, setListTokenSaleRound] = useState<
		Array<ITokenSaleRoundState>
	>([]);
	const [totalPage, setTotalPage] = useState<number>(0);
	const [isLoading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		if (perPage !== 0) {
			getListTokenSaleRounds();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [perPage]);

	const getListTokenSaleRounds = async () => {
		setLoading(true);
		const params: IPramsTokenSaleRounds = {
			limit: LIMIT_10,
			page: perPage,
		};
		const [data, error] = await getListSaleRound(params);
		if (error) {
			return setLoading(false);
		}
		if (data) {
			setLoading(false);
			const resultTokenSaleRound = get(data, 'data.list', []);
			const totalPage = get(data, 'data.pagination.total', 0);
			setTotalPage(totalPage);
			setListTokenSaleRound(resultTokenSaleRound);
		}
	};

	const columns = [
		{
			title: 'Rounds',
			dataIndex: 'name',
			render: (name: string) => {
				return <div>{name}</div>;
			},
		},
		{
			title: 'Price',
			dataIndex: 'exchange_rate',
			render: (exchangeRate: string) => (
				<>{`${formatNumber(fromWei(exchangeRate))} ${CURRENCY}`}</>
			),
		},
		{
			title: 'Status',
			dataIndex: 'current_status_timeline',
			render: (currentStatusTimeline: string, record: ITokenSaleRoundState) => {
				const timestampNow = moment().unix();
				const { start_time, end_time } = get(
					record,
					'buy_time',
					buyTimeDefault
				);
				const { claim_configs } = record;
				const { statusListSaleRound } = convertTimeLine(
					Number(start_time),
					Number(end_time),
					timestampNow,
					currentStatusTimeline,
					claim_configs
				);
				return <div>{statusListSaleRound}</div>;
			},
		},
	];
	const handleChangePage = (page: number) => {
		setPerPage(page);
	};
	useEffect(() => {
		ReactGa.initialize(process?.env?.NEXT_PUBLIC_GA_TRACKING_CODE || '');
		// to report page view Google Analytics
		ReactGa.pageview(router?.pathname || '');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<>
			<HelmetCommon
				title='Token Presale Rounds'
				description='Description token presale rounds...'
				href={ROUTES.TOKEN_PRESALE_ROUNDS}
			/>
			<div>
				{/* desktop*/}
				<MyTable
					loading={isLoading}
					customClass='table-sale-round hidden desktop:block'
					columns={columns}
					dataSource={listTokenSaleRound}
					onRow={(record: ITokenSaleRoundState) => {
						return {
							onClick: () => {
								router.push(`/token-presale-rounds/detail/${record._id}`);
							},
						};
					}}
					pagination={{
						defaultCurrent: 1,
						pageSize: LIMIT_10,
						position: ['bottomCenter'],
						total: totalPage,
						onChange: handleChangePage,
					}}
				/>

				{/* mobile*/}
				<div className={'desktop:hidden'}>
					{isLoading && (
						<div className='fixed inset-0 flex justify-center items-center opacity-50'>
							<Spin />
						</div>
					)}
					<div className={'flex flex-col gap-2.5 mb-4'}>
						{listTokenSaleRound.map(
							(item: ITokenSaleRoundState, index: number) => {
								const {
									current_status_timeline: currentStatusTimeline,
									buy_time,
									exchange_rate: exchangeRate,
									_id,
									claim_configs,
								} = item;
								const timestampNow = moment().unix();
								const { start_time, end_time } = buy_time;
								const { status } = convertTimeLine(
									Number(start_time),
									Number(end_time),
									timestampNow,
									currentStatusTimeline,
									claim_configs
								);

								return (
									<>
										{/*card container*/}
										<div
											className={'flex flex-col bg-black-10 p-4 rounded-[4px]'}
											key={index}
											onClick={() => {
												router.push(`/token-presale-rounds/detail/${_id}`);
											}}
										>
											<div
												className={'text-h6 font-bold mb-4'}
											>{`${formatNumber(
												fromWei(exchangeRate)
											)} ${CURRENCY}`}</div>
											<hr className={'border-t border-blue-20/[0.1] mb-5'} />
											<div className={'flex justify-between items-center mb-5'}>
												<div className={'text-h8 font-medium text-blue-20'}>
													Rounds
												</div>
												<div className={'text-h8 font-bold text-white'}>
													{item.name}
												</div>
											</div>
											<div className={'flex justify-between items-center'}>
												<div className={'text-h8 font-medium text-blue-20'}>
													Status
												</div>
												<div className={'text-h8 font-bold text-white'}>
													{status}
												</div>
											</div>
										</div>
									</>
								);
							}
						)}
					</div>
					{listTokenSaleRound.length > 0 && (
						<Pagination
							size={'small'}
							defaultCurrent={6}
							pageSize={LIMIT_10}
							total={totalPage}
							onChange={handleChangePage}
							className={'flex wrap gap-x-2'}
						/>
					)}
				</div>
			</div>
		</>
	);
};

export default TokenPresaleRound;
