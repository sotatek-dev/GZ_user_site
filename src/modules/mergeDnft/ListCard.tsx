import { Col, Pagination, Row } from 'antd';
import { FC } from 'react';
import CardNft from './CardNft';

interface IListCardProps {
	list: Array<object>;
	SelectNft: (event: React.MouseEvent<HTMLElement>, index: number) => void;
}

const ListCard: FC<IListCardProps> = ({ list, SelectNft }) => {
	return (
		<div className='flex flex-col'>
			<Row justify='space-between' gutter={[16, 24]} className='w-full'>
				{list.map((data: any, index: number) => {
					return (
						<Col key={index} span={6}>
							<CardNft
								index={index}
								SelectNft={SelectNft}
								checked={data.checked}
							/>
						</Col>
					);
				})}
			</Row>
			<Pagination
				className='mt-2 ml-auto'
				showSizeChanger
				onShowSizeChange={() => {}}
				defaultCurrent={3}
				total={500}
			/>
		</div>
	);
};

export default ListCard;
