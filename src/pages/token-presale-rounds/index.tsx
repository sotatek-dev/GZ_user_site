import { getListSaleRound, IPramsTokenSaleRounds } from 'apis/tokenSaleRounds';
import MyTable from 'common/components/table';
import { CURRENCY, LIMIT_10 } from 'common/constants/constants';
import { formatNumber, fromWei } from 'common/utils/functions';
import { get } from 'lodash';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const TokenPresaleRound = () => {
	const router = useRouter();
	const [perPage, setPerPage] = useState<number>(1);
	const [listTokenSaleRound, setListTokenSaleRound] = useState([]);
	const [totalPage, setTotalPage] = useState<number>(0);

	useEffect(() => {
		const getListTokenSaleRounds = async () => {
			const params: IPramsTokenSaleRounds = {
				limit: LIMIT_10,
				page: perPage,
			};
			const [data] = await getListSaleRound(params);
			const resultTokenSaleRound = get(data, 'data.list', []);
			const totalPage = get(data, 'data.pagination.total', 0);
			setTotalPage(totalPage);
			setListTokenSaleRound(resultTokenSaleRound);
			// console.log('error', error);
		};

		getListTokenSaleRounds();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [perPage]);

	const columns = [
		{
			title: 'Rounds',
			dataIndex: 'sale_round',
			render: (_record: number) => {
				return <div>{_record}</div>;
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
			dataIndex: 'status',
			render: (status: string) => status,
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
				onRow={(record: any) => {
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
