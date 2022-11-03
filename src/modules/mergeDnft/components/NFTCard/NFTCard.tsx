import classNames from 'classnames';
import ImageBase from 'common/components/imageBase';
import { get } from 'lodash';
import { FC, memo } from 'react';
import { IDFNT } from 'types/dnft';
import LockedMask from '../LockedMask';
import NFTSelectedOutline from '../NFTSelectedOutline';

interface ICardNftProps {
	dataDNFT: IDFNT;
	index: number;
	isCheckedDisplayList?: boolean;
	SelectNft: (event: React.MouseEvent<HTMLElement>, index: number) => void;
}

const NFTCard: FC<ICardNftProps> = ({
	dataDNFT,
	index,
	isCheckedDisplayList,
	SelectNft,
}) => {
	const { isChecked, is_locked } = dataDNFT;
	const imageDNFT = get(dataDNFT, 'metadata.image', '');
	const clns = classNames(
		{ 'outer-card-nft': isChecked },
		{ 'cursor-pointer': is_locked },
		'w-full cursor-pointer relative'
	);

	return (
		<div
			onClick={(event) => {
				if (is_locked) return;
				SelectNft(event, index);
			}}
			className={clns}
		>
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
			{is_locked && <LockedMask />}
			{(isChecked || isCheckedDisplayList) && <NFTSelectedOutline />}
		</div>
	);
};
export default memo(NFTCard);
