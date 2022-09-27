import { getListSaleRound, IPramsTokenSaleRounds } from 'apis/tokenSaleRounds';
import MyTable from 'common/components/table';
import { CURRENCY, LIMIT_10 } from 'common/constants/constants';
import { get } from 'lodash';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const TokenPresaleRound = () => {
	// const [step, setStep] = useState('Buy');
	const router = useRouter();
	const [perPage] = useState<number>(1);
	const [listTokenSaleRound, setListTokenSaleRound] = useState([]);

	useEffect(() => {
		const getListTokenSaleRounds = async () => {
			const params: IPramsTokenSaleRounds = {
				limit: LIMIT_10,
				page: perPage,
			};

			const [data] = await getListSaleRound(params);
			const resultTokenSaleRound = get(data, 'data.list', []);
			setListTokenSaleRound(resultTokenSaleRound);
			// console.log('error', error);
		};

		getListTokenSaleRounds();
	}, []);

	const columns = [
		{
			title: 'Rounds',
			dataIndex: 'sale_round',
			render: (saleRound: string) => saleRound,
		},
		{
			title: 'Price',
			dataIndex: 'exchange_rate',
			render: (exchangeRate: string) => <>{`${exchangeRate} ${CURRENCY}`}</>,
		},
		{
			title: 'Status',
			dataIndex: 'status',
			render: (status: string) => status,
		},
	];

	return (
		<div>
			<MyTable
				columns={columns}
				dataSource={listTokenSaleRound}
				onRow={(record: any) => {
					return {
						onClick: () => {
							router.push(`/token-presale-rounds/detail/${record._id}`);
						},
					};
				}}
			/>
		</div>
	);
};

export default TokenPresaleRound;
