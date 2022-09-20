import { Checkbox } from 'antd';
import { FC } from 'react';

interface ICardNftProps {
	checked: boolean;
	index: number;
	SelectNft: (event: React.MouseEvent<HTMLElement>, index: number) => void;
}

const CardNft: FC<ICardNftProps> = ({ checked, index, SelectNft }) => {
	return (
		<div
			onClick={(event) => SelectNft(event, index)}
			className={`w-[213px] h-[290px] bg-[#D1D4D8] relative cursor-pointer ${
				checked && 'bg-[#5c62e1]'
			}`}
		>
			<Checkbox
				onClick={(event) => SelectNft(event, index)}
				className='absolute top-3 right-3'
				checked={checked}
			/>
		</div>
	);
};
export default CardNft;
