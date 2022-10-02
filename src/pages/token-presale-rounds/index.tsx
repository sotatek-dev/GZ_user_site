import { getListSaleRound, IPramsTokenSaleRounds } from 'apis/tokenSaleRounds';
import MyTable from 'common/components/table';
import { CURRENCY, LIMIT_10 } from 'common/constants/constants';
import { convertTimeLine, formatNumber, fromWei } from 'common/utils/functions';
import { get } from 'lodash';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

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
			dataIndex: 'current_status_timeline',
			render: (currentStatusTimeline: string, record: ITokenSaleRoundState) => {
				const timestampNow = moment().unix();
				const { start_time, end_time } = get(record, 'buy_time');
				const { status } = convertTimeLine(
					start_time,
					end_time,
					timestampNow,
					currentStatusTimeline
				);
				return <div>{status}</div>;
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
			<MyTable
				customClass='table-sale-round'
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
		</div>
	);
};

export default TokenPresaleRound;
