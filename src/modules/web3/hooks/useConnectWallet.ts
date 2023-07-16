import { IPramsLogin, login } from 'apis/login';
import { STEP_MODAL_CONNECTWALLET } from 'common/constants/constants';
import StorageUtils, { STORAGE_KEYS } from 'common/utils/storage';
import { get } from 'lodash';
import { useDispatch } from 'react-redux';
import {
	setStatusModalConnectWallet,
	setStepModalConnectWallet,
} from 'stores/modal';
import { cleanDNFTs, setUserInfo } from 'stores/my-profile';
import { setSystemSettings } from 'stores/systemSetting';
import { setAccessToken, setLogin } from 'stores/user';
import {
	setAddressWallet,
	setNetworkConnected,
	setStatusConnect,
	setWallerConnected,
} from 'stores/wallet';
import {
	BSC_BLOCK_EXPLORER_URL,
	BSC_CHAIN_ID,
	BSC_CHAIN_NAME,
	BSC_RPC_URL,
	SIGN_MESSAGE,
} from 'web3/constants/envs';
import { INetworkList } from 'web3/constants/networks';
import { message } from 'antd';
import { MESSAGES } from 'common/constants/messages';
import { useAppSelector } from 'stores';
import { WalletType } from 'wallet/connect/ConnectWallet';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { useEffect } from 'react';
import { ConnectorKey, connectors } from 'web3/connectors';
import { NoMetaMaskError } from '@web3-react/metamask';
import { AddEthereumChainParameter } from '@web3-react/types';
import { WalletConnect } from '@web3-react/walletconnect-v2';

/**
 * Hook for connect/disconnect to a wallet
 * @returns `connectWallet` and `disconnectWallet` functions .
 */

export const useConnectWallet = () => {
	const dispatch = useDispatch();
	const { connector } = useWeb3React();
	const { network, wallerConnected } = useAppSelector((state) => state.wallet);

	useEffect(() => {
		const walletSelected = StorageUtils.getSectionStorageItem(
			STORAGE_KEYS.WALLET_CONNECTED
		);
		if (!walletSelected) return;

		const connector = connectors[walletSelected as ConnectorKey];
		void connector
			.connectEagerly?.()
			?.then(() => {
				setStepModalConnectWallet(STEP_MODAL_CONNECTWALLET.CONNECT_WALLET);
				setStatusConnect(true);
			})
			?.catch(() => {
				console.error('Failed to connect eagerly to wallet');
			});
	}, []);

	async function connectWallet(
		walletSelected: WalletType,
		networkConnected: INetworkList
	) {
		try {
			const { walletName, connector } = walletSelected;
			const connectParams: AddEthereumChainParameter = {
				chainId: Number(BSC_CHAIN_ID),
				chainName: BSC_CHAIN_NAME,
				nativeCurrency: {
					name: 'BNB',
					symbol: 'BNB',
					decimals: 18,
				},
				rpcUrls: [BSC_RPC_URL],
				blockExplorerUrls: [BSC_BLOCK_EXPLORER_URL],
			};

			if (connector instanceof WalletConnect) {
				console.log('===');
				await connector.activate(connectParams.chainId);
			} else {
				await connector.activate({ ...connectParams });
			}

			setWallerConnected(walletName);
			setNetworkConnected(networkConnected);
			setStepModalConnectWallet(STEP_MODAL_CONNECTWALLET.CONNECT_WALLET);
			setStatusConnect(true);
		} catch (error) {
			if (error instanceof NoMetaMaskError) {
				message.error('Please install or unlock MetaMask');
			}
			if ((error as { code: number }).code === 4001) {
				message.info('User rejected to connect');
			}
			if (
				error &&
				(error as { message: string }).message.includes('user rejected')
			) {
				message.info('User rejected to sign');
			}
			disconnectWallet();
			setStatusModalConnectWallet(false);
			setStepModalConnectWallet(STEP_MODAL_CONNECTWALLET.CONNECT_WALLET);
		}
	}

	async function disconnectWallet() {
		connector.deactivate
			? await connector.deactivate()
			: await connector.resetState();
		removeStorageWallet();
		StorageUtils.removeSessionStorageItem(STORAGE_KEYS.ACCESS_TOKEN);
		StorageUtils.removeSessionStorageItem(STORAGE_KEYS.ACCOUNT);
		StorageUtils.removeSessionStorageItem(STORAGE_KEYS.EXPIRE_IN);
		setLogin(false);
		dispatch(cleanDNFTs());
		dispatch(setUserInfo(undefined));
		dispatch(setSystemSettings(undefined));
		setAddressWallet('');
		setWallerConnected('');
		setStepModalConnectWallet(
			STEP_MODAL_CONNECTWALLET.SELECT_NETWORK_AND_WALLET
		);
	}

	async function handleLogin(provider: Web3Provider) {
		try {
			const signer = provider.getSigner();
			const address = await signer.getAddress();
			const signature = await signer.signMessage(`${SIGN_MESSAGE}`);
			if (signature) {
				const params = {
					wallet_address: address,
					signature,
					sign_message: SIGN_MESSAGE,
				} as IPramsLogin;
				const [response, error] = await login(params);
				if (response && network && wallerConnected) {
					const {
						auth: { expire_in, token },
						wallet_address,
					} = get(response, 'data', {});
					sessionStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
					sessionStorage.setItem(STORAGE_KEYS.EXPIRE_IN, expire_in);
					sessionStorage.setItem(STORAGE_KEYS.ACCOUNT, wallet_address);
					setLogin(true);
					setAccessToken(token);
					setAddressWallet(wallet_address);
					setStorageWallet(wallerConnected);
					setStorageNetwork(network);
					message.success({ content: MESSAGES.MSC1 });
				} else {
					throw error;
				}
			}
		} catch (error) {
			if ((error as { code: string }).code === 'ACTION_REJECTED') {
				message.warning('User rejected to sign');
			} else {
				message.error('Failed to connect');
			}
		} finally {
			setStatusModalConnectWallet(false);
		}
	}

	return { connectWallet, disconnectWallet, handleLogin };
};

function setStorageWallet(connector: string) {
	StorageUtils.setSectionStorageItem(STORAGE_KEYS.WALLET_CONNECTED, connector);
}

function setStorageNetwork(networkConnected: INetworkList) {
	StorageUtils.setItemObject(STORAGE_KEYS.NETWORK, networkConnected);
}

export function removeStorageWallet() {
	StorageUtils.removeSectionStorageItem(STORAGE_KEYS.WALLET_CONNECTED);
	StorageUtils.removeItem(STORAGE_KEYS.NETWORK);
}
