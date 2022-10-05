// import { Form, Input, Pagination } from 'antd';
// import { updateMyProfile } from 'apis/my-profile';
// import BoxPool from 'common/components/boxPool';
// import Countdown from 'common/components/countdown';
// import Dropdown from 'common/components/dropdown';
// import HelmetCommon from 'common/components/helmet';
// import CustomRadio from 'common/components/radio';
// import MyTable from 'common/components/table';
// import { ROUTES } from 'common/constants/constants';
// import dayjs from 'common/helpers/dayjs';
// import { isValidEmail } from 'common/helpers/email';
// import { formatConcurrency } from 'common/helpers/number';
// import { cloneDeep, get } from 'lodash';
// import { IBuyKeyStatus, IDNFT } from 'modules/my-profile/interfaces';
// import {
// 	columns,
// 	statusItems,
// 	statusMap,
// 	typesItems,
// } from 'modules/my-profile/metadata';
// import { copyToClipboard } from 'modules/my-profile/services';

import HelmetCommon from 'common/components/helmet';
import { ROUTES } from 'common/constants/constants';
import BuyInfo from 'modules/my-profile/components/BuyInfo';
import MyDNFT from 'modules/my-profile/components/MyDNFT';
import PersonalInfo from 'modules/my-profile/components/PersonalInfo';

// import { selectList } from 'pages/token-presale-rounds/detail/[index]';
// import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { toast } from 'react-toastify';
// import { getMyDNFTsRD, getMyProfileRD } from 'stores/my-profile';

// import { AbiDnft, AbiKeynft } from 'web3/abis/types';
// import {
// 	NEXT_PUBLIC_BUSD,
// 	NEXT_PUBLIC_DNFT,
// 	NEXT_PUBLIC_KEYNFT,
// } from 'web3/contracts/instance';
// import { useContract } from 'web3/contracts/useContract';
// import { useApprovalBusd } from 'web3/hooks';
// import DNFTABI from '../../modules/web3/abis/abi-dnft.json';
// import KeyNFTABI from '../../modules/web3/abis/abi-keynft.json';

// const bscscanUrl = process.env.NEXT_PUBLIC_BSCSCAN_URL || 'https://bscscan.com';

// const MyProfile = () => {
// 	const LIMIT = 10;
// 	const [tokenCode, setTokenCode] = useState('BUSD');
// 	const [claimableTime, setClaimableTime] = useState(0);
// 	const dispatch = useDispatch<any>();
// 	const { isLogin } = useSelector((state) => state.user);
// 	const { userInfo, dnfts } = useSelector((state) => state.myProfile);
// 	const { systemSetting } = useSelector((state) => state.systemSetting);

// 	const keyNFTContract = useContract<AbiKeynft>(KeyNFTABI, NEXT_PUBLIC_KEYNFT);

// 	const dnftContract = useContract<AbiDnft>(DNFTABI, NEXT_PUBLIC_DNFT);
// 	const { tryApproval, allowanceAmount } = useApprovalBusd(
// 		NEXT_PUBLIC_BUSD,
// 		NEXT_PUBLIC_KEYNFT
// 	);

// 	const emailRef = useRef(null);

// 	const onFinish = () => {};

// 	const currentStatus = useMemo((): IBuyKeyStatus | null => {
// 		if (!userInfo || !systemSetting) {
// 			return statusMap['unavailable'];
// 		}
// 		const currentDate = dayjs().date();
// 		if (currentDate > systemSetting.mint_days) {
// 			return statusMap['upcoming'];
// 		}

// 		if (get(userInfo, 'nft_holding') < 1) {
// 			return statusMap['need_nft'];
// 		}
// 		return statusMap['available'];
// 	}, [systemSetting, userInfo]);

// 	const [isCanSave, setIsCanSave] = useState(false);
// 	const handleUpdateMyProfile = async () => {
// 		const email = get(emailRef, 'current.input.value', '');
// 		await updateMyProfile(
// 			{ email },
// 			async () => {
// 				toast.success('Update profile successfully');
// 				await dispatch(getMyProfileRD());
// 				setIsCanSave(false);
// 			},
// 			(err) => {
// 				toast.error(JSON.stringify(err));
// 			}
// 		);
// 	};

// 	const handleGetClaimableTime = async () => {
// 		if (dnftContract) {
// 			const time = await dnftContract.claimableTime();
// 			setClaimableTime(time.toNumber());
// 		}
// 	};

// 	const onChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
// 		if (!userInfo) {
// 			return;
// 		}
// 		const currentMail = get(e.target, 'value', '');
// 		if (currentMail !== userInfo.email && isValidEmail(currentMail)) {
// 			setIsCanSave(true);
// 		} else {
// 			setIsCanSave(false);
// 		}
// 	};

// 	useEffect(() => {
// 		if (isLogin) {
// 			dispatch(getMyDNFTsRD({ page: 1, limit: LIMIT }));
// 			dispatch(getMyProfileRD());
// 		}
// 	}, [isLogin]);

// 	useEffect(() => {
// 		if (dnftContract) {
// 			handleGetClaimableTime();
// 		}
// 	}, [dnftContract]);

// 	const { inTimeBuyKey, secondsRemain } = useMemo(() => {
// 		if (!systemSetting) {
// 			return {
// 				inTimeBuyKey: false,
// 				secondsRemain: 0,
// 			};
// 		}
// 		const currentDate = dayjs().date();
// 		if (currentDate > systemSetting.mint_days) {
// 			const secondsRemain = dayjs().endOf('month').diff(dayjs(), 'second');
// 			return {
// 				inTimeBuyKey: false,
// 				secondsRemain,
// 			};
// 		}
// 		const secondsRemain = dayjs(
// 			`${dayjs().format('YYYY-MM')}-${systemSetting.mint_days} 00:00:00`
// 		).diff(dayjs(), 'second');

// 		return {
// 			inTimeBuyKey: true,
// 			secondsRemain,
// 		};
// 	}, [systemSetting]);

// 	const mutantDNFTs = useMemo(() => {
// 		let canClaim = false;
// 		const currentDate = dayjs().unix();
// 		if (currentDate > claimableTime) {
// 			canClaim = true;
// 		}

// 		if (!dnfts) {
// 			return [];
// 		}
// 		if (canClaim) {
// 			return dnfts.data.map((item: IDNFT) => {
// 				return {
// 					...item,
// 					Claimable_date: dayjs.unix(claimableTime).format('DD-MMM-YYYY HH:mm'),
// 					canClaim: true,
// 				};
// 			});
// 		}

// 		return dnfts.data.map((item) => {
// 			const cloneItem = cloneDeep(item);
// 			const metadata = cloneItem.metadata;
// 			metadata.species = 'TBA';
// 			metadata.rankLevel = 'TBA';

// 			return {
// 				...cloneItem,
// 				Claimable_date: dayjs.unix(claimableTime).format('DD-MMM-YYYY HH:mm'),
// 				canClaim: false,
// 			};
// 		});
// 	}, [dnfts, claimableTime]);

// 	const handleBuyKey = async () => {
// 		if (!keyNFTContract || !systemSetting) {
// 			return;
// 		}
// 		if (tokenCode === 'BUSD') {
// 			if (allowanceAmount && +allowanceAmount < systemSetting.key_price) {
// 				await tryApproval(true)
// 					.then(() => {})
// 					.catch(() => {
// 						toast.error('Transaction Rejected');
// 					});
// 			}

// 			await keyNFTContract
// 				.buyUsingBUSD()
// 				.then((res) => {
// 					return res.wait();
// 				})
// 				.then((res) => {
// 					toast.success('Transaction completed', {
// 						onClick: () => {
// 							window.open(`${bscscanUrl}/tx/${res.transactionHash}`, '_blank');
// 						},
// 					});
// 				})
// 				.catch((err) => {
// 					if (err.code === 'ACTION_REJECTED') {
// 						toast.error('Transaction Rejected');
// 					} else {
// 						toast.error('Transaction Failed');
// 					}
// 				});
// 		} else {
// 			await keyNFTContract
// 				.buyUsingBNB()
// 				.then((res) => {
// 					return res.wait();
// 				})
// 				.then((res) => {
// 					toast.success('Transaction completed', {
// 						onClick: () => {
// 							window.open(`${bscscanUrl}/tx/${res.transactionHash}`, '_blank');
// 						},
// 					});
// 				})
// 				.catch((err) => {
// 					if (err.code === 'ACTION_REJECTED') {
// 						toast.error('Transaction Rejected');
// 					} else {
// 						toast.error('Transaction Failed');
// 					}
// 				});
// 		}
// 	};

// 	const canClaimAll = useMemo(() => {
// 		if (!mutantDNFTs) {
// 			return false;
// 		}
// 		return mutantDNFTs.every((item) => item.canClaim);
// 	}, [mutantDNFTs]);

// 	return (
// 		<>
// 			<HelmetCommon
// 				title='My Profile'
// 				description='Description my profile ...'
// 				href={ROUTES.MY_PROFILE}
// 			/>
// 			<div className='flex flex-col gap-2.5 desktop:gap-y-6'>
// 				<div
// 					className={'flex flex-col desktop:flex-row gap-2.5 desktop:gap-x-6'}
// 				>
// 					{userInfo && (
// 						<BoxPool customClass={'desktop:w-[50%]'}>
// 							<div className='flex justify-between items-center pb-[12px] border-[#36c1ff1a] border-b-[3px]'>
// 								<h5 className={`text-[18px] font-semibold text-white`}>
// 									My profile
// 								</h5>

// 							<button
// 								disabled={!isCanSave}
// 								onClick={() => handleUpdateMyProfile()}
// 								className='rounded-[40px] border-[2px] border-[#D47AF5] font-semibold text-[#D47AF5] px-[25px] py-[8px] disabled:bg-[#2B3A51] disabled:text-[#ffffff4d] disabled:border-[#2B3A51]'
// 							>
// 								Save
// 							</button>
// 						</div>

// 						<Form
// 							name='verify-email'
// 							className='mt-[22px]'
// 							layout='vertical'
// 							onFinish={onFinish}
// 							onFinishFailed={() => {}}
// 							autoComplete='off'
// 							initialValues={{
// 								'email-address': userInfo.email,
// 								'my-wallet-address': userInfo.wallet_address,
// 								'number-of-key': userInfo.key_holding_count,
// 							}}
// 						>
// 							<Form.Item
// 								label='My wallet address:'
// 								name='my-wallet-address'
// 								rules={[]}
// 							>
// 								<Input
// 									disabled
// 									suffix={
// 										<button
// 											className='px-[10px]'
// 											onClick={() => copyToClipboard(userInfo.wallet_address)}
// 										>
// 											<img src='/icons/copy.svg' alt='' />
// 										</button>
// 									}
// 									className='custom-input-wrapper'
// 								/>
// 							</Form.Item>
// 							<Form.Item
// 								label='Email address:'
// 								name='email-address'
// 								rules={[
// 									{
// 										validator(rule, value) {
// 											if (value && !isValidEmail(value)) {
// 												return Promise.reject(
// 													'Please enter a correct email, example "abc@mail.com"'
// 												);
// 											}
// 										},
// 									},
// 								]}
// 							>
// 								<Input
// 									ref={emailRef}
// 									onChange={(e) => onChangeEmail(e)}
// 									placeholder='Email address'
// 									className='custom-input-wrapper'
// 								/>
// 							</Form.Item>
// 							<Form.Item
// 								label='Number of key(s): '
// 								name='number-of-key'
// 								rules={
// 									[
// 										// { required: true, message: 'This field cannot be empty.' },
// 									]
// 								}
// 							>
// 								<Input
// 									disabled
// 									placeholder='Number of key'
// 									className='custom-input-wrapper disabled:border-[#ffffff33]'
// 								/>
// 							</Form.Item>
// 						</Form>
// 					</BoxPool>
// 				)}
// 				<BoxPool customClass='w-[50%]'>
// 					<h5 className={`text-[18px] font-semibold text-white  pb-[27px] `}>
// 						Buy Info
// 					</h5>
// 					{currentStatus && (
// 						<div className={currentStatus.boxStyle}>
// 							<img src={currentStatus.icon} className='mr-[10px]' />
// 							<p className={currentStatus.messageStyle}>
// 								{currentStatus.message}
// 							</p>
// 						</div>
// 					)}

// 					<div className='flex items-center  justify-between  mt-6 text-[#ffffff80] pb-[24px] border-b-[2px] border-[#ffffff12]'>
// 						<div className='flex items-center'>
// 							<div className='text-[14px] mr-[10px]'>Price:</div>
// 							<CustomRadio
// 								onChange={(e) => setTokenCode(e.target.value)}
// 								options={selectList}
// 								defaultValue={tokenCode}
// 							/>
// 						</div>

// 						{systemSetting && (
// 							<div className='text-[16px] text-[white] font-semibold'>
// 								{formatConcurrency(systemSetting.key_price)} {tokenCode}
// 							</div>
// 						)}
// 					</div>
// 					<Countdown
// 						descriptionStyle='!text-[#ffffff80] !text-[12px] !leading-4 '
// 						boxStyle='!bg-[#8080801a] !text-[white]'
// 						titleStyle='!font-normal !text-[#ffffff80]'
// 						customClass='mt-[20px] '
// 						title={
// 							inTimeBuyKey ? 'You can not buy key in' : 'You can buy key in'
// 						}
// 						millisecondsRemain={secondsRemain}
// 					/>
// 					{get(currentStatus, 'canBuy') && inTimeBuyKey && (
// 						<button
// 							onClick={() => handleBuyKey()}
// 							className={`w-[100%] rounded-[40px] h-fit font-semibold !py-[9px] mt-[36px] btn-gradient`}
// 						>
// 							Buy
// 						</button>
// 					)}
// 				</BoxPool>
// 			</div>
// 			<div>
// 				<BoxPool>
// 					<h5
// 						className={`text-[18px] font-semibold text-white  pb-[12px] border-[#36c1ff1a] border-b-[3px]`}
// 					>
// 						My dNFT
// 					</h5>
// 					<div className='mt-6'>
// 						<div className='flex gap-x-2 mb-6 justify-between'>
// 							<div>
// 								<Dropdown
// 									customStyle='mr-[10px]'
// 									label='All statuses'
// 									list={statusItems}
// 								/>
// 								<Dropdown label='All types' list={typesItems} />
// 							</div>
// <<<<<<< HEAD

// 							<Form
// 								name='verify-email'
// 								className='mt-[22px]'
// 								layout='vertical'
// 								onFinish={onFinish}
// 								onFinishFailed={() => {}}
// 								autoComplete='off'
// 								initialValues={{
// 									'email-address': userInfo.email,
// 									'my-wallet-address': userInfo.walletAddress,
// 									'number-of-key': userInfo.keyHoldingCount,
// 								}}
// 							>
// 								<Form.Item
// 									label='My wallet address:'
// 									name='my-wallet-address'
// 									rules={[]}
// 								>
// 									<Input
// 										disabled
// 										suffix={
// 											<button
// 												className='px-[10px]'
// 												onClick={() => onCopy(userInfo.walletAddress)}
// 											>
// 												<img src='/icons/copy.svg' alt='' />
// 											</button>
// 										}
// 										className='custom-input-wrapper'
// 									/>
// 								</Form.Item>
// 								<Form.Item
// 									label='Email address:'
// 									name='email-address'
// 									rules={
// 										[
// 											// { required: true, message: 'This field cannot be empty.' },
// 										]
// 									}
// 								>
// 									<Input
// 										ref={emailRef}
// 										onChange={(e) => onChangeEmail(e)}
// 										placeholder='Email address'
// 										className='custom-input-wrapper'
// 									/>
// 								</Form.Item>
// 								<Form.Item
// 									label='Number of key(s): '
// 									name='number-of-key'
// 									rules={
// 										[
// 											// { required: true, message: 'This field cannot be empty.' },
// 										]
// 									}
// 								>
// 									<Input
// 										disabled
// 										placeholder='Number of key'
// 										className='custom-input-wrapper disabled:border-[#ffffff33]'
// 									/>
// 								</Form.Item>
// 							</Form>
// 						</BoxPool>
// 					)}

// 					<BoxPool customClass='w-[50%]'>
// 						<h5 className={`text-[18px] font-semibold text-white  pb-[27px] `}>
// 							Buy Info
// 						</h5>
// 						{canBuyKey ? (
// 							<div className='flex items-center rounded-[5px] bg-[#00d26133] px-[15px] py-[13px] w-[100%] mb-2 leading-[20px]'>
// 								<img src='/icons/check-circle.svg' className='mr-[10px]' />
// 								<p className='text-[#00D261]  text-[14px]'>
// 									Great, You are eligible to buy this key
// 								</p>
// 							</div>
// 						) : (
// 							<div className='flex items-center rounded-[5px] bg-[#f0272733] px-[15px] py-[13px] w-[100%] mb-2 leading-[20px]'>
// 								<img src='/icons/info-circle.svg' className='mr-[10px]' />
// 								<p className='text-[#F02727]  text-[14px]'>
// 									You are not elegible to buy this key
// 								</p>
// 							</div>
// 						)}
// 						<div className='flex items-center  justify-between  mt-6 text-[#ffffff80] pb-[24px] border-b-[2px] border-[#ffffff12]'>
// 							<div className='flex items-center'>
// 								<div className='text-[14px] mr-[10px]'>Price:</div>
// 								<CustomRadio
// 									onChange={(e) => setTokenCode(e.target.value)}
// 									options={selectList}
// 									defaultValue={tokenCode}
// 								/>
// 							</div>

// 							<div className='text-[16px] text-[white] font-semibold'>
// 								{price} {tokenCode}
// 							</div>
// 						</div>
// 						<Countdown
// 							descriptionStyle='!text-[#ffffff80] !text-[12px] !leading-4 '
// 							boxStyle='!bg-[#8080801a] !text-[white]'
// 							titleStyle='!font-normal !text-[#ffffff80]'
// 							customClass='mt-[20px] '
// 							title='You can buy key in '
// 						/>
// 						{canBuyKey && (
// 							<button
// 								className={`w-[100%] rounded-[40px] font-semibold py-[9px] mt-[36px] btn-gradient`}
// 							>
// 								Buy
// 							</button>
// 						)}
// 					</BoxPool>
// 				</div>
// 				<div>
// 					<BoxPool>
// 						<div className={'flex justify-between items-start mb-3'}>
// 							<h5 className={`text-h6 font-semibold text-white`}>My dNFT</h5>
// 							<button
// 								className={
// 									'desktop:hidden text-h8 text-white rounded-[40px] px-7 py-2 border-[2px] border-white/[0.3]'
// 								}
// =======
// 							<button
// 								disabled={!canClaimAll}
// 								className='text-[white] rounded-[40px] px-[27px] py-[7px] border-[2px] border-[#ffffff4d]'
// >>>>>>> 10d52ac (feat: add pagination)
// 							>
// 								Claim all
// 							</button>
// 						</div>
// <<<<<<< HEAD
// 						<hr className={'border-t border-blue-20'} />
// 						<div className='mt-6'>
// 							<div className='flex gap-x-2 mb-6 justify-between'>
// 								<div
// 									className={
// 										'flex items-center justify-between desktop:justify-start grow gap-2.5'
// 									}
// 								>
// 									<Dropdown
// 										customStyle={'!w-1/2 desktop:!w-[160px]'}
// 										label='All statuses'
// 										list={[]}
// 									/>
// 									<Dropdown
// 										customStyle={'!w-1/2 desktop:!w-[160px]'}
// 										label='All types'
// 										list={[]}
// 									/>
// 								</div>
// 								<button
// 									className={
// 										'hidden desktop:block text-h8 text-white rounded-[40px] px-7 py-2 border-[2px] border-white/[0.3]'
// 									}
// 								>
// 									Claim all
// 								</button>
// 							</div>
// 							<MyTable columns={columns} dataSource={datafake} />
// 							<div className='mt-[30px] w-[100%] flex justify-end'>
// 								<Pagination
// 									defaultCurrent={1}
// 									total={200}
// =======
// 						<MyTable columns={columns} dataSource={mutantDNFTs} />
// 						<div className='mt-[30px] w-[100%] flex justify-end'>
// 							{dnfts && (
// 								<Pagination
// 									defaultCurrent={1}
// 									pageSize={LIMIT}
// 									current={dnfts.pagination.page}
// 									total={dnfts.pagination.total}
// 									onChange={(page) => {
// 										dispatch(getMyDNFTsRD({ limit: LIMIT, page }));
// 									}}
// >>>>>>> 10d52ac (feat: add pagination)
// 									showLessItems
// 									showSizeChanger={false}
// 									className='flex items-center'
// 								/>
// <<<<<<< HEAD
// 							</div>
// =======
// 							)}
// >>>>>>> 10d52ac (feat: add pagination)
// 						</div>
// 					</BoxPool>
// 				</div>
// 			</div>
// 		</>
// 	);
// };

// export default MyProfile;

export default function MyProfile() {
	return (
		<>
			<HelmetCommon
				title='My Profile'
				description='Description my profile ...'
				href={ROUTES.MY_PROFILE}
			/>
			<div className='flex flex-col gap-2.5 desktop:gap-y-6'>
				<div className='flex flex-col desktop:flex-row gap-2.5 desktop:gap-x-6'>
					<PersonalInfo />
					<BuyInfo />
				</div>
				<MyDNFT />
			</div>
		</>
	);
}
