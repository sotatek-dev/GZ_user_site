import { getListDFNT, IParamsListDFNT } from 'apis/mergeDnft';
import Button from 'common/components/button';
import Dropdown from 'common/components/dropdown';
import HelmetCommon from 'common/components/helmet';
import ModalCustom from 'common/components/modals';
import { ROUTES } from 'common/constants/constants';
import {
	LIMIT_12,
	RARITY_DNFT,
	SPECIES_DNFT,
	STATUS_LIST_DNFT,
} from 'common/constants/constants';
import type { MenuProps } from 'antd';
import { cloneDeep, get, isEmpty } from 'lodash';
import ListCard from 'modules/mergeDnft/ListCard';
import ModalChooseMetarialToMerge from 'modules/mergeDnft/ModalChooseMetarialToMerge';
// import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export interface IDFNT {
	created_at: Date;
	email_notice_sent: boolean;
	metadata?: any;
	random_at: Array<string>;
	rank_level: string;
	species: string;
	status: string;
	token_id: string;
	type: string;
	updated_at: Date;
	wallet_address: string;
	_id: string;
	isChecked: boolean;
	is_locked: boolean;
}

interface IPagination {
	limit: number;
	page: number;
	page_count: number;
	total: number;
}

export interface IDNFTToMerge {
	list: Array<IDFNT> | undefined;
	pagination: IPagination;
}

const ListDNFT = () => {
	const [page, setPage] = useState<number>(1);
	// const [isSelectAll, setSelectAll] = useState<boolean>(false);
	const [totalDNFT, setTotalDNFT] = useState<number>(0);
	const [dNFTSelected, setDNFTSelected] = useState<IDFNT>();
	const [listDNFT, setListDNFT] = useState<Array<IDFNT>>([]);
	const [rarity, setRarity] = useState<string>('');
	const [species, setSpecies] = useState<string>('');
	const [listDNFTToMergeSelected, setListDNFTToMergeSelected] = useState<
		Array<IDFNT>
	>([]);
	const { isLogin } = useSelector((state) => state.user);

	const [isShowModalChooseMetarialToMerge, setShowModalChooseMetarialToMerge] =
		useState<boolean>(false);

	useEffect(() => {
		const params = {
			limit: LIMIT_12,
			page: page,
			status: `${STATUS_LIST_DNFT.NORMAL}`, // tạm thời chờ BE sửa
		} as IParamsListDFNT;
		if (rarity) params.rarities = rarity;
		if (species) params.species = species;
		if (isLogin) {
			handleGetListDFNT(params);
		} else {
			setListDNFT([]);
		}
	}, [rarity, species, page, isLogin]);

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

	const handleAddCheckBoxListDNFT = (listDNFT: Array<IDFNT>) => {
		return listDNFT.map((DNFT: IDFNT) => {
			return { ...DNFT, isChecked: false };
		});
	};

	const handleGetListDFNT = async (params: IParamsListDFNT) => {
		const [dataListDNFT] = await getListDFNT(params);
		const listDNFT = get(dataListDNFT, 'data.list', []);
		const totalDNFT = get(dataListDNFT, 'data.pagination.total', 0);
		const resultListDNFT = handleAddCheckBoxListDNFT(listDNFT);
		setTotalDNFT(totalDNFT);
		setListDNFT(resultListDNFT);
	};

	const handleShowModal = async () => {
		setShowModalChooseMetarialToMerge(true);
	};

	const handleChangePage = (page: number) => {
		setPage(page);
	};

	const handleChangeRarity: MenuProps['onClick'] = ({ key }) => {
		setRarity(key);
	};

	const handleChangeSpecies: MenuProps['onClick'] = ({ key }) => {
		setSpecies(key);
	};

	return (
		<>
			<HelmetCommon
				title='Merge NFT'
				description='Description merge nft...'
				href={ROUTES.LIST_DNFT}
			/>
			<div className='flex flex-col'>
				<div className='flex mb-8 items-end justify-between	'>
					<div className={'hidden desktop:inline-block'}>
						Select the first NFT to merge
					</div>
					<div className='flex flex-col-reverse desktop:flex-row gap-y-6 items-end grow'>
						<div className='flex flex-col w-full gap-y-6 justify-end desktop:flex-row gap-x-2 ml-auto'>
							<Dropdown
								emptyOption='All species'
								customStyle='!w-full desktop:!w-[160px] !h-[36px] !rounded-[5px] mr-4 desktop:ml-8'
								label={species}
								title='All species'
								list={SPECIES_DNFT}
								onClick={handleChangeSpecies}
							/>
							<Dropdown
								emptyOption='All rarities'
								customStyle='!w-full desktop:!w-[160px] !h-[36px] !rounded-[5px]'
								label={rarity}
								title='All rarities'
								list={RARITY_DNFT}
								onClick={handleChangeRarity}
							/>
						</div>
						<Button
							onClick={handleShowModal}
							classCustom='buy-token rounded-[50px] !min-w-20 mt-6 ml-8'
							label='Choose'
							isDisabled={isEmpty(dNFTSelected)}
						/>
					</div>
				</div>
				<ListCard
					list={listDNFT}
					SelectNft={SelectNft}
					pagination={{
						defaultCurrent: 1,
						pageSize: LIMIT_12,
						total: totalDNFT,
						onChange: handleChangePage,
					}}
				/>
				{isShowModalChooseMetarialToMerge && dNFTSelected && (
					<ModalCustom
						title='Choose material to merge'
						customClass='!w-auto !max-w-[1300px]'
						isShow={isShowModalChooseMetarialToMerge}
						onCancel={() => setShowModalChooseMetarialToMerge(false)}
					>
						<ModalChooseMetarialToMerge
							onCancel={() => setShowModalChooseMetarialToMerge(false)}
							dNFTSelected={dNFTSelected}
							setListDNFTToMergeSelected={setListDNFTToMergeSelected}
							listDNFTToMergeSelected={listDNFTToMergeSelected}
						/>
					</ModalCustom>
				)}
			</div>
		</>
	);
};

export default ListDNFT;
