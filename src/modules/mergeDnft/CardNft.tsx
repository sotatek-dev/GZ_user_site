import { Checkbox } from 'antd';
import ImageBase from 'common/components/imageBase';
import { IDFNT } from 'pages/merge-nft';
import { FC } from 'react';

interface ICardNftProps {
	dataDNFT: IDFNT;
	index: number;
	SelectNft: (event: React.MouseEvent<HTMLElement>, index: number) => void;
}

const CardNft: FC<ICardNftProps> = ({ dataDNFT, index, SelectNft }) => {
	const { isChecked } = dataDNFT;
	// const DFNTImage = get(dataDNFT, 'metadata.imageUrl', '')
	return (
		<div
			onClick={(event) => SelectNft(event, index)}
			className={`flex justify-center items-center w-[213px] h-[290px] bg-gray-50 !rounded-[10px] relative cursor-pointer
			}`}
		>
			<Checkbox
				onClick={(event) => SelectNft(event, index)}
				className='absolute top-3 right-3'
				checked={isChecked}
			/>
			<ImageBase url={''} width='140px' height='134px' objectFit='contain' />
		</div>
	);
};
export default CardNft;
