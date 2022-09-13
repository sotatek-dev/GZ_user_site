import { UnsupportedChainIdError } from '@web3-react/core';
import { UserRejectedRequestError as UserRejectedRequestErrorInjected } from '@web3-react/injected-connector';
import { toast } from 'react-toastify';
import { ConnectorKey } from 'web3/connectors';
import { CONNECTOR_KEY, NETWORK_ID } from 'web3/constants/storages';
import { useActiveWeb3React } from './useActiveWeb3React';
import { activateInjectedProvider } from 'web3/helpers/activateInjectedProvider';
import { checkNetwork } from 'web3/helpers/functions';
import { setAddressWallet, setNetworkValid } from 'stores/wallet';
import StorageUtils, { STORAGE_KEYS } from 'common/utils/storage';
import { setStatusModalConnectWallet } from 'stores/modal';

/**
 * Hook for connect/disconnect to a wallet
 * @returns `connectWallet` and `disconnectWallet` functions .
 */
export const useConnectWallet = () => {
	const { activate, deactivate } = useActiveWeb3React();

	async function connectWallet(walletSelected: any, networkConnected?: any) {
		const { connector, walletName } = walletSelected;
		try {
			activateInjectedProvider(walletName);
			activate(connector, undefined, true)
				.then(async () => {
					const addressWallet = await connector.getAccount();
					let networkId = await connector.getChainId();
					networkId = parseInt(networkId, 16);
					const isNetworkValid = checkNetwork(
						networkId,
						networkConnected.chainId
					);
					if (isNetworkValid && addressWallet) {
						setNetworkValid(isNetworkValid);
						setAddressWallet(addressWallet);
						setStatusModalConnectWallet(false);
					}
				})
				.catch((error: any) => {
					console.log('error', error);
				});
			setStorageWallet(connector);
			setStorageNetwork(networkConnected);
		} catch (error) {
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
				// const provider = await connector.getProvider();
				toast.error('');
				// const hasSetup = await setupNetwork(library?.provider);
				// if (hasSetup) {
				//   await activate(connector);
				//   throw error;
				// }
			}

			throw error;
		}
	}

	function disconnectWallet() {
		removeStorageWallet();
		deactivate();
	}

	return { connectWallet, disconnectWallet };
};

function setStorageWallet(connector: ConnectorKey) {
	StorageUtils.setItemObject(STORAGE_KEYS.CONNECTOR, connector);
}

function setStorageNetwork(networkConnected: any) {
	StorageUtils.setItemObject(STORAGE_KEYS.NETWORK, networkConnected);
}

function removeStorageWallet() {
	window.localStorage.removeItem(CONNECTOR_KEY);
	window.localStorage.removeItem(NETWORK_ID);
}
