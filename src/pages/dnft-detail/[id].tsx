import { Input } from 'antd';
import CustomDropdown from 'common/components/dropdown/custom-dropdown';
import { get, map, range, toString } from 'lodash';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import styles from './nft-detail.module.scss';
import ScrollContainer from 'react-indiana-drag-scroll';
import { ROUTES } from 'common/constants/constants';
import HelmetCommon from 'common/components/helmet';
import { useRouter } from 'next/router';
import ReactGa from 'react-ga';
import { useAppDispatch, useAppSelector } from 'stores';
import { getDNFTDetailRD } from 'stores/dnft/dnft-detail';
const NFTDetail = () => {
	const [tab, setTab] = useState(false);
	const materialItems = range(0, 10);
	const router = useRouter();
	const dispatch = useAppDispatch();
	const dnftDetail = useAppSelector((state) => state.dnftDetail);

	useEffect(() => {
		ReactGa.initialize(process?.env?.NEXT_PUBLIC_GA_TRACKING_CODE || '');
		// to report page view Google Analytics
		ReactGa.pageview(router?.pathname || '');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (router.query.id) {
			dispatch(getDNFTDetailRD(toString(router.query.id)));
		}
	}, [router.query.id]);

	function getProperty(property: string) {
		return get(
			dnftDetail.dnftDetail,
			`metadata.properties.${property}.value`,
			''
		);
	}

	function getAttribute(attribute: string) {
		return get(dnftDetail.dnftDetail, `metadata.attribute.${attribute}`, '');
	}

	return (
		<>
			<HelmetCommon
				title='NFT Detail'
				description='Description nft detail...'
				href={ROUTES.NFT_DETAIL}
			/>

			{dnftDetail.loading || !dnftDetail.dnftDetail ? (
				<div>Loading...</div>
			) : (
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
								src={dnftDetail.dnftDetail.metadata.image}
								alt=''
								width='100%'
								height='100%'
								layout='fill'
								objectFit='contain'
							/>
						</div>

						<div className={styles['nft-detail_point']}>
							{!tab ? (
								<div className='flex flex-col desktop:flex-row justify-between gap-x-[50px]  w-[100%]'>
									<div className='flex flex-col gap-y-[20px] flex-grow'>
										<CustomDropdown
											disabled
											label='Armor'
											list={[]}
											value={getProperty('armor')}
										/>
										<CustomDropdown
											disabled
											label='Shoes'
											list={[]}
											value={getProperty('shoes')}
										/>
										<CustomDropdown
											disabled
											label='Gloves'
											list={[]}
											value={getProperty('gloves')}
										/>
										<CustomDropdown
											disabled
											label='Fur'
											list={[]}
											value={getProperty('fur')}
										/>
										<CustomDropdown
											disabled
											label='Eyes'
											list={[]}
											value={getProperty('eyes')}
										/>
										<CustomDropdown
											disabled
											label='Unique Eyes'
											list={[]}
											value={getProperty('uniqueEyes')}
										/>
										<CustomDropdown
											disabled
											label='Cosmic Power #1'
											list={[]}
											value={getProperty('cosmicPower1')}
										/>
										<CustomDropdown
											disabled
											label='Cosmic Power #2'
											list={[]}
											value={getProperty('cosmicPower2')}
										/>
									</div>

									<div className='flex flex-col gap-y-[20px] flex-grow'>
										<CustomDropdown
											disabled
											label='Helmet'
											list={[]}
											value={getProperty('helmet')}
										/>
										<CustomDropdown
											disabled
											label='Hairstyle'
											list={[]}
											value={getProperty('hairStyle')}
										/>
										<CustomDropdown
											disabled
											label='Unique Hairstyle'
											list={[]}
											value={getProperty('uniqueHairStyles')}
										/>
										<CustomDropdown
											disabled
											label='Weapons/Accessory	'
											list={[]}
											value={getProperty('weaponsAccessory')}
										/>
										<CustomDropdown
											disabled
											label='Background'
											list={[]}
											value={getProperty('background')}
										/>
										<CustomDropdown
											disabled
											label='Forcefield'
											list={[]}
											value={getProperty('forcefield')}
										/>
										<CustomDropdown
											disabled
											label='Nature Power #1'
											list={[]}
											value={getProperty('naturePower1')}
										/>
										<CustomDropdown
											disabled
											label='Nature Power #2'
											list={[]}
											value={getProperty('naturePower2')}
										/>
										<CustomDropdown
											disabled
											label='Summoning Mask'
											list={[]}
											value={getProperty('summoningMask')}
										/>
									</div>
								</div>
							) : (
								<div className='flex flex-col desktop:flex-row justify-between gap-0 desktop:gap-x-[50px]  w-[100%]'>
									<div className='flex flex-col gap-y-[20px] flex-grow'>
										<PropertyInput
											placeholder='00000'
											label='Strength'
											value={getAttribute('strength')}
										/>
										<PropertyInput
											placeholder='00000'
											label='Speed'
											value={getAttribute('speed')}
										/>
										<PropertyInput
											placeholder='00000'
											label='Agility'
											value={getAttribute('agility')}
										/>
									</div>

									<div className='flex flex-col gap-y-[20px] flex-grow'>
										<PropertyInput
											placeholder='00000'
											label='Durability'
											value={getAttribute('durability')}
										/>
										<PropertyInput
											placeholder='00000'
											label='Intelligence'
											value={getAttribute('intelligence')}
										/>
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
								<div
									className={styles['nft-material_carousel_item']}
									key={index}
								>
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
			)}
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
				disabled
				onChange={onChange}
				value={value}
				placeholder={placeholder}
				className='!placeholder-[#ffffff1a] !bg-transparent border-[2px] !border-[#ffffff33] !text-white outline-none shadow-none h-[47px]'
			/>
		</div>
	);
}
