/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { INetworkList, NETWORK_LIST } from 'web3/constants/networks';
import { SUPPORTED_WALLETS } from 'web3/constants/wallets';
import { useActiveWeb3React, useConnectWallet } from 'web3/hooks';

interface WalletType {
	connector: any;
	walletName: string;
	icon: string;
	isDisabled: boolean;
}

export default function ConnectWallet() {
	const { deactivate, account, library } = useActiveWeb3React();
	const { connectWallet, handleLogin } = useConnectWallet();
	const { modalConnectWallet, stepModalConnectWallet } = useAppSelector(
		(state) => state.modal
	);
	const { isLogin } = useAppSelector((state) => state.user);
	const { isConnect } = useAppSelector((state) => state.wallet);
	const [selectedNetwork, setSelectedNetwork] = useState(NETWORK_LIST[0]);
	const [connector, setConnector] = useState<any>();

	useEffect(() => {
		if (!modalConnectWallet) {
			setConnector({});
		}
	}, [modalConnectWallet]);

	useEffect(() => {
		if (!isLogin && account && library && isConnect) {
			setStatusConnect(false);
			handleLogin(account);
		}
	}, [isLogin, library, account, handleLogin, isConnect]);

	const handleConnect = (walletName: any) => {
		setStepModalConnectWallet(STEP_MODAL_CONNECTWALLET.CONNECT_WALLET);
		connectWallet(walletName, selectedNetwork);
	};

	const handleCloseModalConnectWallet = () => {
		setStatusModalConnectWallet(false);
		setConnector({});
		deactivate();
	};

	const renderNetworkBox = (network: INetworkList) => {
		const { icon, networkName } = network;
		// const { icon, networkName, isDisabled, supportedNetwork } = network;
		const isActive = get(selectedNetwork, 'networkName', '') === networkName;

		return (
			<div
				key={networkName}
				onClick={() => setSelectedNetwork(network)}
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
		const isActive = get(connector, 'walletName', '') === walletName;
		return (
			<div
				key={walletName}
				onClick={() => {
					handleConnect(wallet);
					setConnector(wallet);
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
					<IconDynamic
						image={icon}
						className='mb-[10px] w-[40px] h-[40px]'
						// imageClass={'mix-blend-luminosity'}
					/>
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
						<h5 className='font-bold desktop:text-h3 text-lg text-white text-center pb-6'>
							Connect Wallet
						</h5>
						<div
							className={
								'flex flex-col items-center justify-center desktop:inline-block'
							}
						>
							<div className='pt-6'>
								<p className='font-bold text-h7 pb-4'>1. Choose Network</p>
								{NETWORK_LIST.map((network) => {
									return renderNetworkBox(network);
								})}
							</div>
							<div className='pt-6'>
								<p className='font-bold text-h7 pb-4'>2. Choose Wallet</p>
								<div className='grid-cols-1 grid desktop:grid-cols-2 gap-8'>
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
						<h5 className='font-bold text-h4 desktop:text-h3 text-white text-center pb-6'>
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
