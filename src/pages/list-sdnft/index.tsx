import { useMemo, useState } from 'react';
import { isEmpty } from 'lodash';
import Button from 'common/components/button';
import {
	NFTFilter,
	MergeMaterialModal,
	ListNFT,
} from 'modules/merge-dnft/components';
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
	const [dNFTSelected, setDNFTSelected] = useState<IDFNT>();
	const [isShowMergeMaterialModal, setIsShowMergeMaterialModal] =
		useState<boolean>(false);
	const [filter, setFilter] = useState<Filter>({});
	const [page, setPage] = useState<Pick<IPagination, 'page'>['page']>(1);

	const [listDNFTToMergeSelected, setListDNFTToMergeSelected] = useState<
		Array<IDFNT>
	>([]);

	const handleChangeFilter = (field: keyof Filter, filterValue: string) => {
		setFilter({ ...filter, [field]: filterValue });
		setDNFTSelected(undefined);
		setPage(1);
	};

	const handleShowModal = async () => {
		setIsShowMergeMaterialModal(true);
	};

	const isDisableChoise = useMemo(() => isEmpty(dNFTSelected), [dNFTSelected]);

	return (
		<>
			<div className='flex flex-col h-full'>
				<div className='flex mb-8 justify-between items-center'>
					<h3 className='hidden desktop:inline-block'>
						Select the first sdNFT to merge
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
								isDisabled={isDisableChoise}
							/>
						</div>
					</div>
				</div>
				<ListNFT
					filter={filter}
					setDNFTSelected={setDNFTSelected}
					DFNTSelected={dNFTSelected}
					page={page}
					setPage={setPage}
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
