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

const { Header } = Layout;

const LayoutHeader = () => {
	const { account, active } = useActiveWeb3React();
	const [currency, setCurrency] = useState();
	const { disconnectWallet } = useConnectWallet();

	useEffect(() => {
		const { currency } = StorageUtils.getItemObject(STORAGE_KEYS.NETWORK);
		console.log('account', account, active);
		setCurrency(currency);
	}, [account, active]);

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
			{account ? (
				<Dropdown overlay={menu} trigger={['click']}>
					<div className='ml-auto rounded-[20px] bg-black-russian flex items-center text-white py-2 px-5 !h-[40px] font-medium text-base cursor-pointer'>
						<div className='mr-3'>{currency}</div>
						<IconDynamic image='./icons/wallet.svg' className='mr-3' />
						{EllipsisMiddle(account)}
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
				</Button>
			)}
			<ConnectWallet />
		</Header>
	);
};

export default LayoutHeader;
