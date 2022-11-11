import { Input } from 'antd';
import CustomDropdown from 'common/components/dropdown/custom-dropdown';
import Loading from 'common/components/loading';
import { PROPERTY } from 'common/constants/mergeDNFT';
import { get, map, toString } from 'lodash';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ScrollContainer from 'react-indiana-drag-scroll';
import { useAppDispatch, useAppSelector } from 'stores';
import { getDNFTDetailRD } from 'stores/dnft/dnft-detail';
import styles from './nft-detail.module.scss';
import { IProperties } from 'modules/myProfile/interfaces';

const NFTDetail = () => {
	const [tab, setTab] = useState(false);
	const router = useRouter();
	const dispatch = useAppDispatch();
	const dnftDetail = useAppSelector((state) => state.dnftDetail);

	useEffect(() => {
		if (router.query.id) {
			dispatch(getDNFTDetailRD(toString(router.query.id)));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router.query.id]);

	function getProperties() {
		if (!dnftDetail?.dnftDetail) return;
		return get(dnftDetail?.dnftDetail, `metadata.properties`) as
			| {
					[prop: string]: {
						value: string | null;
						displayName: string;
					};
			  }
			| any;
	}

	function getAttribute(attribute: string) {
		return get(dnftDetail.dnftDetail, `metadata.attribute.${attribute}`, '');
	}

	const properties = getProperties();

	return (
		<>
			{dnftDetail.loading || !dnftDetail.dnftDetail || !properties ? (
				<div className='flex h-[100%] items-center justify-center'>
					<Loading />
				</div>
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
						<div className={styles['nft-detail_box']}>
							<div className={styles['nft-detail_box_img']}>
								<Image
									src={get(
										dnftDetail.dnftDetail,
										'metadata.image',
										'/images/ntf-example.svg'
									)}
									alt=''
									width='100%'
									height='100%'
									layout='fill'
									objectFit='contain'
								/>
							</div>
						</div>

						<div className={styles['nft-detail_point']}>
							{!tab ? (
								<div className='grid desktop:grid-cols-2 w-full gap-y-5 gap-x-16'>
									{Object.keys(properties).map((propId, id) => {
										// GLOVESDEFAULT: Follow merge dNFT logic
										if (propId === PROPERTY.GLOVESDEFAULT) return null;
										const { value, displayName } = properties[propId];

										return (
											<div key={id} className=''>
												<CustomDropdown
													disabled
													label={displayName}
													list={[]}
													value={value ?? ''}
													customStyle=''
												/>
											</div>
										);
									})}
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

					{dnftDetail.dnftDetail &&
						dnftDetail.dnftDetail.type === 'temp-merged' && (
							<div className={styles['nft-material']}>
								<div className={styles['nft-material_title']}>Material</div>

								<ScrollContainer
									stopPropagation
									className={styles['nft-material_carousel']}
									horizontal
								>
									{map(dnftDetail.relatedDNFTs, (item, index) => (
										<div
											className={styles['nft-material_carousel_item']}
											key={index}
											onClick={() => {
												router.push(`/dnft-detail/${item._id}`);
											}}
										>
											<Image
												src={
													get(item, 'metadata.image') ||
													'/images/ntf-example.svg'
												}
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
						)}
				</div>
			)}
		</>
	);
};

export default NFTDetail;

interface PropertyInputProps {
	label?: string;
	placeholder?: string;
	onChange?: (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => void;
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
