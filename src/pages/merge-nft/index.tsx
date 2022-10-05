import { Checkbox } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
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
import ReactGa from 'react-ga';
import { cloneDeep, get } from 'lodash';
import ListCard from 'modules/mergeDnft/ListCard';
// import ModalChooseMetarialToMerge from 'modules/mergeDnft/ModalChooseMetarialToMerge';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export interface IDFNT {
	created_at: Date;
	email_notice_sent: boolean;
	random_at: Array<string>;
	status: string;
	token_id: string;
	type: string;
	updated_at: Date;
	wallet_address: string;
	_id: string;
	isChecked: boolean;
	metadata?: any;
}

const MergeNft = () => {
	const router = useRouter();
	const [page, setPage] = useState<number>(1);
	const [isSelectAll, setSelectAll] = useState<boolean>(false);
	const [totalDNFT, setTotalDNFT] = useState<number>(0);
	const [listDNFT, setListDNFT] = useState<Array<IDFNT>>([]);
	const [rarity, setRarity] = useState<string>('');
	const [species, setSpecies] = useState<string>('');
	const [isShowModalChooseMetarialToMerge, setShowModalChooseMetarialToMerge] =
		useState<boolean>(false);

	useEffect(() => {
		const params = {
			limit: LIMIT_12,
			page: page,
			status: STATUS_LIST_DNFT.NORMAL,
		} as IParamsListDFNT;
		if (rarity) params.rarities = rarity;
		if (species) params.species = species;

		handleGetListDFNT(params);
	}, [rarity, species, page]);

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

	const SelectNft = (
		event: React.MouseEvent<HTMLElement>,
		indexSelected: number
	) => {
		event.stopPropagation();
		const ListNftClone = cloneDeep(listDNFT);
		const NewListDNFT = ListNftClone.map((DFNT: IDFNT, index: number) => {
			if (indexSelected === index) {
				return { ...DFNT, isChecked: !DFNT.isChecked };
			}
			return { ...DFNT };
		});
		setListDNFT(NewListDNFT);
	};

	const handleShowModal = () => {
		setShowModalChooseMetarialToMerge(true);
	};

	const handleSelectAll = (event: CheckboxChangeEvent) => {
		const { checked } = event.target;
		setSelectAll(checked);
		const ListNftClone = cloneDeep(listDNFT);
		const NewListDNFT = ListNftClone.map((DFNT: IDFNT) => {
			return { ...DFNT, isChecked: checked };
		});
		setListDNFT(NewListDNFT);
		// setShowModalChooseMetarialToMerge(true);
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
				<div className='flex mb-8 items-end'>
					<div>Select the first NFT to merge: </div>
					<Checkbox
						className='checkbox-custom text-white text-base font-normal ml-auto'
						onChange={handleSelectAll}
						checked={isSelectAll}
					>
						Select All
					</Checkbox>
					<div className='flex gap-x-2 ml-auto'>
						<Dropdown
							customStyle='!w-[160px] !h-[36px] !rounded-[5px]'
							label={rarity}
							title='Rarity'
							list={SPECIES_DNFT}
							onClick={handleChangeRarity}
						/>
						<Dropdown
							customStyle='!w-[160px] !h-[36px] !rounded-[5px]'
							label={species}
							title='Species'
							list={RARITY_DNFT}
							onClick={handleChangeSpecies}
						/>
					</div>
					<Button
						onClick={handleShowModal}
						classCustom='buy-token rounded-[50px] !min-w-20 mt-6 ml-8'
						label='Choose'
					/>
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

				<ModalCustom
					title='Choose material to merge'
					customClass='!w-auto !max-w-[1200px]'
					isShow={isShowModalChooseMetarialToMerge}
					onCancel={() => setShowModalChooseMetarialToMerge(false)}
				>
					<div className='relative w-[600px] h-[600px]'>
						<Image
							className='absolute inset-0 w-full h-full z-10'
							layout='fill'
							src='/images/Black.png'
							width='100%'
							height='100%'
							alt='dnft'
							objectFit='contain'
						/>
						<Image
							className='absolute inset-0 w-full h-full z-20'
							layout='fill'
							src='/images/Jacket-01.png'
							width='100%'
							height='100%'
							alt='dnft'
							objectFit='contain'
						/>
					</div>
					{/* <ModalChooseMetarialToMerge
					onCancel={() => setShowModalChooseMetarialToMerge(false)}
				/> */}
				</ModalCustom>
			</div>
		</>
	);
};

export default MergeNft;
