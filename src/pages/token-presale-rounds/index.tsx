import { IPramsTokenSaleRounds } from 'apis/tokenSaleRounds';
import MyTable from 'common/components/table';
import { CURRENCY, LIMIT_20 } from 'common/constants/constants';
import { formatNumber, fromWei } from 'common/utils/functions';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Pagination, Spin } from 'antd';
import { useTokenPresaleList } from 'modules/common/hooks/useTokenPresaleGetList';
import { useAppSelector } from 'stores';

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
	statusListSaleRound: string;
}

const TokenPresaleRound = () => {
	const router = useRouter();
	const [payloadPaging, setPayloadPaging] = useState<IPramsTokenSaleRounds>({
		limit: LIMIT_20,
		page: 1,
	});
	const { addressWallet } = useAppSelector((state) => state.wallet);
	const { data, isLoading } = useTokenPresaleList(payloadPaging, addressWallet);

	const columns = [
		{
			title: 'Rounds',
			dataIndex: 'name',
			width: '50%',
			render: (name: string) => {
				return <div>{name}</div>;
			},
		},
		{
			title: 'Price',
			dataIndex: 'exchange_rate',
			width: '35%',
			render: (exchangeRate: string) => (
				<>{`${formatNumber(fromWei(exchangeRate))} ${CURRENCY}`}</>
			),
		},
		{
			title: 'Status',
			dataIndex: 'statusListSaleRound',
			width: '15%',
			render: (statusListSaleRound: string) => {
				return <div>{statusListSaleRound}</div>;
			},
		},
	];

	const handleChangePage = (page: number, pageSize: number) => {
		setPayloadPaging({ limit: pageSize, page });
	};

	return (
		<>
			<div>
				{/* desktop*/}
				<MyTable
					loading={isLoading}
					customClass='table-sale-round hidden desktop:block'
					columns={columns}
					dataSource={data?.list}
					onRow={(record: ITokenSaleRoundState) => {
						return {
							onClick: () => {
								router.push(`/token-presale-rounds/detail/${record._id}`);
							},
						};
					}}
					pagination={{
						current: payloadPaging.page,
						position: ['bottomCenter'],
						total: data?.pagination?.total,
						defaultPageSize: payloadPaging.limit,
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
						{data?.list?.map((item: ITokenSaleRoundState, index: number) => {
							const {
								exchange_rate: exchangeRate,
								_id,
								statusListSaleRound,
							} = item;

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
										<div className={'text-h6 font-bold mb-4'}>{`${formatNumber(
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
												{statusListSaleRound}
											</div>
										</div>
									</div>
								</>
							);
						})}
					</div>
					{data && data?.list?.length > 0 && (
						<Pagination
							size={'small'}
							current={payloadPaging.page}
							total={data?.pagination.total}
							defaultPageSize={payloadPaging.limit}
							onChange={handleChangePage}
							className='flex wrap gap-x-2'
						/>
					)}
				</div>
			</div>
		</>
	);
};

export default TokenPresaleRound;
