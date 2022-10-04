import { Input } from 'antd';
import CustomDropdown from 'common/components/dropdown/custom-dropdown';
import { map, range } from 'lodash';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import styles from './nft-detail.module.scss';
import ScrollContainer from 'react-indiana-drag-scroll';
import { ROUTES } from 'common/constants/constants';
import HelmetCommon from 'common/components/helmet';
import { useRouter } from 'next/router';
import ReactGa from 'react-ga';
const NFTDetail = () => {
	const [tab, setTab] = useState(false);
	const materialItems = range(0, 10);
	const router = useRouter();
	useEffect(() => {
		ReactGa.initialize(process?.env?.NEXT_PUBLIC_GA_TRACKING_CODE || '');
		// to report page view Google Analytics
		ReactGa.pageview(router?.pathname || '');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<>
			<HelmetCommon
				title='NFT Detail'
				description='Description nft detail...'
				href={ROUTES.NFT_DETAIL}
			/>
			<div>
				<label className={styles['switch']}>
					<input
						type='checkbox'
						onChange={(e) => {
							setTab(e.target.checked);
						}}
					/>
					<div className={styles['switch-btn']} />
					<span
						className={`${styles['slider']} ${styles['slider_left']} ${
							tab ? 'text-[#ffffff4d]' : 'text-white'
						}`}
					>
						Property
					</span>
					<span
						className={`${styles['slider']} ${styles['slider_right']} ${
							tab ? 'text-white' : 'text-[#ffffff4d]'
						}`}
					>
						Attribute
					</span>
				</label>

				<div className={styles['nft-detail']}>
					<div className={styles['nft-detail_img']}>
						<Image
							src='/images/ntf-example.svg'
							alt=''
							width='100%'
							height='100%'
							layout='fill'
							objectFit='contain'
						/>
					</div>

					<div className={styles['nft-detail_point']}>
						{!tab ? (
							<div className='flex flex-row justify-between gap-x-[50px]  w-[100%]'>
								<div className='flex flex-col gap-y-[20px] flex-grow'>
									<PropertyInput placeholder='00000' label='Strength' />
									<PropertyInput placeholder='00000' label='Speed' />
									<PropertyInput placeholder='00000' label='Agility' />
								</div>

								<div className='flex flex-col gap-y-[20px] flex-grow'>
									<PropertyInput placeholder='00000' label='Durability' />
									<PropertyInput placeholder='00000' label='Intelligence' />
								</div>
							</div>
						) : (
							<div className='flex flex-row justify-between gap-x-[50px]  w-[100%]'>
								<div className='flex flex-col gap-y-[20px] flex-grow'>
									<CustomDropdown label='Armor' list={[]} />
									<CustomDropdown label='Shoes' list={[]} />
									<CustomDropdown label='Gloves' list={[]} />
									<CustomDropdown label='Fur' list={[]} />
									<CustomDropdown label='Eyes' list={[]} />
									<CustomDropdown label='Summoning Masks' list={[]} />
								</div>

								<div className='flex flex-col gap-y-[20px] flex-grow'>
									<CustomDropdown label='Helmet' list={[]} />
									<CustomDropdown label='Hairstyle' list={[]} />
									<CustomDropdown label='Forcefield' list={[]} />
									<CustomDropdown label='Weapons/Accessory	' list={[]} />
									<CustomDropdown label='Background' list={[]} />
									<CustomDropdown label='Cosmic Power' list={[]} />
								</div>
							</div>
						)}
					</div>
				</div>
				<div className={styles['nft-material']}>
					<div className={styles['nft-material_title']}>Material</div>
					<ScrollContainer
						className={styles['nft-material_carousel']}
						horizontal
					>
						{map(materialItems, (item, index) => (
							<div className={styles['nft-material_carousel_item']} key={index}>
								<Image
									src='/images/ntf-example.svg'
									alt=''
									width='100%'
									height='100%'
									layout='fill'
									objectFit='contain'
								/>
							</div>
						))}
					</ScrollContainer>
				</div>
			</div>
		</>
	);
};

export default NFTDetail;

interface PropertyInputProps {
	label?: string;
	placeholder?: string;
	onChange?: (e: any) => void;
	value?: string;
	name?: string;
}

function PropertyInput({
	label,
	placeholder,
	onChange,
	value,
}: PropertyInputProps) {
	return (
		<div className='flex flex-col'>
			<label className='text-[#ffffff80] mb-[8px] leading-[24px]'>
				{label}
			</label>
			<Input
				onChange={onChange}
				value={value}
				placeholder={placeholder}
				className='!placeholder-[#ffffff1a] bg-transparent border-[2px] !border-[#ffffff33] text-white outline-none shadow-none h-[47px]'
			/>
		</div>
	);
}
