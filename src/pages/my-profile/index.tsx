import { Form, Input, message, Pagination } from 'antd';
import { getMyProfile } from 'apis/my-profile';
import { Form, Input, Pagination } from 'antd';
import { getMyDNFTs, getMyProfile, updateMyProfile } from 'apis/my-profile';
import BoxPool from 'common/components/boxPool';
import Countdown from 'common/components/countdown';
// import Dropdown from 'common/components/dropdown';
import HelmetCommon from 'common/components/helmet';
import CustomRadio from 'common/components/radio';
import MyTable from 'common/components/table';
import { ROUTES } from 'common/constants/constants';
import Image from 'next/image';
import dayjs from 'common/helpers/dayjs';
import { isValidEmail } from 'common/helpers/email';
import { formatConcurrency } from 'common/helpers/number';
import { get } from 'lodash';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { selectList } from 'pages/token-presale-rounds/detail/[index]';
import ReactGa from 'react-ga';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { ITypeUserInfo, setUserInfo } from 'stores/user';

import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
	ISystemSetting,
	ITypeUserInfo,
	setSystemSettings,
	setUserInfo,
} from 'stores/user';
const columns = [
	{
		title: 'Species',
		dataIndex: 'Species',
		render: (Species: string) => {
			return <Link href='/nft-detail'>{Species}</Link>;
		},
		width: '30%',
	},
	{
		title: 'Rarity',
		dataIndex: 'Rarity',
		render: (Rarity: string) => {
			return <Link href='/nft-detail'>{Rarity}</Link>;
		},
		width: '30%',
	},
	{
		title: 'Claimable date',
		dataIndex: 'Claimable_date',
		render: (Claimable_date: string) => {
			return <Link href='/nft-detail'>{Claimable_date}</Link>;
		},
		width: '30%',
	},
	{
		render: () => {
			return (
				<Link className='flex justify-end' href='/nft-detail'>
					<button className='text-[#D47AF5] font-semibold rounded-[40px] px-[27px] py-[7px] border-[2px] border-[#D47AF5] flex ml-auto'>
						Claim
					</button>
				</Link>
			);
		},
	},
];

const datafake = [
	{
		Species: 'Kinga',
		Rarity: 'Common',
		Claimable_date: '30-Apr-2022 16:00',
	},
	{
		Species: 'Kinga',
		Rarity: 'Common',
		Claimable_date: '30-Apr-2022 16:00',
	},
	{
		Species: 'Kinga',
		Rarity: 'Common',
		Claimable_date: '30-Apr-2022 16:00',
	},
];

interface Status {
	message: string;
	icon: string;
	boxStyle: string;
	messageStyle: string;
	canBuy: boolean;
}

const statusMap = {
	unavailable: null,
	upcoming: {
		message: 'Key can be mint when the dNFT sale round start',
		icon: '/icons/info-circle.svg',
		boxStyle:
			'flex items-center rounded-[5px] bg-[#f0272733] px-[15px] py-[13px] w-[100%] mb-2 leading-[20px]',
		messageStyle: 'text-[#F02727]  text-[14px]',
		canBuy: false,
	},
	need_nft: {
		message: 'You are not elegible to buy this key',
		icon: '/icons/info-circle.svg',
		boxStyle:
			'flex items-center rounded-[5px] bg-[#f0272733] px-[15px] py-[13px] w-[100%] mb-2 leading-[20px]',
		messageStyle: 'text-[#F02727]  text-[14px]',
		canBuy: false,
	},
	available: {
		message: 'Great! You are eligible to buy the key',
		icon: '/icons/check-circle.svg',
		boxStyle:
			'flex items-center rounded-[5px] bg-[#00d26133] px-[15px] py-[13px] w-[100%] mb-2 leading-[20px]',
		messageStyle: 'text-[#00D261]  text-[14px]',
		canBuy: true,
	},
};

const MyProfile = () => {
	const price = 100000;
	const [tokenCode, setTokenCode] = useState('BUSD');
	const canBuyKey = true;
	const router = useRouter();
	useEffect(() => {
		ReactGa.initialize(process?.env?.NEXT_PUBLIC_GA_TRACKING_CODE || '');
		// to report page view Google Analytics
		ReactGa.pageview(router?.pathname || '');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	const { isLogin } = useSelector((state) => state.user);

	const onFinish = () => {};

	const [, setMyDNFT] = useState([]);

	const { userInfo, isLogin, systemSetting } = useSelector(
		(state) => state.user
	);
	// const { library: provider } = useWeb3React()
	// const keyNFTContract = useContract(
	// 	KeyNFTABI,
	// 	NEXT_PUBLIC_KEYNFT
	// );
	// const { tryApproval, allowanceAmount, } = useApprovalBusd(NEXT_PUBLIC_BUSD, NEXT_PUBLIC_KEYNFT,);

	useEffect(() => {}, []);

	const emailRef = useRef(null);

	const onFinish = () => {};

	const onCopy = (data: string) => {
		navigator.clipboard.writeText(data);
		toast.info('Copied to clipboard', {
			theme: 'dark',
		});
	};

	const currentStatus = useMemo((): Status | null => {
		if (!userInfo || !systemSetting) {
			return statusMap['unavailable'];
		}

		const currentDate = dayjs().date();
		if (currentDate > systemSetting.mintDays) {
			return statusMap['upcoming'];
		}

		if (get(userInfo, 'nftHolding') < 0) {
			return statusMap['need_nft'];
		}

		return statusMap['available'];
	}, [systemSetting, userInfo]);

	const [isCanSave, setIsCanSave] = useState(false);

	const handleGetMyProfile = async () => {
		await getMyProfile(
			(res) => {
				const {
					wallet_address,
					email,
					firstname,
					key_holding,
					lastname,
					nft_holding,
					key_holding_count,
				} = get(res, 'data.data.profile', {});
				const userInfo: ITypeUserInfo = {
					walletAddress: wallet_address,
					email,
					firstName: firstname,
					lastName: lastname,
					keyHolding: key_holding,
					nftHolding: nft_holding,
					keyHoldingCount: key_holding_count,
				};
				setUserInfo(userInfo);

				const { mint_days } = get(res, 'data.data.system_setting', {});
				const systemSetting: ISystemSetting = {
					mintDays: mint_days,
				};
				setSystemSettings(systemSetting);
			},
			(err) => {
				message.error(JSON.stringify(err));
				toast.error(JSON.stringify(err));
			}
		);
	};

	const handleGetMyDNFT = async () => {
		await getMyDNFTs(1).then((res) => {
			const data = get(res, 'data.data.list', []);
			setMyDNFT(data);
		});
	};

	const handleUpdateMyProfile = async () => {
		const email = get(emailRef, 'current.input.value', '');
		await updateMyProfile(
			{ email },
			async () => {
				toast.success('Update successfully');
				await handleGetMyProfile();
				setIsCanSave(false);
			},
			(err) => {
				toast.error(JSON.stringify(err));
			}
		);
	};

	const onChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
		const currentMail = get(e.target, 'value', '');
		if (currentMail !== userInfo?.email && isValidEmail(currentMail)) {
			setIsCanSave(true);
		} else {
			setIsCanSave(false);
		}
	};

	useEffect(() => {
		if (isLogin) {
			handleGetMyDNFT();
			handleGetMyProfile();
		}
	}, [isLogin]);

	const { inTimeBuyKey, secondsRemain } = useMemo(() => {
		if (!systemSetting) {
			return {
				inTimeBuyKey: false,
				secondsRemain: 0,
			};
		}
		const currentDate = dayjs().date();
		if (currentDate > systemSetting.mintDays) {
			const secondsRemain = dayjs().endOf('month').diff(dayjs(), 'second');
			return {
				inTimeBuyKey: false,
				secondsRemain,
			};
		}
		const secondsRemain = dayjs(
			`${dayjs().format('YYYY-MM')}-${systemSetting.mintDays} 00:00:00`
		).diff(dayjs(), 'second');

		return {
			inTimeBuyKey: true,
			secondsRemain,
		};
	}, [systemSetting]);

	// const handleBuyKey = async () => {
	// 	const signer = provider.getSigner();
	// 	const signature = await signer.signMessage(SIGN_MESSAGE);
	// 	console.log(signature)

	// 	if (tokenCode === "BUSD") {
	// 		if (allowanceAmount && +allowanceAmount < price) {
	// 			await tryApproval(true).catch((err) => {
	// 				toast.error(JSON.stringify(err));
	// 			});

	// 		}
	// 		console.log("here")
	// 		console.log(keyNFTContract)
	// 		await keyNFTContract?.buyUsingBUSD(
	// 			NEXT_PUBLIC_BUSD, signature
	// 		).then((res) => {

	// 		})
	// 	}
	// }

	return (
		<>
			<HelmetCommon
				title='My Profile'
				description='Description my profile ...'
				href={ROUTES.MY_PROFILE}
			/>
			<div className='flex flex-col gap-2.5 desktop:gap-y-6'>
				<div
					className={'flex flex-col desktop:flex-row gap-2.5 desktop:gap-x-6'}
				>
					{userInfo && (
						<BoxPool customClass={'desktop:w-[50%]'}>
							<div className='flex justify-between items-center pb-[12px] border-[#36c1ff1a] border-b-[3px]'>
								<h5 className={`text-[18px] font-semibold text-white`}>
									My profile
								</h5>

							<button
								disabled={!isCanSave}
								onClick={() => handleUpdateMyProfile()}
								className='rounded-[40px] border-[2px] border-[#D47AF5] font-semibold text-[#D47AF5] px-[25px] py-[8px] disabled:bg-[#2B3A51] disabled:text-[#ffffff4d] disabled:border-[#2B3A51]'
							>
								Save
							</button>
						</div>

						<Form
							name='verify-email'
							className='mt-[22px]'
							layout='vertical'
							onFinish={onFinish}
							onFinishFailed={() => {}}
							autoComplete='off'
							initialValues={{
								'email-address': userInfo.email,
								'my-wallet-address': userInfo.walletAddress,
								'number-of-key': userInfo.keyHoldingCount,
							}}
						>
							<Form.Item
								label='My wallet address:'
								name='my-wallet-address'
								rules={[]}
							>
								<Input
									disabled
									suffix={
										<button
											className='px-[10px]'
											onClick={() => onCopy(userInfo.walletAddress)}
										>
											<img src='/icons/copy.svg' alt='' />
										</button>
									}
									className='custom-input-wrapper'
								/>
							</Form.Item>
							<Form.Item
								label='Email address:'
								name='email-address'
								rules={[
									{
										validator(rule, value) {
											if (value && !isValidEmail(value)) {
												return Promise.reject(
													'Please enter a correct email, example "abc@mail.com"'
												);
											}
										},
									},
								]}
							>
								<Input
									ref={emailRef}
									onChange={(e) => onChangeEmail(e)}
									placeholder='Email address'
									className='custom-input-wrapper'
								/>
							</Form.Item>
							<Form.Item
								label='Number of key(s): '
								name='number-of-key'
								rules={
									[
										// { required: true, message: 'This field cannot be empty.' },
									]
								}
							>
								<Input
									disabled
									placeholder='Number of key'
									className='custom-input-wrapper disabled:border-[#ffffff33]'
								/>
							</Form.Item>
						</Form>
					</BoxPool>
				)}
				<BoxPool customClass='w-[50%]'>
					<h5 className={`text-[18px] font-semibold text-white  pb-[27px] `}>
						Buy Info
					</h5>
					{currentStatus && (
						<div className={currentStatus.boxStyle}>
							<img src={currentStatus.icon} className='mr-[10px]' />
							<p className={currentStatus.messageStyle}>
								{currentStatus.message}
							</p>
						</div>
					)}

					<div className='flex items-center  justify-between  mt-6 text-[#ffffff80] pb-[24px] border-b-[2px] border-[#ffffff12]'>
						<div className='flex items-center'>
							<div className='text-[14px] mr-[10px]'>Price:</div>
							<CustomRadio
								onChange={(e) => setTokenCode(e.target.value)}
								options={selectList}
								defaultValue={tokenCode}
							/>
						</div>

						<div className='text-[16px] text-[white] font-semibold'>
							{formatConcurrency(price)} {tokenCode}
						</div>
					</div>
					<Countdown
						descriptionStyle='!text-[#ffffff80] !text-[12px] !leading-4 '
						boxStyle='!bg-[#8080801a] !text-[white]'
						titleStyle='!font-normal !text-[#ffffff80]'
						customClass='mt-[20px] '
						title={
							inTimeBuyKey ? 'You can not buy key in' : 'You can buy key in'
						}
						millisecondsRemain={secondsRemain}
					/>
					{get(currentStatus, 'canBuy') && inTimeBuyKey && (
						<button
							// onClick={() => handleBuyKey()}
							className={`w-[100%] rounded-[40px] font-semibold py-[9px] mt-[36px] btn-gradient`}
						>
							Buy
						</button>
					)}
				</BoxPool>
			</div>
			<div>
				<BoxPool>
					<h5
						className={`text-[18px] font-semibold text-white  pb-[12px] border-[#36c1ff1a] border-b-[3px]`}
					>
						My dNFT
					</h5>
					<div className='mt-6'>
						<div className='flex gap-x-2 mb-6 justify-between'>
							<div>
								<Dropdown
									customStyle='mr-[10px]'
									label='All statuses'
									list={[]}
								/>
								<Dropdown label='All types' list={[]} />
							</div>

							<Form
								name='verify-email'
								className='mt-[22px]'
								layout='vertical'
								onFinish={onFinish}
								onFinishFailed={() => {}}
								autoComplete='off'
								initialValues={{
									'email-address': userInfo.email,
									'my-wallet-address': userInfo.walletAddress,
									'number-of-key': userInfo.keyHoldingCount,
								}}
							>
								<Input
									suffix={
										<button className='px-[10px]'>
											<Image
												width={24}
												height={24}
												objectFit='contain'
												src='/icons/copy.svg'
												alt='AddressMyProfile'
											/>
										</button>
								<Form.Item
									label='My wallet address:'
									name='my-wallet-address'
									rules={[]}
								>
									<Input
										disabled
										suffix={
											<button
												className='px-[10px]'
												onClick={() => onCopy(userInfo.walletAddress)}
											>
												<img src='/icons/copy.svg' alt='' />
											</button>
										}
										className='custom-input-wrapper'
									/>
								</Form.Item>
								<Form.Item
									label='Email address:'
									name='email-address'
									rules={
										[
											// { required: true, message: 'This field cannot be empty.' },
										]
									}
								>
									<Input
										ref={emailRef}
										onChange={(e) => onChangeEmail(e)}
										placeholder='Email address'
										className='custom-input-wrapper'
									/>
								</Form.Item>
								<Form.Item
									label='Number of key(s): '
									name='number-of-key'
									rules={
										[
											// { required: true, message: 'This field cannot be empty.' },
										]
									}
								>
									<Input
										disabled
										placeholder='Number of key'
										className='custom-input-wrapper disabled:border-[#ffffff33]'
									/>
								</Form.Item>
							</Form>
						</BoxPool>
					)}

					<BoxPool customClass='w-[50%]'>
						<h5 className={`text-[18px] font-semibold text-white  pb-[27px] `}>
							Buy Info
						</h5>
						{canBuyKey ? (
							<div className='flex items-center rounded-[5px] bg-[#00d26133] px-[15px] py-[13px] w-[100%] mb-2 leading-[20px]'>
								<div className='mr-[10px]'>
									<Image
										width={24}
										height={24}
										src='/icons/check-circle.svg'
										alt='BuyMyProfile'
										objectFit='contain'
									/>
								</div>
								<p className='text-[#00D261] mb-[2.5px] text-[14px]'>
									Great, You are eligible to buy this key
								</p>
							</div>
						) : (
							<div className='flex items-center rounded-[5px] bg-[#f0272733] px-[15px] py-[13px] w-[100%] mb-2 leading-[20px]'>
								<div className='mr-[10px]'>
									<Image
										width={24}
										height={24}
										src='/icons/info-circle.svg'
										alt='BuyMyProfile'
										objectFit='contain'
									/>
								</div>
								<p className='text-[#F02727]  text-[14px]'>
									You are not elegible to buy this key
								</p>
							</div>
						)}
						<div className='flex items-center  justify-between  mt-6 text-[#ffffff80] pb-[24px] border-b-[2px] border-[#ffffff12]'>
							<div className='flex items-center'>
								<div className='text-[14px] mr-[10px]'>Price:</div>
								<CustomRadio
									onChange={(e) => setTokenCode(e.target.value)}
									options={selectList}
									defaultValue={tokenCode}
								/>
							</div>

							<div className='text-[16px] text-[white] font-semibold'>
								{price} {tokenCode}
							</div>
						</div>
						<Countdown
							descriptionStyle='!text-[#ffffff80] !text-[12px] !leading-4 '
							boxStyle='!bg-[#8080801a] !text-[white]'
							titleStyle='!font-normal !text-[#ffffff80]'
							customClass='mt-[20px] '
							title='You can buy key in '
						/>
						{canBuyKey && (
							<button
								className={`w-[100%] rounded-[40px] font-semibold py-[9px] mt-[36px] btn-gradient`}
							>
								Buy
							</button>
						)}
					</BoxPool>
				</div>
				<div>
					<BoxPool>
						<div className={'flex justify-between items-start mb-3'}>
							<h5 className={`text-h6 font-semibold text-white`}>My dNFT</h5>
							<button
								className={
									'desktop:hidden text-h8 text-white rounded-[40px] px-7 py-2 border-[2px] border-white/[0.3]'
								}
							>
								Claim all
							</button>
						</div>
						<hr className={'border-t border-blue-20/[0.1]'} />
						<div className='mt-6'>
							<div className='flex gap-x-2 mb-6 justify-between'>
								<div
									className={
										'flex items-center justify-between desktop:justify-start grow gap-2.5'
									}
								>
									{/* <Dropdown
										customStyle={'!w-1/2 desktop:!w-[160px]'}
										label='All statuses'
										list={[]}
									/>
									<Dropdown
										customStyle={'!w-1/2 desktop:!w-[160px]'}
										label='All types'
										list={[]}
									/> */}
								</div>
								<button
									className={
										'hidden desktop:block text-h8 text-white rounded-[40px] px-7 py-2 border-[2px] border-white/[0.3]'
									}
								>
									Claim all
								</button>
							</div>
							<MyTable
								columns={columns}
								dataSource={datafake}
								className={'hidden desktop:inline-block w-full'}
							/>
							<div className={'desktop:hidden'}>
								{datafake.map((value, item) => {
									return (
										<>
											<div className={'flex flex-col gap-6 mb-6'} key={item}>
												<hr className={'border-t border-white/[0.07]'} />
												<Link className='flex justify-end' href='/nft-detail'>
													<button className='text-[#D47AF5] font-semibold rounded-[40px] px-[27px] py-[7px] border-[2px] border-[#D47AF5] flex ml-auto'>
														Claim
													</button>
												</Link>
												<div className={'flex justify-between items-center'}>
													<div className={'text-h8 text-blue-20 font-medium'}>
														Species
													</div>
													<Link
														className={'text-h8 text-white font-bold'}
														href='/nft-detail'
													>
														{value.Species}
													</Link>
												</div>
												<div className={'flex justify-between items-center'}>
													<div className={'text-h8 text-blue-20 font-medium'}>
														Rarity
													</div>
													<Link
														className={'text-h8 text-white font-bold'}
														href='/nft-detail'
													>
														{value.Rarity}
													</Link>
												</div>
												<div className={'flex justify-between items-center'}>
													<div className={'text-h8 text-blue-20 font-medium'}>
														Claimable data
													</div>
													<Link
														className={'text-h8 text-white font-bold'}
														href='/nft-detail'
													>
														{value.Claimable_date}
													</Link>
												</div>
											</div>
										</>
									);
								})}
							</div>
							<div className='mt-[30px] w-[100%] flex justify-end'>
								<Pagination
									defaultCurrent={1}
									total={200}
									showLessItems
									showSizeChanger={false}
									className='flex items-center'
								/>
							</div>
						</div>
					</BoxPool>
				</div>
			</div>
		</>
	);
};

export default MyProfile;
