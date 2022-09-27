import { useEffect, useState } from 'react';
import { useActiveWeb3React, useConnectWallet } from 'web3/hooks';
import ModalCustom from 'common/components/modals';
import { useSelector } from 'react-redux';
import { IconDynamic } from 'common/assets/iconography/iconBundle';
import { setStatusModalConnectWallet } from 'stores/modal';
import { NETWORK_LIST } from 'web3/constants/networks';
import { SUPPORTED_WALLETS } from 'web3/constants/wallets';
import { STEP_MODAL_CONNECTWALLET } from 'common/constants/constants';
import ModalSignin from 'common/components/modals/SignIn';
import Loading from 'common/components/loading';
import { setStatusConnect } from 'stores/wallet';

interface WalletType {
	connector: any;
	walletName: string;
	icon: any;
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
	console.log('stepModalConnectWallet', stepModalConnectWallet);

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
		return (
			<div
				onClick={() => setSelectedNetwork(network)}
				className={`p-4 bg-ebony-20 rounded-lg w-fit min-w-[130px] flex text-blue-zodiac font-medium text-sm cursor-pointer ${
					selectedNetwork.networkName === networkName
						? 'chosse-active'
						: 'chosse-disable'
				}`}
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
					handleConnect(wallet);
					setConnector(wallet);
				}}
				className={`p-4 bg-ebony-20 rounded-lg w-fit min-w-[170px] flex text-blue-zodiac font-medium text-sm cursor-pointer ${
					connector?.walletName === walletName
						? 'chosse-active'
						: 'chosse-disable'
				}`}
			>
				<IconDynamic image={icon} className='mr-2' />
				{walletName}
			</div>
		);
	};

	const renderStepModal = () => {
		switch (stepModalConnectWallet) {
			case STEP_MODAL_CONNECTWALLET.SELECT_NETWORK_AND_WALLET:
				return (
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
				<div className='w-full'>{renderStepModal()}</div>
			</ModalCustom>
		</div>
	);
}
