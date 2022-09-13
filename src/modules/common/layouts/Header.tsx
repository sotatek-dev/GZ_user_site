import { Layout, Button } from 'antd';
import { useEffect, useState } from 'react';
import { IconDynamic } from 'common/assets/iconography/iconBundle';
import ConnectWallet from 'wallet/connect/ConnectWallet';
import { setStatusModalConnectWallet } from 'stores/modal';
import { useActiveWeb3React } from 'web3/hooks';
import StorageUtils, { STORAGE_KEYS } from 'common/utils/storage';

const { Header } = Layout;

const LayoutHeader = () => {
	const { account } = useActiveWeb3React();
	const [currency, setCurrency] = useState();

	useEffect(() => {
		const { currency } = StorageUtils.getItemObject(STORAGE_KEYS.NETWORK);
		setCurrency(currency);
	}, [account]);

	return (
		<Header className='site-layout-sub-header-background !bg-background-dark w-full flex !p-6 !h-fit'>
			{account ? (
				<div className='ml-auto rounded-[20px] bg-black-russian flex items-center text-white py-2 px-5 !h-[10]'>
					<div>{currency}</div>
					<IconDynamic image='./icons/wallet.svg' />
					{account}
				</div>
			) : (
				<Button
					className='ml-auto connect-wallet'
					onClick={() => setStatusModalConnectWallet(true)}
				>
					Connect wallet
				</Button>
			)}
			<ConnectWallet />
		</Header>
	);
};

export default LayoutHeader;
