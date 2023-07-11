/* eslint-disable @typescript-eslint/no-explicit-any */
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { MetaMask } from '@web3-react/metamask';
import { WalletConnect } from '@web3-react/walletconnect-v2';
import { IconDynamic } from 'common/assets/iconography/iconBundle';
import Loading from 'common/components/loading';
import ModalCustom from 'common/components/modals';
import ModalSignin from 'common/components/modals/SignIn';
import { STEP_MODAL_CONNECTWALLET } from 'common/constants/constants';
import { get } from 'lodash';
import { useEffect, useState } from 'react';
import { useAppSelector } from 'stores';
import {
	setStatusModalConnectWallet,
	setStepModalConnectWallet,
} from 'stores/modal';
import { setStatusConnect } from 'stores/wallet';
import { ConnectorKey, connectors } from 'web3/connectors';
import { INetworkList, NETWORK_LIST } from 'web3/constants/networks';
import { SUPPORTED_WALLETS } from 'web3/constants/wallets';
import { useConnectWallet } from 'web3/hooks';

export interface WalletType {
	connector: MetaMask | WalletConnect;
	walletName: ConnectorKey;
	icon: string;
	isDisabled: boolean;
}

export default function ConnectWallet() {
	const { connector, account } = useWeb3React();

	const { connectWallet, handleLogin } = useConnectWallet();
	const { modalConnectWallet, stepModalConnectWallet } = useAppSelector(
		(state) => state.modal
	);
	const { isLogin } = useAppSelector((state) => state.user);
	const { isConnect, wallerConnected } = useAppSelector(
		(state) => state.wallet
	);
	const [connectedWallet, setConnectedWallet] = useState<any>();
	const selectedNetwork = NETWORK_LIST[0];

	useEffect(() => {
		if (!modalConnectWallet) {
			setConnectedWallet({});
		}
	}, [modalConnectWallet]);

	useEffect(() => {
		if (!isLogin && account && wallerConnected && isConnect) {
			const targetConnector = connectors[wallerConnected];

			if (targetConnector.provider) {
				setStatusConnect(false);
				handleLogin(new Web3Provider(targetConnector.provider));
			}
		}
	}, [isLogin, account, handleLogin, isConnect, wallerConnected]);

	const handleConnect = (walletName: WalletType) => {
		setStepModalConnectWallet(STEP_MODAL_CONNECTWALLET.CONNECT_WALLET);
		connectWallet(walletName, selectedNetwork);
	};

	const handleCloseModalConnectWallet = () => {
		setStatusModalConnectWallet(false);
		setConnectedWallet({});
		connector.deactivate?.();
	};

	const renderNetworkBox = (network: INetworkList) => {
		const { icon, networkName } = network;
		const isActive = get(selectedNetwork, 'networkName', '') === networkName;

		return (
			<div
				key={networkName}
				className={`p-4 bg-[#ffffff0d] rounded-lg w-fit max-w-[180px] max-h-[110px] relative  text-blue-zodiac font-medium text-sm cursor-pointer ${
					isActive ? 'chosse-active' : 'chosse-disable'
				}`}
			>
				{isActive && (
					<IconDynamic
						image={'/icons/check-box.svg'}
						className='mb-[10px] w-[20px] h-[20px] absolute top-1 right-1'
					/>
				)}
				<div className='flex items-center justify-between'></div>
				<div className='flex flex-col justify-center items-center px-[4.375rem]'>
					<IconDynamic image={icon} className='mb-[10px] w-[40px] h-[40px]' />
					{networkName}
				</div>
			</div>
		);
	};

	const renderWalletBox = (wallet: WalletType) => {
		const { icon, walletName } = wallet;
		const isActive = get(connectedWallet, 'walletName', '') === walletName;

		return (
			<div
				key={walletName}
				onClick={() => {
					handleConnect(wallet);
					setConnectedWallet(wallet);
				}}
				className={`p-4 bg-[#ffffff0d] shadow-[0px 3px 50px rgba(0, 0, 0, 0.078)] rounded-lg w-fit font-medium max-w-[180px] relative max-h-[110px] text-sm cursor-pointer border-2 border-solid border-[#36c1ff] border-opacity-0 hover:border-opacity-100 transition ease-in-out duration-200 opacity-60 hover:opacity-100 ${
					isActive ? 'chosse-active' : 'chosse-disable'
				}`}
			>
				{isActive && (
					<IconDynamic
						image={'/icons/check-box.svg'}
						className='mb-[10px] w-[20px] h-[20px] absolute top-1 right-1'
					/>
				)}
				<div className='flex flex-col justify-center items-center px-[4.375rem] '>
					<IconDynamic image={icon} className='mb-[10px] w-[40px] h-[40px]' />
					<span>{walletName}</span>
				</div>
			</div>
		);
	};

	const renderStepModal = () => {
		switch (stepModalConnectWallet) {
			case STEP_MODAL_CONNECTWALLET.SELECT_NETWORK_AND_WALLET:
				return (
					<div>
						<h5 className='pb-6 text-lg font-bold text-center text-white desktop:text-h3'>
							Connect Wallet
						</h5>
						<div
							className={
								'flex flex-col items-center justify-center desktop:inline-block'
							}
						>
							<div className='pt-6'>
								<p className='pb-4 font-bold text-h7'>1. Choose Network</p>
								{NETWORK_LIST.map((network) => {
									return renderNetworkBox(network);
								})}
							</div>
							<div className='pt-6'>
								<p className='pb-4 font-bold text-h7'>2. Choose Wallet</p>
								<div className='grid grid-cols-1 gap-8 desktop:grid-cols-2'>
									{SUPPORTED_WALLETS.map((wallet) => {
										return renderWalletBox(wallet);
									})}
								</div>
							</div>
						</div>
					</div>
				);
			case STEP_MODAL_CONNECTWALLET.CONNECT_WALLET:
				return (
					<div>
						<h5 className='pb-6 font-bold text-center text-white text-h4 desktop:text-h3'>
							Connect Wallet
						</h5>
						<div>
							<Loading />
						</div>
					</div>
				);
			case STEP_MODAL_CONNECTWALLET.SIGN_IN:
				return <ModalSignin />;
			default:
				break;
		}
	};

	return modalConnectWallet ? (
		<div className='wallet'>
			<ModalCustom
				isShow
				centered
				customClass={'!max-w-[calc(100%_-_2rem)]'}
				onOk={handleCloseModalConnectWallet}
				onCancel={handleCloseModalConnectWallet}
			>
				<div className='w-full'>{renderStepModal()}</div>
			</ModalCustom>
		</div>
	) : null;
}
