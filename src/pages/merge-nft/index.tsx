import Button from 'common/components/button';
import Dropdown from 'common/components/dropdown';
import HelmetCommon from 'common/components/helmet';
import ModalCustom from 'common/components/modals';
import { ROUTES } from 'common/constants/constants';
import { cloneDeep } from 'lodash';
import ListCard from 'modules/mergeDnft/ListCard';
import ModalChooseMetarialToMerge from 'modules/mergeDnft/ModalChooseMetarialToMerge';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ReactGa from 'react-ga';
const fakeData = [
	{ checked: false },
	{ checked: false },
	{ checked: false },
	{ checked: false },
	{ checked: false },
	{ checked: false },
	{ checked: false },
	{ checked: false },
];

const MergeNft = () => {
	const [listNft, setListNft] = useState(fakeData);
	const [isShowModalChooseMetarialToMerge, setShowModalChooseMetarialToMerge] =
		useState<boolean>(false);
	const router = useRouter();
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

	const handleShowModal = () => {
		setShowModalChooseMetarialToMerge(true);
	};
	useEffect(() => {
		ReactGa.initialize(process?.env?.NEXT_PUBLIC_GA_TRACKING_CODE || '');
		// to report page view Google Analytics
		ReactGa.pageview(router?.pathname || '');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<>
			<HelmetCommon
				title='Merge NFT'
				description='Description merge nft...'
				href={ROUTES.MERGE_NFT}
			/>
			<div className='flex flex-col'>
				<div className='flex justify-between mb-3 items-end'>
					<div>Select the first NFT to merge: </div>
					<div className='flex gap-x-2'>
						<Dropdown label='Rarity' list={[]} />
						<Dropdown label='Species' list={[]} />
					</div>
				</div>
				<ListCard list={listNft} SelectNft={SelectNft} />
				<Button
					onClick={handleShowModal}
					classCustom='bg-[#78A1F8] rounded-[50px] !min-w-20 mx-auto mt-6'
					label='Next'
				/>
				<ModalCustom
					title='Choose material to merge'
					customClass='!w-auto !max-w-[1200px]'
					isShow={isShowModalChooseMetarialToMerge}
					onCancel={() => setShowModalChooseMetarialToMerge(false)}
				>
					<ModalChooseMetarialToMerge
						onCancel={() => setShowModalChooseMetarialToMerge(false)}
					/>
				</ModalCustom>
			</div>
		</>
	);
};

export default MergeNft;
