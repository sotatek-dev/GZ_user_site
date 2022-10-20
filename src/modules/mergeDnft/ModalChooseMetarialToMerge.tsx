import { getListDFNT, IParamsListDFNT } from 'apis/mergeDnft';
import Button from 'common/components/button';
import { LIMIT_8, STATUS_LIST_DNFT } from 'common/constants/constants';
import { cloneDeep, get } from 'lodash';
import { IDFNT } from 'pages/list-dnft';
import { FC, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import CardNft from './CardNft';
import { ERankLevel, MergeNftRule } from 'common/constants/mergeDNFT';
import { useRouter } from 'next/router';

interface IModalChooseMetarialToMergeProps {
	onCancel: () => void;
	dNFTSelected: IDFNT;
	setListDNFTToMergeSelected: React.Dispatch<
		React.SetStateAction<Array<IDFNT>>
	>;
	listDNFTToMergeSelected: Array<IDFNT>;
}

const ModalChooseMetarialToMerge: FC<IModalChooseMetarialToMergeProps> = ({
	onCancel,
	dNFTSelected,
	listDNFTToMergeSelected,
	setListDNFTToMergeSelected,
}) => {
	const router = useRouter();
	const [page, setPage] = useState<number>(1);
	const { isLogin } = useSelector((state) => state.user);
	const [listDNFTToMerge, setListDNFTToMerge] = useState<Array<IDFNT>>([]);
	const { rank_level, species } = dNFTSelected as IDFNT;
	const rankLevelMerge = MergeNftRule[rank_level]?.[
		listDNFTToMergeSelected?.length
	] as ERankLevel;

	useEffect(() => {
		const params = {
			limit: LIMIT_8,
			page: page,
			status: STATUS_LIST_DNFT.NORMAL,
			rarities: rank_level,
			species: species,
		} as IParamsListDFNT;
		if (isLogin) {
			handleGetListDFNT(params);
		} else {
			setListDNFTToMerge([]);
		}
	}, [page, isLogin, dNFTSelected]);

	useEffect(() => {
		return () => {
			handleResetData();
		};
	}, []);

	const handleAddCheckBoxListDNFT = (listDNFT: Array<IDFNT>) => {
		// lọc nft đã chọn ở màn merge dnft
		return listDNFT.map((DNFT: IDFNT) => {
			return { ...DNFT, isChecked: false };
		});
	};

	const handleGetListDFNT = async (params: IParamsListDFNT) => {
		const [dataListDNFT] = await getListDFNT(params);
		const listDNFT = get(dataListDNFT, 'data.list', []);
		const resultListDNFT = handleAddCheckBoxListDNFT(listDNFT);
		setListDNFTToMerge([...listDNFTToMerge, ...resultListDNFT]);
	};
	const handleLoadMoreDNFT = () => {
		setPage((page) => page + 1);
	};

	const handleResetData = () => {
		setPage(1);
		setListDNFTToMerge([]);
		setListDNFTToMergeSelected([]);
	};

	const handleGetListTokenId = (listDNFTSelectd: Array<IDFNT>) => {
		// listDNFTSelectd = listDNFTSelectd.concat([dNFTSelected])
		const listDNFTToMergeSelected = listDNFTSelectd
			.map((DFNT: IDFNT) => {
				if (DFNT?.token_id === dNFTSelected?.token_id) {
					return { ...DFNT, isChecked: dNFTSelected.isChecked };
				}
				return { ...DFNT };
			})
			.filter((DNFT: IDFNT) => DNFT.isChecked);
		setListDNFTToMergeSelected(listDNFTToMergeSelected);
	};

	const SelectNft = useCallback(
		(event: React.MouseEvent<HTMLElement>, indexSelected: number) => {
			event.stopPropagation();
			const listNftClone = cloneDeep(listDNFTToMerge);
			const newListDNFT = listNftClone.map((DFNT: IDFNT, index: number) => {
				if (indexSelected === index) {
					return { ...DFNT, isChecked: !DFNT.isChecked };
				}
				return { ...DFNT };
			}) as Array<IDFNT>;
			handleGetListTokenId(newListDNFT);
			setListDNFTToMerge(newListDNFT);
		},
		[listDNFTToMerge]
	);

	const handleMergeDNFT = async () => {
		const listTokenId = listDNFTToMergeSelected.map(
			(DNFT: IDFNT) => DNFT.token_id
		);
		if (listTokenId.length < 2) return;
		const url = {
			pathname: '/merge-dnft',
			query: { listTokenId },
		};
		router.push(url);
	};

	return (
		<div>
			<div className='desktop:block text-h7 text-center desktop:text-left desktop:mt-8'>
				<span className='opacity-70'>Merged NFT rarity:</span>
				<span className='inline-block text-purple-30 ml-2 bg-purple-30 bg-opacity-20 px-3 rounded-md font-bold text-sm'>
					{rankLevelMerge ? rankLevelMerge : 'TBA'}
				</span>
			</div>
			<div className='mt-8 desktop:mt-6' id='scrollableDiv'>
				<InfiniteScroll
					dataLength={listDNFTToMerge.length}
					next={handleLoadMoreDNFT}
					hasMore={true}
					loader={<></>}
					scrollableTarget='scrollableDiv'
					height={380}
					className='scrollbar-thin scrollbar-thumb-white/20 scrollbar-thumb-rounded-md scrollbar-track-[#182737] pr-2'
				>
					<div className='grid grid-cols-2 desktop:grid-cols-4 gap-4 desktop:gap-6 justify-items-center'>
						{listDNFTToMerge.map((DNFT: IDFNT, index: number) => {
							if (DNFT.token_id === dNFTSelected.token_id) return null;
							return (
								<CardNft
									key={index}
									dataDNFT={DNFT}
									index={index}
									SelectNft={SelectNft}
								/>
							);
						})}
					</div>
				</InfiniteScroll>
			</div>
			<div className='flex gap-x-8 justify-center mt-10'>
				<Button
					onClick={onCancel}
					label='Cancel'
					classCustom='!font-semibold !min-w-[150px] desktop:!min-w-[200px] bg-transparent hover:bg-transparent  shadow-none !border-gray-60 !border-solid !border-2 !rounded-[40px] !py-2'
				/>
				<Button
					onClick={handleMergeDNFT}
					label='Next'
					classCustom='!font-semibold !min-w-[150px] desktop:!min-w-[200px] bg-purple-20 rounded-[40px] !rounded-[40px] bg-purple-30 hover:bg-purple-30 focus:bg-purple-30 !py-2'
					isDisabled={listDNFTToMergeSelected.length < 2 || !rankLevelMerge}
				/>
			</div>
		</div>
	);
};

export default ModalChooseMetarialToMerge;
