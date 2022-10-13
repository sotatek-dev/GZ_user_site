import { Checkbox } from 'antd';
import ImageBase from 'common/components/imageBase';
import { get } from 'lodash';
import { IDFNT } from 'pages/list-dnft';
import { FC, memo } from 'react';

interface ICardNftProps {
	dataDNFT: IDFNT;
	index: number;
	SelectNft: (event: React.MouseEvent<HTMLElement>, index: number) => void;
}

const CardNft: FC<ICardNftProps> = ({ dataDNFT, index, SelectNft }) => {
	const { isChecked, is_locked } = dataDNFT;
	// replace tạm chờ BE đẩy ảnh lên s3
	const imageDNFT = get(dataDNFT, 'metadata.image', '');

	return (
		<div
			onClick={!is_locked ? (event) => SelectNft(event, index) : () => {}}
			className={`flex justify-center items-center w-[160px] h-[230px] desktop:w-[213px] desktop:h-[290px] bg-gray-50 !rounded-[10px] relative ${
				!is_locked && 'cursor-pointer'
			} 
			}`}
		>
			{!is_locked && (
				<Checkbox
					onClick={(event) => SelectNft(event, index)}
					className='absolute top-3 right-3'
					checked={isChecked}
				/>
			)}
			<ImageBase
				url={imageDNFT}
				width='213px'
				height='213px'
				objectFit='fill'
			/>
		</div>
	);
};
export default memo(CardNft);
