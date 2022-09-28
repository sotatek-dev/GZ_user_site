import { Layout, Button, Dropdown, Menu } from 'antd';
import { useEffect, useState } from 'react';
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

const { Header } = Layout;

const LayoutHeader = () => {
	const { account, active } = useActiveWeb3React();
	const [currency, setCurrency] = useState();
	const { disconnectWallet } = useConnectWallet();

	const islogin = useSelector((state) => state.user.isLogin);
	// const addressWallet = useSelector(state => state.wallet.addressWallet);
	// const wallet = useSelector(state => state.wallet)

	useEffect(() => {
		const { currency } = StorageUtils.getItemObject(STORAGE_KEYS.NETWORK);
		setCurrency(currency);
	}, [account, active, islogin]);

	const menu = (
		<Menu className='remove-ant-menu'>
			<Menu.Item
				onClick={disconnectWallet}
				className='rounded-[20px] !bg-black-russian text-white py-2 px-5 !h-[40px] font-medium text-base cursor-pointer'
			>
				<div className='flex items-center justify-center'>
					<IconDynamic
						image='./icons/disconnect.svg'
						className='w-7 h-7 mr-2'
					/>
					Disconnect
				</div>
			</Menu.Item>
		</Menu>
	);

	return (
		<Header className='site-layout-sub-header-background !bg-background-dark w-full flex !p-6 !h-fit'>
			{islogin ? (
				<Dropdown overlay={menu} trigger={['click']}>
					<div className='ml-auto rounded-[40px] bg-black-russian flex justify-center items-center px-5 !h-[42px] cursor-pointer border-[2px] border-[#ffffff1a]'>
						<div className='text-[#ffffff80]'>{currency}</div>
						<div className='mx-[12px] text-[#ffffff80]'>|</div>
						<IconDynamic image='./icons/wallet-color.svg' className='mr-3' />
						<div className='text-[#D47AF5] font-semibold leading-[1.5rem] mr-[0.75rem]'>
							{EllipsisMiddle(account)}
						</div>
						<img src='/icons/arrow-down.svg' />
					</div>
				</Dropdown>
			) : (
				<Button
					className='ml-auto connect-wallet'
					onClick={() => {
						setStatusModalConnectWallet(true);
						setStepModalConnectWallet(
							STEP_MODAL_CONNECTWALLET.SELECT_NETWORK_AND_WALLET
						);
					}}
				>
					Connect wallet
					<img
						src='/icons/uwallet.svg'
						className='h-[1.375rem] w-[1.375rem]'
						alt='wallet_icon'
					/>
				</Button>
			)}
			<ConnectWallet />
		</Header>
	);
};

export default LayoutHeader;
