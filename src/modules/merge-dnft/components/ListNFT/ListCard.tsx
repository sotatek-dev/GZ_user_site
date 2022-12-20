import { FC, memo, useCallback, useEffect, useState } from 'react';
import { Col, Pagination, Empty } from 'antd';
import { getListDFNT, IParamsListDFNT } from 'apis/mergeDnft';
import { LIMIT_12, STATUS_LIST_DNFT } from 'common/constants/constants';
import { cloneDeep, get } from 'lodash';
import { Filter } from 'pages/list-sdnft';
import { useAppSelector } from 'stores';
import { IDFNT } from 'types/dnft';
import CardNft from '../NFTCard/NFTCard';
import Loading from 'common/components/loading';

interface IListCardProps {
	filter: Filter;
	DFNTSelected: IDFNT | undefined;
	setDNFTSelected: (val: IDFNT | undefined) => void;
	page: number;
	setPage: (page: number) => void;
}

const ListCard: FC<IListCardProps> = ({
	filter,
	DFNTSelected,
	setDNFTSelected,
	page,
	setPage,
}) => {
	const { isLogin } = useAppSelector((state) => state.user);
	const [listDNFT, setListDNFT] = useState<Array<IDFNT>>([]);
	const [isGetListDNFT, setIsGetListDNFT] = useState<boolean | undefined>();

	const [totalDNFT, setTotalDNFT] = useState<number>(0);

	const handleSelectNFT = (listDNFT: Array<IDFNT>) => {
		return listDNFT.map((DNFT: IDFNT) => {
			return { ...DNFT, isChecked: false };
		});
	};

	const handleChangePage = (page: number) => {
		setPage(page);
	};

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
		[listDNFT, setDNFTSelected]
	);

	useEffect(() => {
		const { rarity, species } = filter;
		const params = {
			limit: LIMIT_12,
			page: page,
			status: `${STATUS_LIST_DNFT.NORMAL}`, // tạm thời chờ BE fix
		} as IParamsListDFNT;

		const handleGetListDFNT = async (params: IParamsListDFNT) => {
			setIsGetListDNFT(true);
			const [dataListDNFT] = await getListDFNT(params);
			const listDNFT = get(dataListDNFT, 'data.list', []);
			const totalDNFT = get(dataListDNFT, 'data.pagination.total', 0);
			const resultListDNFT = handleSelectNFT(listDNFT);
			setTotalDNFT(totalDNFT);
			setListDNFT(resultListDNFT);
			setIsGetListDNFT(false);
		};

		if (filter.rarity) params.rarities = rarity;
		if (species) params.species = species;
		if (isLogin) {
			handleGetListDFNT(params);
		} else {
			setListDNFT([]);
		}
	}, [filter, page, isLogin]);

	if (isGetListDNFT) {
		return <Loading customClass='text-lg' />;
	}

	return (
		<div className='flex flex-col h-full'>
			<div className='grid grid-cols-2 desktop:grid-cols-4 gap-4 desktop:gap-8'>
				{listDNFT.map((data: IDFNT, index: number) => {
					return (
						<Col key={index}>
							<CardNft
								dataDNFT={data}
								isCheckedDisplayList={DFNTSelected?._id === data._id}
								index={index}
								SelectNft={SelectNft}
							/>
						</Col>
					);
				})}
			</div>
			<div className='flex h-full justify-center items-center'>
				{listDNFT && listDNFT.length === 0 && (
					<Empty className='absolute top-[45%]' />
				)}
			</div>
			{!!listDNFT.length && (
				<Pagination
					showSizeChanger={false}
					className='flex items-center justify-center desktop:justify-end mt-8'
					defaultCurrent={1}
					current={page}
					pageSize={LIMIT_12}
					total={totalDNFT}
					onChange={handleChangePage}
					responsive={true}
				/>
			)}
		</div>
	);
};

export default memo(ListCard);
