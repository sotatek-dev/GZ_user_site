import { Col, Pagination, PaginationProps } from 'antd';
import { IDFNT } from 'pages/list-dnft';
import { FC, memo } from 'react';
import CardNft from './CardNft';

interface IListCardProps {
	list: Array<IDFNT>;
	SelectNft: (event: React.MouseEvent<HTMLElement>, index: number) => void;
	pagination: PaginationProps;
}

const ListCard: FC<IListCardProps> = ({ list, SelectNft, pagination }) => {
	return (
		<div className='flex flex-col'>
			<div className='grid grid-cols-4 gap-8 w-fit mx-auto'>
				{list.map((data: IDFNT, index: number) => {
					if (data.is_locked) return null;
					return (
						<Col key={index} span={6}>
							<CardNft dataDNFT={data} index={index} SelectNft={SelectNft} />
						</Col>
					);
				})}
			</div>
			<Pagination className='flex items-center ml-auto mt-8' {...pagination} />
		</div>
	);
};

export default memo(ListCard);
