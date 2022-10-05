import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { ConnectorKey } from 'web3/connectors';
import { activateInjectedProvider } from 'web3/helpers/activateInjectedProvider';
import { setAddressWallet, setStatusConnect } from 'stores/wallet';
import StorageUtils, { STORAGE_KEYS } from 'common/utils/storage';
import {
	setStatusModalConnectWallet,
	setStepModalConnectWallet,
} from 'stores/modal';
import { BSC_NETWORK } from 'web3/constants/networks';
import { STEP_MODAL_CONNECTWALLET } from 'common/constants/constants';
import { checkEmailUser, IPramsLogin, login } from 'apis/login';
import { setAccessToken, setLogin, setUserInfo } from 'stores/user';
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
		await disconnectWallet();
		const { walletName, connector } = walletSelected;
		setStepModalConnectWallet(STEP_MODAL_CONNECTWALLET.CONNECT_WALLET);
		activateInjectedProvider(walletName);
		setStorageWallet(walletName);
		setStorageNetwork(networkConnected);
		await activate(connector, undefined, true)
			.then(async () => {
				const addressWallet = await connector.getAccount();
				checkLogin(addressWallet);
			})
			.catch(async (error: Error) => {
				if (error instanceof UnsupportedChainIdError) {
					await changeNetwork(connector);
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
		setAddressWallet('');
		setStepModalConnectWallet(
			STEP_MODAL_CONNECTWALLET.SELECT_NETWORK_AND_WALLET
		);
	}

	const changeNetwork = async (connector: any) => {
		const addressWallet = await connector.getAccount();
		try {
			await ethereum?.request({
				method: 'wallet_switchEthereumChain',
				params: [{ chainId: BSC_NETWORK.CHAIN_ID_HEX }],
			});
			checkLogin(addressWallet);
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
					checkLogin(addressWallet);
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
					setAccessToken(token);
					setAddressWallet(wallet_address);
				}
			}
		} catch (error) {
			removeStorageWallet();
		} finally {
			setStatusModalConnectWallet(false);
			setStepModalConnectWallet(
				STEP_MODAL_CONNECTWALLET.SELECT_NETWORK_AND_WALLET
			);
		}
	}

	async function checkLogin(addressWallet: string) {
		const [dataCheckUser] = await checkEmailUser(addressWallet);
		if (dataCheckUser.is_user_exist) {
			// check user đăng nhập lần đầu
			setStatusConnect(true);
		} else {
			setStepModalConnectWallet(STEP_MODAL_CONNECTWALLET.SIGN_IN);
		}
	}

	return { connectWallet, disconnectWallet, handleLogin };
};

function setStorageWallet(connector: ConnectorKey) {
	StorageUtils.setSectionStorageItem(STORAGE_KEYS.WALLET_CONNECTED, connector);
}

function setStorageNetwork(networkConnected: any) {
	StorageUtils.setItemObject(STORAGE_KEYS.NETWORK, networkConnected);
}

export function removeStorageWallet() {
	StorageUtils.removeSectionStorageItem(STORAGE_KEYS.WALLET_CONNECTED);
	StorageUtils.removeItem(STORAGE_KEYS.NETWORK);
}
