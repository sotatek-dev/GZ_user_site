// import { getListDFNT, IParamsListDFNT } from 'apis/mergeDnft';
import Button from 'common/components/button';
// import {
// 	LIMIT_12,
// 	LIMIT_8,
// 	STATUS_LIST_DNFT,
// } from 'common/constants/constants';
// import { get, isEmpty } from 'lodash';
import { IDFNT, IDNFTToMerge } from 'pages/merge-nft';
import { FC } from 'react';
// import { cloneDeep } from 'lodash';
// import { FC, useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
// import ListCard from './ListCard';
// import { FixedSizeList, ListOnItemsRenderedProps } from 'react-window';
// import InfiniteLoader from 'react-window-infinite-loader';

interface IModalChooseMetarialToMergeProps {
	onCancel: () => void;
	listDNFTToMerge?: IDNFTToMerge;
	dNFTSelected?: IDFNT;
}

// type OnItemsRendered = (props: ListOnItemsRenderedProps) => void;

const ModalChooseMetarialToMerge: FC<IModalChooseMetarialToMergeProps> = ({
	onCancel,
	dNFTSelected,
}) => {
	// const [page, setPage] = useState<number>(1);
	// const { isLogin } = useSelector((state) => state.user);
	// const [totalDNFT, setTotalDNFT] = useState<number>(0);
	// const [listDNFTToMerge, setListDNFTToMerge] = useState<Array<IDFNT>>([]);
	// const [listDNFTToMergeSelected, setListDNFTToMergeSelected] = useState<
	// 	Array<IDFNT>
	// >([]);
	// console.log('dNFTSelected', dNFTSelected);
	// const handleChangePage = (page: number) => {
	// 	setPage(page);
	// };

	// useEffect(() => {
	// 	const { rank_level, species } = dNFTSelected as IDFNT;
	// 	const params = {
	// 		limit: LIMIT_8,
	// 		page: page,
	// 		status: STATUS_LIST_DNFT.NORMAL,
	// 		rarities: rank_level,
	// 		species: species,
	// 	} as IParamsListDFNT;
	// 	if (isLogin) {
	// 		handleGetListDFNT(params);
	// 	} else {
	// 		setListDNFTToMerge([]);
	// 	}
	// }, [page, isLogin, dNFTSelected]);

	// const handleAddCheckBoxListDNFT = (listDNFT: Array<IDFNT>) => {
	// 	return listDNFT.map((DNFT: IDFNT) => {
	// 		return { ...DNFT, isChecked: false };
	// 	});
	// };

	// const handleGetListDFNT = async (params: IParamsListDFNT) => {
	// 	const [dataListDNFT] = await getListDFNT(params);
	// 	const listDNFT = get(dataListDNFT, 'data.list', []);
	// 	const totalDNFT = get(dataListDNFT, 'data.pagination.total', 0);
	// 	const resultListDNFT = handleAddCheckBoxListDNFT(listDNFT);
	// 	setTotalDNFT(totalDNFT);
	// 	setListDNFTToMerge(resultListDNFT);
	// };

	// const SelectNft = useCallback(
	// 	(event: React.MouseEvent<HTMLElement>, indexSelected: number) => {
	// 		event.stopPropagation();
	// 		const ListNftClone = cloneDeep(listDNFT);
	// 		const NewListDNFT = ListNftClone.map((DFNT: IDFNT, index: number) => {
	// 			if (indexSelected === index) {
	// 				return { ...DFNT, isChecked: !DFNT.isChecked };
	// 			}
	// 			return { ...DFNT, isChecked: false };
	// 		});
	// 		setListDNFT(NewListDNFT);
	// 	},
	// 	[listDNFT]
	// );

	// const handleLoadMoreDNFT = () => {

	// }

	return (
		<div>
			<div className='text-xl	flex mb-12'>
				<div>Merged NFT rarity:</div>
				<div className='text-red-10 ml-2'>{dNFTSelected?.rank_level}</div>
			</div>

			{/* <InfiniteLoader
				isItemLoaded={(index) => index < items.length}
				itemCount={itemCount}
				loadMoreItems={loadMore}
			>
				{( onItemsRendered: OnItemsRendered, ref: React.RefObject<HTMLInputElement> ) => (
					<FixedSizeList
						height={500}
						width={500}
						itemCount={itemCount}
						itemSize={120}
						onItemsRendered={onItemsRendered}
						ref={ref}
					>
						{Row}
					</FixedSizeList>
				)}
			</InfiniteLoader> */}

			{/* <ListCard
				list={listDNFTToMerge}
				SelectNft={() => {}}
				pagination={{
					defaultCurrent: 1,
					pageSize: LIMIT_12,
					total: totalDNFT,
					onChange: handleChangePage,
				}}
			/> */}
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
