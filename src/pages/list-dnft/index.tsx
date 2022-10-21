import { useCallback, useEffect, useState } from 'react';
import { cloneDeep, get, isEmpty } from 'lodash';
import { getListDFNT, IParamsListDFNT } from 'apis/mergeDnft';
import Button from 'common/components/button';
import { LIMIT_12, STATUS_LIST_DNFT } from 'common/constants/constants';
import {
	NFTFilter,
	MergeMaterialModal,
	ListNFT,
} from 'modules/merge-dnft/components';
import { useAppSelector } from 'stores';
import { IDFNT } from 'types/dnft';
import { IPagination } from 'types/pagination';

export interface IDNFTToMerge {
	list: Array<IDFNT> | undefined;
	pagination: IPagination;
}

export interface Filter {
	rarity?: string;
	species?: string;
}

const ListDNFT = () => {
	const { isLogin } = useAppSelector((state) => state.user);
	const [page, setPage] = useState<Pick<IPagination, 'page'>['page']>(1);
	const [totalDNFT, setTotalDNFT] = useState<number>(0);
	const [dNFTSelected, setDNFTSelected] = useState<IDFNT>();
	const [listDNFT, setListDNFT] = useState<Array<IDFNT>>([]);
	const [isShowMergeMaterialModal, setIsShowMergeMaterialModal] =
		useState<boolean>(false);
	const [filter, setFilter] = useState<Filter>({});

	const [listDNFTToMergeSelected, setListDNFTToMergeSelected] = useState<
		Array<IDFNT>
	>([]);

	const handleChangeFilter = (field: keyof Filter, filterValue: string) => {
		setFilter({ ...filter, [field]: filterValue });
	};

	useEffect(() => {
		const { rarity, species } = filter;
		const params = {
			limit: LIMIT_12,
			page: page,
			status: `${STATUS_LIST_DNFT.NORMAL}`, // tạm thời chờ BE sửa
		} as IParamsListDFNT;

		const handleGetListDFNT = async (params: IParamsListDFNT) => {
			const [dataListDNFT] = await getListDFNT(params);
			const listDNFT = get(dataListDNFT, 'data.list', []);
			const totalDNFT = get(dataListDNFT, 'data.pagination.total', 0);
			const resultListDNFT = handleSelectNFT(listDNFT);
			setTotalDNFT(totalDNFT);
			setListDNFT(resultListDNFT);
		};

		if (filter.rarity) params.rarities = rarity;
		if (species) params.species = species;
		if (isLogin) {
			handleGetListDFNT(params);
		} else {
			setListDNFT([]);
		}
	}, [filter, page, isLogin]);

	const SelectNft = useCallback(
		(event: React.MouseEvent<HTMLElement>, indexSelected: number) => {
			event.stopPropagation();
			const ListNftClone = cloneDeep(listDNFT);
			const newListDNFT = ListNftClone.map((DFNT: IDFNT, index: number) => {
				if (indexSelected === index) {
					return { ...DFNT, isChecked: !DFNT.isChecked };
				}
				return { ...DFNT, isChecked: false };
			});
			const dNFTSelected = newListDNFT.find((DNFT: IDFNT) => DNFT.isChecked);
			setDNFTSelected(dNFTSelected);
			setListDNFT(newListDNFT);
		},
		[listDNFT]
	);

	const handleSelectNFT = (listDNFT: Array<IDFNT>) => {
		return listDNFT.map((DNFT: IDFNT) => {
			return { ...DNFT, isChecked: false };
		});
	};

	const handleChangePage = (page: number) => {
		setPage(page);
	};

	const handleShowModal = async () => {
		setIsShowMergeMaterialModal(true);
	};

	return (
		<>
			<div className='flex flex-col'>
				<div className='flex mb-8 justify-between items-center'>
					<h3 className='hidden desktop:inline-block'>
						Select the first NFT to merge
					</h3>
					<div className='flex flex-col-reverse justify-end w-full desktop:w-auto desktop:flex-row'>
						<NFTFilter
							filter={filter}
							handleChangeFilter={handleChangeFilter}
						/>
						<div className='flex justify-end'>
							<Button
								onClick={handleShowModal}
								classCustom='buy-token rounded-[50px] !min-w-20 mb-6 ml-8 desktop:mb-0'
								label='Choose'
								isDisabled={isEmpty(dNFTSelected)}
							/>
						</div>
					</div>
				</div>
				<ListNFT
					list={listDNFT}
					SelectNft={SelectNft}
					pagination={{
						defaultCurrent: 1,
						pageSize: LIMIT_12,
						total: totalDNFT,
						onChange: handleChangePage,
						responsive: true,
					}}
					showPagination={!!listDNFT.length}
				/>
				{isShowMergeMaterialModal && dNFTSelected && (
					<MergeMaterialModal
						onCancel={() => setIsShowMergeMaterialModal(false)}
						dNFTSelected={dNFTSelected}
						setListDNFTToMergeSelected={setListDNFTToMergeSelected}
						listDNFTToMergeSelected={listDNFTToMergeSelected}
					/>
				)}
			</div>
		</>
	);
};

export default ListDNFT;
