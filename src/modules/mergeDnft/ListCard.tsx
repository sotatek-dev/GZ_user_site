import { Col, Pagination, PaginationProps, Row } from 'antd';
import { IDFNT } from 'pages/merge-nft';
import { FC } from 'react';
import CardNft from './CardNft';

interface IListCardProps {
	list: Array<IDFNT>;
	SelectNft: (event: React.MouseEvent<HTMLElement>, index: number) => void;
	pagination: PaginationProps;
}

const ListCard: FC<IListCardProps> = ({ list, SelectNft, pagination }) => {
	return (
		<div className='flex flex-col'>
			<Row justify='space-between' gutter={[16, 24]} className='w-full'>
				{list.map((data: IDFNT, index: number) => {
					return (
						<Col key={index} span={6}>
							<CardNft dataDNFT={data} index={index} SelectNft={SelectNft} />
						</Col>
					);
				})}
			</Row>
			<Pagination className='flex items-center ml-auto mt-8' {...pagination} />
		</div>
	);
};

export default ListCard;
