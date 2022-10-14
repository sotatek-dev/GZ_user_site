import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { checkEmailUser, IPramsLogin, login } from 'apis/login';
import { STEP_MODAL_CONNECTWALLET } from 'common/constants/constants';
import StorageUtils, { STORAGE_KEYS } from 'common/utils/storage';
import { get } from 'lodash';
import { useDispatch } from 'react-redux';
import {
	setStatusModalConnectWallet,
	setStepModalConnectWallet,
} from 'stores/modal';
import { cleanDNFTs, setUserInfo } from 'stores/my-profile';
import { setSystemSettings } from 'stores/system-setting';
import { setAccessToken, setLogin } from 'stores/user';
import { setAddressWallet, setStatusConnect } from 'stores/wallet';
import { ConnectorKey } from 'web3/connectors';
import { SIGN_MESSAGE } from 'web3/constants/envs';
import { BSC_NETWORK } from 'web3/constants/networks';
import { useRouter } from 'next/router';
import { ROUTES } from 'common/constants/constants';
import { activateInjectedProvider } from 'web3/helpers/activateInjectedProvider';

/**
 * Hook for connect/disconnect to a wallet
 * @returns `connectWallet` and `disconnectWallet` functions .
 */

export const useConnectWallet = () => {
	const router = useRouter();
	const windowObj = typeof window !== 'undefined' && (window as any);
	const { ethereum } = windowObj;
	const { activate, deactivate, library } = useWeb3React();
	const dispatch = useDispatch<any>();

	async function connectWallet(walletSelected: any, networkConnected?: any) {
		await disconnectWallet();
		const { walletName, connector } = walletSelected;

		setStepModalConnectWallet(STEP_MODAL_CONNECTWALLET.CONNECT_WALLET);
		activateInjectedProvider(walletName);
		setStorageWallet(walletName);
		setStorageNetwork(networkConnected);

		// activate connect wallet via metamask
		await activate(connector, undefined, true)
			.then(async () => {
				const addressWallet = await connector.getAccount();
				checkLogin(addressWallet);
			})
			.catch(async (error: Error) => {
				if (error instanceof UnsupportedChainIdError) {
					await changeNetwork(connector);
				}

				if (error && error.message.includes('user rejected')) {
					setStatusModalConnectWallet(false);
					setStepModalConnectWallet(STEP_MODAL_CONNECTWALLET.CONNECT_WALLET);
				}
			});

		ethereum?.on('networkChanged', (val: string | undefined) => {
			if (
				val &&
				parseInt(String(BSC_NETWORK.CHAIN_ID_HEX), 16) != Number(val)
			) {
				redirectRoutes();
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

	const redirectRoutes = () => {
		router.push(ROUTES.TOKEN_PRESALE_ROUNDS);
	};

	const changeNetwork = async (connector: any) => {
		const addressWallet = await connector.getAccount();
		try {
			await ethereum?.request({
				method: 'wallet_switchEthereumChain',
				params: [{ chainId: BSC_NETWORK.CHAIN_ID_HEX }],
			});
			await checkLogin(addressWallet);
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
					return;
				} catch (addError) {
					deactivate();
				}
			} else {
				deactivate();
			}
			setStatusModalConnectWallet(false);
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

		// check user đăng nhập lần đầu.
		if (dataCheckUser?.is_user_exist) {
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
