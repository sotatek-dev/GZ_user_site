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

	return (
		<div
			onClick={!is_locked ? (event) => SelectNft(event, index) : () => {}}
			className={`${
				isChecked && 'outer-card-nft'
			} flex justify-center items-center desktop:w-[252px] desktop:h-[252px] w-[166px] h-[166px] relative ${
				!is_locked && 'cursor-pointer'
			} 
			}`}
		>
			<div className={'inner-card-nft'}>
				{is_locked && (
					<div className='card-nft-lock absolute inset-0 w-full flex justify-center items-center z-20 text-base font-semibold'>
						<div className='w-full flex justify-center items-center'>
							<ImageBase
								url='/icons/locked.svg'
								width='35px'
								height='20px'
								objectFit='fill'
								layout='fixed'
							/>
							LOCKED NFT
						</div>
					</div>
				)}
				<ImageBase
					url={imageDNFT}
					width='252px'
					height='252px'
					objectFit='fill'
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
