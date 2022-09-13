import { useState } from 'react';
import { useActiveWeb3React, useConnectWallet } from 'web3/hooks';
import ModalCustom from 'common/components/modal';
import { useSelector } from 'react-redux';
import { IconDynamic } from 'common/assets/iconography/iconBundle';
import { setStatusModalConnectWallet } from 'stores/modal';
import { Button } from 'antd';
import { NETWORK_LIST } from 'web3/constants/networks';
import { SUPPORTED_WALLETS } from 'web3/constants/wallets';

interface WalletType {
	connector: any;
	walletName: string;
	icon: any;
	isDisabled: boolean;
}

export default function ConnectWallet() {
	const { active } = useActiveWeb3React();
	const { connectWallet } = useConnectWallet();
	const { modalConnectWallet } = useSelector((state: any) => state?.modal);
	const [selectedNetwork, setSelectedNetwork] = useState<any>();
	const [connector, setConnector] = useState<any>();

	function handleConnect() {
		if ((!selectedNetwork && !connector) || active) return;
		connectWallet(connector, selectedNetwork);
	}

	const renderNetworkBox = (network: any) => {
		const { icon, networkName } = network;
		// const { icon, networkName, isDisabled, supportedNetwork } = network;
		return (
			<div
				onClick={() => setSelectedNetwork(network)}
				className='p-4 bg-ebony-20 rounded-lg w-fit min-w-[130px] flex text-blue-zodiac font-medium text-sm cursor-pointer'
			>
				<IconDynamic image={icon} className='mr-2' />
				{networkName}
			</div>
		);
	};

	const renderWalletBox = (wallet: WalletType) => {
		const { icon, walletName } = wallet;
		// const { icon, walletName, connector, isDisabled } = wallet;

		return (
			<div
				onClick={() => {
					setConnector(wallet);
				}}
				className='p-4 bg-ebony-20 rounded-lg w-fit min-w-[170px] flex text-blue-zodiac font-medium text-sm cursor-pointer'
			>
				<IconDynamic image={icon} className='mr-2' />
				{walletName}
			</div>
		);
	};

	return (
		<div className='wallet'>
			<ModalCustom
				isShow={modalConnectWallet}
				onCancel={() => setStatusModalConnectWallet(false)}
			>
				<div>
					<h5 className='font-bold text-lg text-white text-center border-solid border-b border-ebony pb-6'>
						Connect Wallet
					</h5>
					<div className='pt-6'>
						<p className='font-bold text-sm pb-4'>Choose Network</p>
						{NETWORK_LIST.map((network) => {
							return renderNetworkBox(network);
						})}
					</div>
					<div className='pt-6'>
						<p className='font-bold text-sm pb-4'>Choose Wallet</p>
						{SUPPORTED_WALLETS.map((wallet) => {
							return renderWalletBox(wallet);
						})}
					</div>
				</div>
				<Button onClick={handleConnect} className='connect-wallet mt-4'>
					Confirm
				</Button>
			</ModalCustom>
		</div>
	);
}
