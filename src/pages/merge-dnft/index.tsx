import { message, message as messageAntd } from 'antd';
import { cloneDeep, get } from 'lodash';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import {
	dnftPermanentMerge,
	dnftTempoaryMerge,
	getDetailDNFT,
	getSignatureMerge,
	IParamsDnftMerge,
	IParamsMergeRuleDFNT,
	mergeRuleDFNT,
} from 'apis/mergeDnft';
import { ROUTES, STATUS_CODE } from 'common/constants/constants';
import { PROPERTY } from 'common/constants/mergeDNFT';
import Button from 'common/components/button';
import {
	getMergeTax,
	permanentMerge,
	temporaryMerge,
} from 'web3/contracts/useContractDNFT';
import DropdownMegeDnft from 'common/components/dropdown/DropdownMegeDnft';
import {
	handleUserApproveERC20,
	isUserApprovedERC20,
} from 'web3/contracts/useBep20Contract';
import { NEXT_PUBLIC_BUSD, NEXT_PUBLIC_DNFT } from 'web3/contracts/instance';
import { useAppSelector } from 'stores';
import { getNonces } from 'web3/contracts/useContractTokenSale';

interface IInitImage {
	assetBase: string;
	extension: string;
	isAsset: boolean;
	propertyName: string;
	zIndex: number | undefined;
	specialOrderLayer: number | undefined;
	value: string;
	orderLayer: number | undefined;
	valueDefault: string;
	displayName: string;
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
		displayName: string;
		isRequired: boolean | undefined;
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
	const [speciesAndRank, setSpeciesAndRank] = useState<ISpeciesAndRank>();
	const [isLoadingPermanentlyMerge, setLoadingPermanentlyMerge] =
		useState<boolean>(false);
	const [isLoadingTemporaryMerge, setLoadingTemporaryMerge] =
		useState<boolean>(false);
	const [isDisableMerge, setDisableMerge] = useState<boolean>(false);
	const [sessionId, setSessionId] = useState<string>('');
	const [transactionHash, setTransactionHash] = useState<string>('');

	//state store
	const { isLogin } = useAppSelector((state) => state.user);
	const { addressWallet } = useAppSelector((state) => state.wallet);
	useEffect(() => {
		const params = {
			ingredient_ids: listTokenId,
		} as IParamsMergeRuleDFNT;
		if (Array.isArray(listTokenId) && listTokenId?.length > 0) {
			handleGetMergeRule(params);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [listTokenId, isLogin]);

	const handleInitListImage = (properties: IProperty) => {
		const initListImage = [];
		const valueDefault = properties[PROPERTY.FUR]?.values[0] || '';
		for (const property in properties) {
			const {
				orderLayer,
				asset,
				extension,
				values,
				valuesSpecialOrder,
				type,
				specialOrderLayer,
				displayName,
				isRequired,
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
			const value = property === PROPERTY.GLOVESDEFAULT ? valueDefault : '';
			const result = {
				zIndex: orderLayer ? (orderLayer + 10) * 10 : orderLayer,
				orderLayer: orderLayer ? (orderLayer + 10) * 10 : orderLayer,
				specialOrderLayer: specialOrderLayer
					? (specialOrderLayer + 10) * 10
					: 0,
				assetBase: asset,
				extension,
				propertyName: property,
				value: value,
				valueDefault: isRequired ? valueDefault : '',
				type,
				// property không có orderLayer thì là một thuộc tính thường, không phải ảnh
				isAsset: orderLayer ? true : false,
				values: convertValues,
				valuesSpecialOrder: convertValuesSpecialOrder,
				displayName,
			} as IInitImage;
			initListImage.push(result);
		}
		return { initListImage, valueDefault };
	};

	const handleGetMergeRule = async (params: IParamsMergeRuleDFNT) => {
		const [data, error] = await mergeRuleDFNT(params);
		if (error) {
			const { message } = error;
			if (message === 'DNFT_IS_LOCKED')
				messageAntd.error('The used NFTs are locked.');
			setTimeout(() => {
				router.push(ROUTES.LIST_DNFT);
			}, 2000);
			return;
		}
		const properties = get(data, 'data.seed.properties', {});
		const species = get(data, 'data.seed.species[0]');
		const rankLevel = get(data, 'data.seed.rankLevel[0]', '');
		const { initListImage } = handleInitListImage(properties);
		setSpeciesAndRank({ species, rankLevel });
		setInitImages(initListImage);
		setDefaultImages(initListImage);
	};

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const onChangeValue = (event: any, propertyName: string) => {
		const { key } = event;
		const initImagesClone = cloneDeep(initImages);
		const newInitImages = initImagesClone.map((propertyImgae: IInitImage) => {
			const { valuesSpecialOrder, specialOrderLayer, orderLayer } =
				propertyImgae;
			if (propertyImgae.propertyName === propertyName) {
				const isValueSpecial =
					valuesSpecialOrder.filter(
						(value: { label: string }) => value.label === key
					).length > 0;
				return {
					...propertyImgae,
					value: key,
					zIndex: isValueSpecial ? specialOrderLayer : orderLayer,
				};
			}
			return { ...propertyImgae };
		});
		setInitImages(newInitImages);
	};

	const handleConvertPropertyWhenPush = (initImages: Array<IInitImage>) => {
		return initImages.reduce((obj, item) => {
			if (item.value && !item.propertyName.includes('Default')) {
				return {
					...obj,
					[item.propertyName]: { value: item.value, type: item.type },
				};
			}
			return { ...obj };
		}, {});
	};

	useEffect(() => {
		if (sessionId) {
			const handleGetDetailDNFT = async (tokenId: string | string[]) => {
				const [response, error] = await getDetailDNFT(tokenId);
				if (error) {
					return message.error('Merge failed');
				}

				if (response) {
					const metadata = get(response, 'data.metadata', {});
					const { image, attribute } = metadata;
					if (image && attribute) {
						messageAntd.success({
							content: redirectToBSCScan(transactionHash),
							duration: 4,
						});
						router.push(`/merge-dnft/detail/${sessionId}`);
						setLoadingPermanentlyMerge(false);
					}
				}
			};

			const intervalCheckMerge = setInterval(() => {
				handleGetDetailDNFT(sessionId);
			}, 5000);

			return () => {
				clearInterval(intervalCheckMerge);
			};
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sessionId]);

	const redirectToBSCScan = (tx: string) => (
		<span>
			<a
				target={'_blank'}
				href={`${process.env.NEXT_PUBLIC_BSC_BLOCK_EXPLORER_URL}/tx/${tx}`}
				rel='noreferrer'
			>
				You can claim your NFT in My Profile
			</a>
		</span>
	);

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
		// push value merge
		const [data, error] = await dnftPermanentMerge(params);

		if (error) {
			const { message } = error;
			setLoadingPermanentlyMerge(false);
			if (message === 'NOT_ENOUGH_AMOUNT_PROPERTIES') {
				return messageAntd.error('Fur and eyes are required fields');
			}
			return messageAntd.error(message);
		}
		setDisableMerge(true);
		// get merge tax(thuế setting trên admin)
		const [mergeTax, errorGetMergeTax] = await getMergeTax();
		if (errorGetMergeTax) return;
		// check approve khi user merge
		const isUserApproved = await isUserApprovedERC20(
			NEXT_PUBLIC_BUSD,
			addressWallet,
			mergeTax,
			NEXT_PUBLIC_DNFT
		);
		if (!isUserApproved) {
			const [, error] = await handleUserApproveERC20(
				NEXT_PUBLIC_BUSD,
				NEXT_PUBLIC_DNFT,
				mergeTax
			);
			if (error) {
				setLoadingPermanentlyMerge(false);
				if (error?.error?.code === -32603) {
					return messageAntd.error('Network Error!');
				}
				return message.error('Transaction Rejected');
			}
		}
		const sessionId = get(data, 'data._id', '');
		const [nonce] = await getNonces(addressWallet);
		const paramsSignature = {
			session_id: sessionId,
			nonce
		};
		const [dataSignature] = await getSignatureMerge(paramsSignature);
		const { session_id, signature, time_stamp, token_ids } = dataSignature;
		const [responsePushContract, errorPushContract] = await permanentMerge(
			token_ids,
			time_stamp,
			session_id,
			signature
		);
		if (errorPushContract) {
			setLoadingPermanentlyMerge(false);
			if (errorPushContract?.error?.code === -32603) {
				return messageAntd.error('Network Error!');
			}
			return messageAntd.error('Transaction Rejected');
		}
		if (responsePushContract) {
			setTransactionHash(responsePushContract?.transactionHash);
			setSessionId(sessionId);
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
		// push value merge
		const [data, error] = await dnftTempoaryMerge(params);
		if (error) {
			const { message } = error;
			setLoadingTemporaryMerge(false);
			if (message === 'NOT_ENOUGH_AMOUNT_PROPERTIES') {
				return messageAntd.error('Fur and eyes are required fields');
			}
			return messageAntd.error(message);
		}
		if (data?.statusCode === STATUS_CODE.SUCCESS) {
			setDisableMerge(true);
			// get merge tax(thuế setting trên admin)
			const [mergeTax, errorGetMergeTax] = await getMergeTax();
			if (errorGetMergeTax) return;
			// check approve khi user merge
			const isUserApproved = await isUserApprovedERC20(
				NEXT_PUBLIC_BUSD,
				addressWallet,
				mergeTax,
				NEXT_PUBLIC_DNFT
			);
			if (!isUserApproved) {
				const [, error] = await handleUserApproveERC20(
					NEXT_PUBLIC_BUSD,
					NEXT_PUBLIC_DNFT,
					mergeTax
				);
				if (error) {
					setLoadingTemporaryMerge(false);
					if (error?.error?.code === -32603) {
						return messageAntd.error('Network Error!');
					}
					return message.error('Transaction Rejected');
				}
			}
			const sessionId = get(data, 'data._id', '');
			const [nonce] = await getNonces(addressWallet);
			const paramsSignature = {
				session_id: sessionId,
				nonce
			};
			const [dataSignature] = await getSignatureMerge(paramsSignature);
			const { session_id, signature, time_stamp, token_ids } = dataSignature;
			const [responsePushContract, errorPushContract] = await temporaryMerge(
				token_ids,
				time_stamp,
				session_id,
				signature
			);
			setLoadingTemporaryMerge(false);
			if (errorPushContract) {
				if (errorPushContract?.error?.code === -32603) {
					return messageAntd.error('Network Error!');
				}
				return messageAntd.error('Transaction Rejected');
			}

			if (responsePushContract) {
				messageAntd.success({
					content: 'Your NFT will be locked in 30 days',
					duration: 4,
				});
				setTimeout(() => {
					router.push(ROUTES.MY_PROFILE);
				}, 4500);
			}
		}
	};

	const onResetAllSetting = () => {
		setInitImages(defaultImages);
	};

	const renderImages = () => {
		return initImages.map((property: IInitImage, index: number) => {
			const {
				assetBase,
				extension,
				isAsset,
				propertyName,
				zIndex,
				value,
				valueDefault,
			} = property;
			const linkImage = value ? `${assetBase}/${value}${extension}` : '';
			const linkImageDefault = valueDefault
				? `${assetBase}/${valueDefault}${extension}`
				: '';
			if (!isAsset || (!linkImage && !linkImageDefault)) return null;

			return (
				<Image
					key={index}
					className={`!absolute !inset-0 !w-[400px] !h-[400px]`}
					layout='fill'
					src={linkImage ? linkImage : linkImageDefault}
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
		<div className={'relative'}>
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
			<div className='flex flex-col desktop:flex-row desktop:justify-center items-center justify-center gap-x-12 mt-6'>
				<div className='w-full desktop:w-auto'>
					<div className='relative w-full h-[350px] desktop:w-[345px] desktop:h-[345px]'>
						{renderImages()}
					</div>
					<div className='hidden desktop:flex flex-col items-center gap-3 mt-8'>
						<Button
							isDisabled={isDisableMerge}
							isLoading={isLoadingPermanentlyMerge}
							onClick={handlePermanentlyMerge}
							label='Permanently Merge'
							colorIconLoading='#fff'
							classCustom='bg-purple-20 !w-[350px] rounded-[40px] !rounded-[40px] bg-purple-30 hover:bg-purple-30 focus:bg-purple-30 !py-3'
						/>
						<Button
							isDisabled={isDisableMerge}
							isLoading={isLoadingTemporaryMerge}
							onClick={handleTemporaryMerge}
							label='Temporary Merge'
							colorIconLoading='#D47AF5'
							classCustom='bg-transparent hover:bg-transparent hover:text-purple-30 focus:bg-transparent shadow-none text-purple-30 !border-purple-30 !border-solid !border-2 !w-[350px] !rounded-[40px] !py-3'
						/>
					</div>
				</div>
				<div className='grid gap-x-12 gap-y-5 grid-cols-1 desktop:grid-cols-2 desktop:max-w-[704px] h-fit w-full mb-24'>
					{initImages.map((property: IInitImage, index: number) => {
						const { propertyName, values, value, displayName } = property;
						if (propertyName === PROPERTY.GLOVESDEFAULT) return null;
						return (
							<DropdownMegeDnft
								list={values}
								label={displayName}
								placeholder={`Choose ${displayName.toLowerCase()}`}
								key={index}
								value={value}
								customStyle='w-full'
								onClick={(event) => onChangeValue(event, propertyName)}
							/>
						);
					})}
				</div>
			</div>

			<div className='desktop:hidden bg-[#0C1E32] w-[100vw] fixed flex items-center justify-center gap-x-3 px-4 py-2 bottom-0 left-0'>
				<Button
					isDisabled={isDisableMerge}
					isLoading={isLoadingPermanentlyMerge}
					onClick={handlePermanentlyMerge}
					label='Permanently'
					classCustom='bg-purple-20 !w-[150px] rounded-[40px] !rounded-[40px] bg-purple-30 hover:bg-purple-30 focus:bg-purple-30 !py-3'
				/>
				<Button
					isDisabled={isDisableMerge}
					isLoading={isLoadingTemporaryMerge}
					onClick={handleTemporaryMerge}
					label='Temporary'
					classCustom='bg-transparent !w-[150px] hover:bg-transparent hover:text-purple-30 focus:bg-transparent shadow-none text-purple-30 !border-purple-30 !border-solid !border-2 !rounded-[40px] !py-3'
				/>
			</div>
		</div>
	);
};

export default MergeDNFT;
