import { message as messageAntd } from 'antd';
import { cloneDeep, get } from 'lodash';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import {
	dnftPermanentMerge,
	dnftTempoaryMerge,
	getSignatureMerge,
	IParamsDnftMerge,
	IParamsMergeRuleDFNT,
	mergeRuleDFNT,
} from 'apis/mergeDnft';
import { ROUTES, STATUS_CODE } from 'common/constants/constants';
import { PROPERTY } from 'common/constants/mergeDNFT';
import Button from 'common/components/button';
import { permanentMerge, temporaryMerge } from 'web3/contracts/useContractDNFT';
import DropdownMegeDnft from 'common/components/dropdown/DropdownMegeDnft';

interface IInitImage {
	assetBase: string;
	extension: string;
	isAsset: boolean;
	propertyName: string;
	zIndex: number | undefined;
	specialOrderLayer: number | undefined;
	value: string;
	type: string;
	values: Array<{ label: string }>;
	valuesSpecialOrder: Array<{ label: string }>;
}

interface IProperty {
	[key: string]: {
		asset: string;
		extension: string;
		orderLayer: number | undefined;
		specialOrderLayer: number | undefined;
		type: string;
		values: Array<string>;
		valuesSpecialOrder: Array<string>;
	};
}

interface ISpeciesAndRank {
	species: string;
	rankLevel: string;
}

const MergeDNFT = () => {
	//router
	const router = useRouter();
	const {
		query: { listTokenId },
	} = router;
	// state
	const [initImages, setInitImages] = useState<Array<IInitImage>>([]);
	const [defaultImages, setDefaultImages] = useState<Array<IInitImage>>([]);
	const [tokenIds, settokenIds] = useState<number[] | false>([]);
	const [speciesAndRank, setSpeciesAndRank] = useState<ISpeciesAndRank>();
	const [isLoadingPermanentlyMerge, setLoadingPermanentlyMerge] =
		useState<boolean>(false);
	const [isLoadingTemporaryMerge, setLoadingTemporaryMerge] =
		useState<boolean>(false);

	//state store
	const { isLogin } = useSelector((state) => state.user);
	useEffect(() => {
		const params = {
			ingredient_ids: listTokenId,
		} as IParamsMergeRuleDFNT;
		if (Array.isArray(listTokenId) && listTokenId?.length > 0 && isLogin) {
			handleGetMergeRule(params);
		} else {
			//
		}
	}, [listTokenId, isLogin]);

	useEffect(() => {
		if (!listTokenId || listTokenId?.length === 0) {
			router.push(ROUTES.LIST_DNFT);
		} else {
			const tokenIds =
				Array.isArray(listTokenId) &&
				listTokenId.map((tokenId: string) => Number(tokenId));
			settokenIds(tokenIds);
		}
	}, [listTokenId]);

	const handleInitListImage = (properties: IProperty) => {
		const initListImage = [];
		const furDefault = properties[PROPERTY.FUR]?.values[0] || '';
		for (const property in properties) {
			const {
				orderLayer,
				asset,
				extension,
				values,
				valuesSpecialOrder,
				type,
				specialOrderLayer,
			} = properties[property];
			const convertValues = values.map((value: string) => {
				return { label: value };
			});
			const convertValuesSpecialOrder =
				valuesSpecialOrder?.length > 0
					? valuesSpecialOrder.map((value: string) => {
							return { label: value };
					  })
					: [];
			// init property fur và gloves
			const value =
				property === PROPERTY.FUR || property === PROPERTY.GLOVESDEFAULT
					? furDefault
					: '';
			const result = {
				zIndex: orderLayer ? orderLayer + 2 : orderLayer,
				specialOrderLayer: specialOrderLayer
					? Math.round(specialOrderLayer)
					: specialOrderLayer,
				assetBase: asset,
				extension,
				propertyName: property,
				value: value,
				type,
				// property không có orderLayer thì là một thuộc tính thường, không phải ảnh
				isAsset: orderLayer ? true : false,
				values: convertValues,
				valuesSpecialOrder: convertValuesSpecialOrder,
			} as IInitImage;
			initListImage.push(result);
		}
		return { initListImage, furDefault };
	};

	const handleGetMergeRule = async (params: IParamsMergeRuleDFNT) => {
		const [data, error] = await mergeRuleDFNT(params);
		const properties = get(data, 'data.seed.properties', {});
		const species = get(data, 'data.seed.species[0]');
		const rankLevel = get(data, 'data.seed.rankLevel[0]', '');
		const { initListImage } = handleInitListImage(properties);
		setSpeciesAndRank({ species, rankLevel });
		setInitImages(initListImage);
		setDefaultImages(initListImage);
		if (error) {
			const { message } = error;
			messageAntd.error(message);
			setTimeout(() => {
				router.push(ROUTES.LIST_DNFT);
			}, 2000);
		}
	};

	const onChangeValue = (event: any, propertyName: string) => {
		const { key } = event;
		const initImagesClone = cloneDeep(initImages);
		const newInitImages = initImagesClone.map((propertyImgae: IInitImage) => {
			const { valuesSpecialOrder, zIndex, specialOrderLayer } = propertyImgae;
			if (propertyImgae.propertyName === propertyName) {
				const isValueSpecial =
					valuesSpecialOrder.filter(
						(value: { label: string }) => value.label === key
					).length > 0;
				return {
					...propertyImgae,
					value: key,
					zIndex: isValueSpecial ? specialOrderLayer : zIndex,
				};
			}
			return { ...propertyImgae };
		});
		setInitImages(newInitImages);
	};

	const handleConvertPropertyWhenPush = (initImages: Array<IInitImage>) => {
		return initImages.reduce(
			(obj, item) =>
				Object.assign(obj, {
					[item.propertyName]: { type: item.type, value: item.value },
				}),
			{}
		);
	};

	const handlePermanentlyMerge = async () => {
		setLoadingPermanentlyMerge(true);
		const properties = handleConvertPropertyWhenPush(initImages);
		const params = {
			ingredient_ids: listTokenId,
			metadata: {
				species: speciesAndRank?.species,
				rankLevel: speciesAndRank?.rankLevel,
				properties,
			},
		} as IParamsDnftMerge;
		const [data, error] = await dnftPermanentMerge(params);
		if (error) {
			const { message } = error;
			setLoadingPermanentlyMerge(false);
			if (message === 'NOT_ENOUGH_AMOUNT_PROPERTIES') {
				return messageAntd.error('Bạn cần chọn đủ các thuộc tính của NFT');
			}
			return messageAntd.error(message);
		}
		if (data?.statusCode === STATUS_CODE.SUCCESS) {
			if (listTokenId && listTokenId?.length > 0) {
				const sessionId = get(data, 'data._id', '');
				const [responsePushContract, errorPushContract] = await permanentMerge(
					tokenIds
				);
				setLoadingPermanentlyMerge(false);
				if (errorPushContract) return messageAntd.error('Transaction Rejected');
				if (responsePushContract) {
					messageAntd.success('You can claim your NFT in My Profile');
					setTimeout(() => {
						router.push(`/merge-dnft/detail/${sessionId}`);
					}, 1500);
				}
			}
		}
	};

	const handleTemporaryMerge = async () => {
		setLoadingTemporaryMerge(true);
		const properties = handleConvertPropertyWhenPush(initImages);
		const params = {
			ingredient_ids: listTokenId,
			metadata: {
				species: speciesAndRank?.species,
				rankLevel: speciesAndRank?.rankLevel,
				properties,
			},
		} as IParamsDnftMerge;
		const [data, error] = await dnftTempoaryMerge(params);
		if (error) {
			const { message } = error;
			setLoadingTemporaryMerge(false);
			if (message === 'NOT_ENOUGH_AMOUNT_PROPERTIES') {
				return messageAntd.error('Bạn cần chọn đủ các thuộc tính của NFT');
			}
			return messageAntd.error(message);
		}
		if (data?.statusCode === STATUS_CODE.SUCCESS) {
			if (listTokenId && listTokenId?.length > 0) {
				const sessionId = get(data, 'data._id', '');
				const paramsSignature = {
					session_id: sessionId,
				};
				const [signatureMerge] = await getSignatureMerge(paramsSignature);
				const [responsePushContract, errorPushContract] = await temporaryMerge(
					listTokenId,
					sessionId,
					signatureMerge
				);
				setLoadingTemporaryMerge(false);
				if (errorPushContract) return messageAntd.error('Transaction Rejected');
				if (responsePushContract) {
					messageAntd.success('Your NFT will be locked in 30 days');
					setTimeout(() => {
						router.push(ROUTES.MY_PROFILE);
					}, 1500);
				}
			}
		}
	};

	const onResetAllSetting = () => {
		setInitImages(defaultImages);
	};

	const renderImages = () => {
		return initImages.map((property: IInitImage, index: number) => {
			const { assetBase, extension, isAsset, propertyName, zIndex, value } =
				property;
			const linkImage = value ? `${assetBase}/${value}${extension}` : '';
			if (!isAsset || !linkImage) return null;
			return (
				<Image
					key={index}
					className={`!absolute !inset-0 !w-[600px] !h-[600px]`}
					layout='fill'
					src={linkImage}
					style={{ zIndex: `${zIndex}` }}
					width='100%'
					height='100%'
					alt={propertyName}
					objectFit='contain'
				/>
			);
		});
	};

	return (
		<div>
			<Button
				onClick={onResetAllSetting}
				label='Reset all setting'
				classCustom='bg-purple-20 rounded-[40px] !rounded-[40px] bg-purple-30 hover:bg-purple-30 focus:bg-purple-30 !py-3 px-8'
			/>
			<div className='px-4 py-3 bg-pink-10 text-red-20 text-sm font-normal flex items-center mt-8'>
				<ExclamationCircleOutlined twoToneColor='#F02727' className='mr-3' />
				Notice: choosen NFT will be burned after 30 days if you agree to
				Temporary merge (immediately if permantly merge)
			</div>
			<div className='flex gap-x-12 mt-6'>
				<div>
					<div className='relative w-[400px] h-[400px]'>{renderImages()}</div>
					<div className='flex flex-col items-center gap-y-3 mt-8'>
						<Button
							isLoading={isLoadingPermanentlyMerge}
							onClick={handlePermanentlyMerge}
							label='Permanently Merge'
							classCustom='bg-purple-20 !w-[350px] rounded-[40px] !rounded-[40px] bg-purple-30 hover:bg-purple-30 focus:bg-purple-30 !py-3'
						/>
						<Button
							isLoading={isLoadingTemporaryMerge}
							onClick={handleTemporaryMerge}
							label='Temporary Merge'
							classCustom='bg-transparent hover:bg-transparent hover:text-purple-30 focus:bg-transparent shadow-none text-purple-30 !border-purple-30 !border-solid !border-2 !w-[350px] !rounded-[40px] !py-3'
						/>
					</div>
				</div>
				<div className='grid gap-x-12 gap-y-5 grid-cols-2 h-fit'>
					{initImages.map((property: IInitImage, index: number) => {
						const { propertyName, values, value } = property;
						if (propertyName === PROPERTY.GLOVESDEFAULT) return null;
						return (
							<DropdownMegeDnft
								list={values}
								label={propertyName}
								key={index}
								value={value}
								customStyle='!max-w-[330px] !w-[290px]'
								onClick={(event) => onChangeValue(event, propertyName)}
							/>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default MergeDNFT;