import Button from 'common/components/button';
import { cloneDeep } from 'lodash';
import { FC, useState } from 'react';
import ListCard from './ListCard';

const fakeData = [
	{ checked: false },
	{ checked: false },
	{ checked: false },
	{ checked: false },
];

interface IModalChooseMetarialToMergeProps {
	onCancel: () => void;
}

const ModalChooseMetarialToMerge: FC<IModalChooseMetarialToMergeProps> = ({
	onCancel,
}) => {
	const [listNft, setListNft] = useState(fakeData);
	const SelectNft = (
		event: React.MouseEvent<HTMLElement>,
		indexSelected: number
	) => {
		event.stopPropagation();
		const ListNftClone = cloneDeep(listNft);
		const NewListNft = ListNftClone.map((nft: any, index: number) => {
			if (indexSelected === index) {
				return { ...nft, checked: !nft.checked };
			}
			return { ...nft };
		});
		setListNft(NewListNft);
	};

	return (
		<div>
			<div className='text-xl	flex mb-12'>
				<div>Merged NFT rarity:</div>
				<div className='text-red-10 ml-2'>Rare</div>
			</div>
			<ListCard list={listNft} SelectNft={SelectNft} />
			<div className='flex gap-x-32 justify-center mt-10'>
				<Button
					onClick={onCancel}
					label='Cancel'
					classCustom='bg-blue-10 !min-w-[338px] !py-4'
				/>
				<Button
					onClick={() => {}}
					label='Next'
					classCustom='bg-purple-20 !min-w-[338px] !py-4'
				/>
			</div>
		</div>
	);
};

export default ModalChooseMetarialToMerge;
