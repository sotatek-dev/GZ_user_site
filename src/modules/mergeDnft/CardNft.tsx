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
	const { isChecked } = dataDNFT;
	// replace tạm chờ BE đẩy ảnh lên s3
	const imageDNFT = get(dataDNFT, 'metadata.image', '').replace(
		'172.16.1.217:5000',
		'api.galactix.sotatek.works'
	) as string;
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
