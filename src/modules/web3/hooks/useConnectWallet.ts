import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { UserRejectedRequestError as UserRejectedRequestErrorInjected } from '@web3-react/injected-connector';
import { toast } from 'react-toastify';
import { ConnectorKey } from 'web3/connectors';
import { activateInjectedProvider } from 'web3/helpers/activateInjectedProvider';
import { checkNetwork } from 'web3/helpers/functions';
import {
	setAddressWallet,
	setNetworkValid,
	setStatusConnect,
} from 'stores/wallet';
import StorageUtils, { STORAGE_KEYS } from 'common/utils/storage';
import {
	setStatusModalConnectWallet,
	setStepModalConnectWallet,
} from 'stores/modal';
import { BSC_NETWORK } from 'web3/constants/networks';
import { STEP_MODAL_CONNECTWALLET } from 'common/constants/constants';
import { checkEmailUser, IPramsLogin, login } from 'apis/login';
import { setLogin, setUserInfo } from 'stores/user';
import { SIGN_MESSAGE } from 'web3/constants/envs';
import { get } from 'lodash';

/**
 * Hook for connect/disconnect to a wallet
 * @returns `connectWallet` and `disconnectWallet` functions .
 */
export const useConnectWallet = () => {
	const windowObj = typeof window !== 'undefined' && (window as any);
	const { ethereum } = windowObj;
	const { activate, deactivate, library } = useWeb3React();

	async function connectWallet(walletSelected: any, networkConnected?: any) {
		const { walletName, connector } = walletSelected;
		try {
			setStepModalConnectWallet(STEP_MODAL_CONNECTWALLET.CONNECT_WALLET);
			activateInjectedProvider(walletName);
			setStorageWallet(walletName);
			setStorageNetwork(networkConnected);
			await activate(connector, undefined, true)
				.then(async () => {
					const addressWallet = await connector.getAccount();
					let networkId = await connector.getChainId();
					networkId = parseInt(networkId, 16);
					const isNetworkValid = checkNetwork(
						networkId,
						networkConnected.chainId
					);
					const [dataCheckUser] = await checkEmailUser(addressWallet);

					if (isNetworkValid) {
						setNetworkValid(isNetworkValid);
						if (dataCheckUser.is_user_exist) {
							// check user đăng nhập lần đầu
							setStepModalConnectWallet(
								STEP_MODAL_CONNECTWALLET.SELECT_NETWORK_AND_WALLET
							);
							setStatusConnect(true);
						} else {
							setStepModalConnectWallet(STEP_MODAL_CONNECTWALLET.SIGN_IN);
						}
					} else {
						await changeNetwork(walletName, networkConnected);
					}
				})
				.catch(async (error: any) => {
					// console.log('error', error);
					if (error instanceof UnsupportedChainIdError) {
						await changeNetwork(walletName, networkConnected);
					}
				});
		} catch (error) {
			// console.log('error==',error );
			if (
				error instanceof UserRejectedRequestErrorInjected ||
				(error instanceof Error &&
					error.message === 'User denied account authorization') // Coinbase wallet
			) {
				toast.error('');
			}
			if (error instanceof UnsupportedChainIdError) {
				//
			}

			if (error instanceof UnsupportedChainIdError) {
				await changeNetwork(walletName, networkConnected);
			}

			throw error;
		} finally {
			// setStepModalConnectWallet(
			// 	STEP_MODAL_CONNECTWALLET.SELECT_NETWORK_AND_WALLET
			// );
			// setStatusModalConnectWallet(false);
		}
	}

	async function disconnectWallet() {
		await deactivate();
		removeStorageWallet();
		StorageUtils.removeSessionStorageItem(STORAGE_KEYS.ACCESS_TOKEN);
		StorageUtils.removeSessionStorageItem(STORAGE_KEYS.ACCOUNT);
		StorageUtils.removeSessionStorageItem(STORAGE_KEYS.EXPIRE_IN);
		setLogin(false);
		setAddressWallet('');
	}

	const changeNetwork = async (
		walletName: ConnectorKey,
		networkConnected: any
	) => {
		try {
			await ethereum?.request({
				method: 'wallet_switchEthereumChain',
				params: [{ chainId: BSC_NETWORK.CHAIN_ID_HEX }],
			});
			connectWallet(walletName, networkConnected);
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
					connectWallet(walletName, networkConnected);
				} catch (addError) {
					deactivate();
				}
			} else {
				deactivate();
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
				if (response) {
					const {
						auth: { expire_in, token },
						wallet_address,
					} = get(response, 'data', {});
					sessionStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
					sessionStorage.setItem(STORAGE_KEYS.EXPIRE_IN, expire_in);
					sessionStorage.setItem(STORAGE_KEYS.ACCOUNT, wallet_address);
					const userInfo = {
						walletAddress: wallet_address,
					};
					setUserInfo(userInfo);
					setLogin(true);
					setAddressWallet(wallet_address);
					setStatusModalConnectWallet(false);
					setStepModalConnectWallet(
						STEP_MODAL_CONNECTWALLET.SELECT_NETWORK_AND_WALLET
					);
				}
			}
		} catch (error) {
			// console.log('error', error);
			removeStorageWallet();
		}
	}

	return { connectWallet, disconnectWallet, handleLogin };
};

function setStorageWallet(connector: ConnectorKey) {
	StorageUtils.setItem(STORAGE_KEYS.WALLET_CONNECTED, connector);
}

function setStorageNetwork(networkConnected: any) {
	StorageUtils.setItemObject(STORAGE_KEYS.NETWORK, networkConnected);
}

export function removeStorageWallet() {
	window.localStorage.removeItem(STORAGE_KEYS.WALLET_CONNECTED);
	window.localStorage.removeItem(STORAGE_KEYS.NETWORK);
}
