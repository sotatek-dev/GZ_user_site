/* eslint-disable @typescript-eslint/no-explicit-any */
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { checkEmailUser, IPramsLogin, login } from 'apis/login';
import { STEP_MODAL_CONNECTWALLET } from 'common/constants/constants';
import StorageUtils, { STORAGE_KEYS } from 'common/utils/storage';
import { get } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import {
	setStatusModalConnectWallet,
	setStepModalConnectWallet,
} from 'stores/modal';
import { cleanDNFTs, setUserInfo } from 'stores/myProfile';
import { setSystemSettings } from 'stores/systemSetting';
import { setAccessToken, setLogin } from 'stores/user';
import {
	setAddressWallet,
	setNetworkConnected,
	setStatusConnect,
	setWallerConnected,
} from 'stores/wallet';
import { ConnectorKey } from 'web3/connectors';
import { SIGN_MESSAGE } from 'web3/constants/envs';
import { BSC_NETWORK, INetworkList } from 'web3/constants/networks';
import { message } from 'antd';
import { activateInjectedProvider } from 'web3/helpers/activateInjectedProvider';
import { MESSAGES } from 'common/constants/messages';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { isMobile } from 'react-device-detect';

/**
 * Hook for connect/disconnect to a wallet
 * @returns `connectWallet` and `disconnectWallet` functions .
 */

export const useConnectWallet = () => {
	const windowObj = typeof window !== 'undefined' && (window as any);
	const { ethereum } = windowObj;
	const { activate, deactivate, library } = useWeb3React();
	const dispatch = useDispatch();
	const { network, wallerConnected } = useSelector((state) => state.wallet);

	async function connectWallet(walletSelected: any, networkConnected?: any) {
		if (!ethereum?.isMetaMask)
			return message.error('Please install or unlock MetaMask');
		await deactivate();
		const { walletName, connector } = walletSelected;
		activateInjectedProvider(walletName);
		StorageUtils.removeItem(STORAGE_KEYS.WALLET_CONNECT);
		if (isMobile && walletName === ConnectorKey.walletConnect) {
			// window.open(DEEP_LINK_METAMASK);
		}
		if (connector instanceof WalletConnectConnector) {
			connector.walletConnectProvider = undefined;
		}
		await activate(connector, undefined, true)
			.then(async () => {
				setWallerConnected(walletName);
				setNetworkConnected(networkConnected);
				const addressWallet = await connector.getAccount();
				checkLogin(addressWallet);
			})
			.catch(async (error: Error) => {
				if (error instanceof UnsupportedChainIdError) {
					if (walletSelected.walletName === ConnectorKey.injected) {
						const changedSuccess = await changeNetwork();
						if (changedSuccess) {
							return await connectWallet(walletSelected, networkConnected);
						}
					} else {
						message.error('You have to switch to BSC Network');
						setStatusModalConnectWallet(false);
						setStepModalConnectWallet(STEP_MODAL_CONNECTWALLET.CONNECT_WALLET);
					}
				}
				if (error && error.message.includes('user rejected')) {
					setStatusModalConnectWallet(false);
					setStepModalConnectWallet(STEP_MODAL_CONNECTWALLET.CONNECT_WALLET);
					message.info('User rejected to sign');
				}
			});
	}

	async function disconnectWallet() {
		await deactivate();
		removeStorageWallet();
		StorageUtils.removeSessionStorageItem(STORAGE_KEYS.ACCESS_TOKEN);
		StorageUtils.removeSessionStorageItem(STORAGE_KEYS.ACCOUNT);
		StorageUtils.removeSessionStorageItem(STORAGE_KEYS.EXPIRE_IN);
		setLogin(false);
		dispatch(cleanDNFTs());
		dispatch(setUserInfo(undefined));
		dispatch(setSystemSettings(undefined));
		setAddressWallet('');
		setStepModalConnectWallet(
			STEP_MODAL_CONNECTWALLET.SELECT_NETWORK_AND_WALLET
		);
	}

	const changeNetwork = async () => {
		try {
			await ethereum?.request({
				method: 'wallet_switchEthereumChain',
				params: [{ chainId: BSC_NETWORK.CHAIN_ID_HEX }],
			});
			return true;
		} catch (switchError: any) {
			if (switchError.code === 4902) {
				try {
					await ethereum?.request({
						method: 'wallet_addEthereumChain',
						params: [
							{
								chainId: BSC_NETWORK.CHAIN_ID_HEX,
								rpcUrls: [BSC_NETWORK.RPC_URLS],
								chainName: BSC_NETWORK.CHAIN_NAME,
								blockExplorerUrls: [BSC_NETWORK.BLOCK_EXPLORER_URLS],
								nativeCurrency: {
									name: BSC_NETWORK.NATIVE_CURRENCY.NAME,
									symbol: BSC_NETWORK.NATIVE_CURRENCY.SYMBOL,
									decimals: BSC_NETWORK.NATIVE_CURRENCY.DECIMAL,
								},
							},
						],
					});
					return true;
				} catch (addError) {
					deactivate();
					setStatusModalConnectWallet(false);
					return false;
				}
			} else {
				deactivate();
				setStatusModalConnectWallet(false);
				return false;
			}
		}
	};

	async function handleLogin(address: string, email?: string) {
		try {
			const signer = (library as any).getSigner();
			const signature = await signer.signMessage(`${SIGN_MESSAGE}`, address);

			if (signature) {
				const params = {
					wallet_address: address,
					signature,
					sign_message: SIGN_MESSAGE,
				} as IPramsLogin;
				if (email) params.email = email;
				const [response] = await login(params);
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
				}
				message.success({ content: MESSAGES.MSC1 });
			}
		} catch (error: any) {
			if (error?.code === 'ACTION_REJECTED') {
				message.warning('User rejected to sign');
			}
		} finally {
			setStatusModalConnectWallet(false);
		}
	}

	async function checkLogin(addressWallet: string) {
		const [dataCheckUser] = await checkEmailUser(addressWallet);

		// check user đăng nhập lần đầu.
		if (dataCheckUser?.is_user_exist) {
			setStatusConnect(true);
		} else {
			setStepModalConnectWallet(STEP_MODAL_CONNECTWALLET.SIGN_IN);
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
