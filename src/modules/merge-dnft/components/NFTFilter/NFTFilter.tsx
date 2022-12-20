import { MenuProps } from 'antd';
import Dropdown from 'common/components/dropdown';
import { RARITY_DNFT, SPECIES_DNFT } from 'common/constants/constants';
import { Filter } from 'pages/list-sdnft';

interface Props {
	filter: Filter;
	handleChangeFilter: (key: keyof Filter, val: string) => void;
}

export default function NFTFilter({ filter, handleChangeFilter }: Props) {
	const handleChangeRarity: MenuProps['onClick'] = ({ key }) => {
		handleChangeFilter('rarity', key);
	};

	const handleChangeSpecies: MenuProps['onClick'] = ({ key }) => {
		handleChangeFilter('species', key);
	};

	return (
		<>
			<div className='flex flex-col w-full gap-y-6 justify-end desktop:flex-row gap-x-2 ml-auto'>
				<Dropdown
					emptyOption='All species'
					customStyle='!w-full desktop:!w-[160px] !h-[36px] !rounded-[5px] mr-4 desktop:ml-8'
					label={filter.species ?? ''}
					title='All species'
					list={SPECIES_DNFT}
					onClick={handleChangeSpecies}
				/>
				<Dropdown
					emptyOption='All rarities'
					customStyle='!w-full desktop:!w-[160px] !h-[36px] !rounded-[5px]'
					label={filter.rarity ?? ''}
					title='All rarities'
					list={RARITY_DNFT}
					onClick={handleChangeRarity}
				/>
			</div>
		</>
	);
}
