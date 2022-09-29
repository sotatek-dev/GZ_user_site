import { IconDynamic } from 'common/assets/iconography/iconBundle';
import Loading from 'common/components/loading';
import ModalCustom from 'common/components/modals';
import ModalSignin from 'common/components/modals/SignIn';
import { STEP_MODAL_CONNECTWALLET } from 'common/constants/constants';
import { get } from 'lodash';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { setStatusModalConnectWallet } from 'stores/modal';
import { setStatusConnect } from 'stores/wallet';
import { NETWORK_LIST } from 'web3/constants/networks';
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
	const { modalConnectWallet, stepModalConnectWallet } = useSelector(
		(state) => state?.modal
	);
	const { isLogin } = useSelector((state) => state.user);
	const { isConnect } = useSelector((state) => state.wallet);
	const [selectedNetwork, setSelectedNetwork] = useState(NETWORK_LIST[0]);
	const [connector, setConnector] = useState<any>();

	useEffect(() => {
		return () => {
			setConnector({});
		};
	}, []);

	useEffect(() => {
		if (!isLogin && account && library && isConnect) {
			setStatusConnect(false);
			handleLogin(account);
		}
	}, [isLogin, library, account, handleLogin, isConnect]);

	const handleConnect = (walletName: any) => {
		connectWallet(walletName, selectedNetwork);
	};

	const handleCloseModalConnectWallet = () => {
		setStatusModalConnectWallet(false);
		deactivate();
	};

	const renderNetworkBox = (network: any) => {
		const { icon, networkName } = network;
		// const { icon, networkName, isDisabled, supportedNetwork } = network;
		const isActive = get(selectedNetwork, 'networkName', '') === networkName;

		return (
			<div
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
		// const { icon, walletName, connector, isDisabled } = wallet;
		const isActive = get(connector, 'walletName', '') === walletName;
		return (
			<div
				onClick={() => {
					handleConnect(wallet);
					setConnector(wallet);
				}}
				className={`p-4 bg-[#ffffff0d] shadow-[
					0px 3px 50px rgba(0, 0, 0, 0.078)
				] rounded-lg w-fit font-medium max-w-[180px] relative max-h-[110px] text-sm cursor-pointer ${
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
						imageClass={'mix-blend-luminosity'}
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
						<h5 className='font-bold text-[32px]  text-lg text-white text-center pb-6'>
							Connect Wallet
						</h5>
						<div className='pt-6'>
							<p className='font-bold text-sm pb-4'>1. Choose Network</p>
							{NETWORK_LIST.map((network) => {
								return renderNetworkBox(network);
							})}
						</div>
						<div className='pt-6'>
							<p className='font-bold text-sm pb-4'>2. Choose Wallet</p>
							{SUPPORTED_WALLETS.map((wallet) => {
								return renderWalletBox(wallet);
							})}
						</div>
					</div>
				);
			case STEP_MODAL_CONNECTWALLET.CONNECT_WALLET:
				return (
					<div>
						<h5 className='font-bold text-lg text-white text-center border-solid border-b border-ebony pb-6'>
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

	return (
		<div className='wallet'>
			<ModalCustom
				isShow={modalConnectWallet}
				onOk={handleCloseModalConnectWallet}
				onCancel={handleCloseModalConnectWallet}
				closable={
					stepModalConnectWallet ===
					STEP_MODAL_CONNECTWALLET.SELECT_NETWORK_AND_WALLET
						? true
						: false
				}
			>
				<div className='w-full bg-[#38424E]'>{renderStepModal()}</div>
			</ModalCustom>
		</div>
	);
}
