import { getListSaleRound, IPramsTokenSaleRounds } from 'apis/tokenSaleRounds';
import MyTable from 'common/components/table';
import { CURRENCY, LIMIT_10 } from 'common/constants/constants';
import { convertTimeLine, formatNumber, fromWei } from 'common/utils/functions';
import { get } from 'lodash';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Pagination } from 'antd';

export const buyTimeDefault = {
	start_time: 0,
	end_time: 0,
};

export interface ITokenSaleRoundState {
	buy_time: {
		start_time: number;
		end_time: number;
	};
	claim_configs: Array<object>;
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

	useEffect(() => {
		if (perPage !== 0) {
			getListTokenSaleRounds();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [perPage]);

	const getListTokenSaleRounds = async () => {
		const params: IPramsTokenSaleRounds = {
			limit: LIMIT_10,
			page: perPage,
		};
		const [data] = await getListSaleRound(params);
		if (data) {
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
				const { status } = convertTimeLine(
					start_time,
					end_time,
					timestampNow,
					currentStatusTimeline
				);
				return <div>{status}</div>;
			},
		},
	];

	const handleChangePage = (page: number) => {
		setPerPage(page);
	};

	return (
		<div>
			{/* desktop*/}
			<MyTable
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
				<div className={'flex flex-col gap-2.5'}>
					{listTokenSaleRound.map((item: ITokenSaleRoundState, index: number) =>  {
						const { current_status_timeline: currentStatusTimeline, buy_time, exchange_rate: exchangeRate, _id } = item;
						const timestampNow = moment().unix();
						const { start_time, end_time } = buy_time;
						const { status } = convertTimeLine(
							start_time,
							end_time,
							timestampNow,
							currentStatusTimeline
						);

						return (
							<>
								{/*card container*/}
								<div className={'flex flex-col bg-black-10 p-4 rounded-[4px]'} key={index} onClick={() => {
									router.push(`/token-presale-rounds/detail/${_id}`);
								}}>
									<div className={'text-h6 font-bold mb-4'}>{`${formatNumber(fromWei(exchangeRate))} ${CURRENCY}`}</div>
									<hr className={'border border-blue-20 mb-5'}/>
									<div className={'flex justify-between items-center mb-5'}>
										<div className={'text-h8 font-medium text-blue-20'}>Rounds</div>
										<div className={'text-h8 font-medium text-white'}>{status}</div>
									</div>
									<div className={'flex justify-between items-center'}>
										<div className={'text-h8 font-medium text-blue-20'}>Status</div>
										<div className={'text-h8 font-medium text-white'}>{status}</div>
									</div>
								</div>
							</>
						)
					})}
				</div>
				<Pagination size={'small'} defaultCurrent={6} pageSize={LIMIT_10} total={totalPage} onChange={handleChangePage} className={'flex wrap gap-x-2'} />
			</div>
		</div>
	);
};

export default TokenPresaleRound;
