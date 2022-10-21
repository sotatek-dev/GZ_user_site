import classNames from 'classnames';
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
	const imageDNFT = get(dataDNFT, 'metadata.image', '');
	const clns = classNames(
		{ 'outer-card-nft': isChecked },
		{ 'cursor-pointer': is_locked },
		'w-full cursor-pointer relative'
	);

	return (
		<div
			onClick={!is_locked ? (event) => SelectNft(event, index) : () => {}}
			className={clns}
		>
			{is_locked && (
				<div className='card-nft-lock absolute inset-0 w-full flex justify-center items-center z-20 text-base font-semibold'>
					<div className='w-full flex justify-center items-center gap-2'>
						<ImageBase url='/icons/locked.svg' width={16} height={20} />
						<span>LOCKED NFT</span>
					</div>
				</div>
			)}
			<div className='w-full'>
				<ImageBase
					url={imageDNFT}
					width={300}
					height={300}
					placeholder='blur'
					blurDataURL='/images/logo.svg'
					layout='responsive'
				/>
			</div>
			{isChecked && (
				<>
					<span className='span span-1'></span>
					<span className='span span-2'></span>
					<span className='span span-3'></span>
					<span className='span span-4'></span>
				</>
			)}
		</div>
	);
};
export default memo(CardNft);
