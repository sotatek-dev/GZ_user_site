import { Col, Pagination, PaginationProps } from 'antd';
import { IDFNT } from 'pages/list-dnft';
import { FC, memo } from 'react';
import CardNft from './CardNft';

interface IListCardProps {
	list: Array<IDFNT>;
	SelectNft: (event: React.MouseEvent<HTMLElement>, index: number) => void;
	pagination: PaginationProps;
	showPagination?: boolean;
}

const ListCard: FC<IListCardProps> = ({
	list,
	SelectNft,
	pagination,
	showPagination = true,
}) => {
	return (
		<div className='flex flex-col'>
			<div className='grid grid-cols-2 desktop:grid-cols-4 gap-4 desktop:gap-8'>
				{list.map((data: IDFNT, index: number) => {
					return (
						<Col key={index}>
							<CardNft dataDNFT={data} index={index} SelectNft={SelectNft} />
						</Col>
					);
				})}
			</div>
			{showPagination && (
				<Pagination
					className='flex items-center justify-center desktop:justify-end mt-8'
					{...pagination}
				/>
			)}
		</div>
	);
};

export default memo(ListCard);
