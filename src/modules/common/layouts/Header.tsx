import { Layout, Button, Dropdown, Menu } from 'antd';
import React, { useEffect, useState } from 'react';
import { IconDynamic } from 'common/assets/iconography/iconBundle';
import ConnectWallet from 'wallet/connect/ConnectWallet';
import {
	setStatusModalConnectWallet,
	setStepModalConnectWallet,
} from 'stores/modal';
import { useActiveWeb3React, useConnectWallet } from 'web3/hooks';
import StorageUtils, { STORAGE_KEYS } from 'common/utils/storage';
import { EllipsisMiddle } from 'common/utils/functions';
import { STEP_MODAL_CONNECTWALLET } from 'common/constants/constants';
import { useSelector } from 'react-redux';
import Image from 'next/image';
import { LIST_SIDER } from 'common/layouts/index';
import Link from 'next/link';
import ImageBase from 'common/components/imageBase';

const { Header } = Layout;

const LayoutHeader = () => {
	const { account, active } = useActiveWeb3React();
	const [currency, setCurrency] = useState();
	const { disconnectWallet } = useConnectWallet();
	const [openMobileNav, setOpenMobileNav] = useState<boolean>(false);

	const isLogin = useSelector((state) => state.user.isLogin);
	// const addressWallet = useSelector(state => state.wallet.addressWallet);
	// const wallet = useSelector(state => state.wallet)

	useEffect(() => {
		const { networkName } = StorageUtils.getItemObject(STORAGE_KEYS.NETWORK);
		setCurrency(networkName);
	}, [account, active, isLogin]);

	const menu = (
		<Menu className='remove-ant-menu'>
			<Menu.Item
				onClick={disconnectWallet}
				className='rounded-[20px] !bg-black-russian text-white py-2 px-5 !h-[40px] font-medium text-base cursor-pointer'
			>
				<div className='flex items-center justify-center'>
					<IconDynamic
						image='/icons/disconnect.svg'
						className='!w-7 !h-7 !mr-2'
					/>
					Disconnect
				</div>
			</Menu.Item>
		</Menu>
	);

	const connectWalletButton = (
		<>
			<Button
				className='connect-wallet w-fit'
				onClick={() => {
					setStatusModalConnectWallet(true);
					setStepModalConnectWallet(
						STEP_MODAL_CONNECTWALLET.SELECT_NETWORK_AND_WALLET
					);
				}}
			>
				Connect wallet
				<IconDynamic
					image='/icons/uwallet.svg'
					className='h-[1.375rem] w-[1.375rem] ml-2'
					alt='wallet_icon'
				/>
			</Button>
		</>
	);

	const connectWalletTopNav = (
		<>
			{isLogin ? (
				<>
					<div className={'flex items-center'}>
						<div className='text-[#ffffff80]'>{currency}</div>
						<div className='mx-[12px] text-[#ffffff80]'>|</div>
						<div className='text-purple-30 font-semibold leading-[1.5rem] mr-[0.75rem]'>
							{EllipsisMiddle(account)}
						</div>
					</div>
				</>
			) : (
				<>{connectWalletButton}</>
			)}
		</>
	);

	const connectWalletLeftNavMobile = (
		<>
			<div>
				{isLogin ? (
					<div className={'flex flex-col gap-6'}>
						<div className={'flex items-center'}>
							<div className='text-[#ffffff80]'>{currency}</div>
							<div className='mx-[12px] text-[#ffffff80]'>|</div>
							<IconDynamic
								image='/icons/wallet-color.svg'
								className='mr-3 w-6 h-6'
							/>
							<div className='text-purple-30 font-semibold leading-[1.5rem] mr-[0.75rem]'>
								{EllipsisMiddle(account)}
							</div>
						</div>

						<div
							onClick={disconnectWallet}
							className='text-red-10 font-medium text-h7 cursor-pointer w-fit'
						>
							<div className='flex items-center justify-center'>
								<IconDynamic
									image='/icons/disconnect.svg'
									className='!w-7 !h-7 !mr-2'
								/>
								Disconnect
							</div>
						</div>
					</div>
				) : (
					<>{connectWalletButton}</>
				)}
			</div>
		</>
	);

	return (
		<Header className='relative site-layout-sub-header-background !bg-background-dark w-full flex p-4 desktop:p-6 !h-fit'>
			{/* mobile nav*/}
			<div
				className={`${
					openMobileNav ? 'block' : 'hidden'
				} desktop:hidden flex fixed top-0 left-0 h-screen w-screen bg-gray z-10 leading-5`}
			>
				{/* spacer*/}
				<div className={'w-14'} />
				<div className={'flex flex-col w-full bg-black-10'}>
					<div className='flex items-center justify-start py-4 px-8 w-full'>
						<div className={'grow'}>
							<ImageBase
								url='/images/logo.svg'
								width={40}
								height={40}
								style={{
									objectFit: 'contain',
								}}
							/>
						</div>
						<IconDynamic
							image={'/icons/close-nav-mobile.svg'}
							className={'w-8 h-8 cursor-pointer'}
							onClick={() => {
								setOpenMobileNav(false);
							}}
						/>
					</div>
					<Menu
						theme='dark'
						className={'!bg-black-10 grow'}
						mode='inline'
						defaultSelectedKeys={['4']}
					>
						{LIST_SIDER.map((sider: any) => {
							const { router, icon, title, needLogin } = sider;
							if (needLogin && !isLogin) {
								return null;
							}
							return (
								<Menu.Item
									key={router}
									// onClick={() => router.push(ROUTES.TOKEN_PRESALE_ROUNDS)}
									className='!py-[13px] !px-[24px] !h-fit'
								>
									<Link href={router}>
										<a className='flex items-center font-semibold text-base'>
											{icon && (
												<IconDynamic
													image={icon}
													className='!w-[22px] !h-[22px] mr-[1rem] mb-0'
												/>
											)}
											{title}
										</a>
									</Link>
								</Menu.Item>
							);
						})}
					</Menu>
					<div className={'mx-8 mb-10'}>
						{/* connect wallet button*/}
						{connectWalletLeftNavMobile}
					</div>
				</div>
			</div>

			{/* mobile header*/}
			<div className={'desktop:hidden flex items-center gap-5 text-h7 w-full'}>
				<div className={'grow'}>
					<ImageBase
						url='/images/logo.svg'
						width={40}
						height={40}
						style={{
							objectFit: 'contain',
						}}
					/>
				</div>
				{connectWalletTopNav}
				<IconDynamic
					image={'/icons/burger.svg'}
					className={'w-8 h-8 cursor-pointer'}
					onClick={() => {
						setOpenMobileNav(true);
					}}
				/>
			</div>

			{/* desktop header*/}
			<div className={'hidden desktop:flex justify-end w-full'}>
				{isLogin ? (
					<Dropdown overlay={menu} trigger={['click']} className={'w-fit'}>
						<div className='rounded-[40px] bg-black-russian flex justify-center items-center px-5 !h-[42px] cursor-pointer border-[2px] border-[#ffffff1a]'>
							<div className='text-[#ffffff80]'>{currency}</div>
							<div className='mx-[12px] text-[#ffffff80]'>|</div>
							<IconDynamic
								image='/icons/wallet-color.svg'
								className='mr-3 w-6 h-6'
							/>
							<div className='text-[#D47AF5] font-semibold leading-[1.5rem] mr-[0.75rem]'>
								{EllipsisMiddle(account)}
							</div>
							<Image
								layout='intrinsic'
								width='10px'
								height='10px'
								src='/icons/arrow-down.svg'
								alt='icon'
								objectFit='contain'
							/>
						</div>
					</Dropdown>
				) : (
					<div className={'w-fit'}>{connectWalletButton}</div>
				)}
			</div>
			<ConnectWallet />
		</Header>
	);
};

export default LayoutHeader;
