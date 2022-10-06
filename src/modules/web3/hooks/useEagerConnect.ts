import { useWeb3React } from '@web3-react/core';
import StorageUtils, { STORAGE_KEYS } from 'common/utils/storage';
import { useEffect, useState } from 'react';
import { ConnectorKey } from 'web3/connectors';
import { Injected } from 'web3/connectors/injected';

/**
 * Trying eager connect to connectors at first time.
 * @returns `tried` tried eager connect done or not
 */
export function useEagerConnect() {
	const { active, activate } = useWeb3React();
	const [tried, setTried] = useState(false);

	useEffect(() => {
		const walletSelected = StorageUtils.getSectionStorageItem(
			STORAGE_KEYS.WALLET_CONNECTED
		);
		const { ethereum } = window;
		if (!walletSelected) return;
		if (!active && walletSelected === ConnectorKey.injected) {
			Injected.isAuthorized().then((isAuthorized: boolean) => {
				if (isAuthorized) {
					activate(Injected, undefined, true).catch(() => {
						setTried(true);
					});
				} else {
					if (ethereum) {
						activate(Injected, undefined, true).catch(() => {
							setTried(true);
						});
					} else {
						setTried(true);
					}
				}
			});
			return;
		}
		setTried(true);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [active]);

	return tried;
}

export function useInactiveListener(suppress = false) {
	const { active, error, activate } = useWeb3React();

	useEffect(() => {
		const { ethereum } = window;
		if (ethereum && ethereum.on && !active && !error && !suppress) {
			const handleConnect = () => {
				activate(Injected);
			};
			const handleChainChanged = () => {
				activate(Injected);
			};
			const handleAccountsChanged = (accounts: string[]) => {
				if (accounts.length > 0) {
					activate(Injected);
				}
			};
			const handleNetworkChanged = () => {
				activate(Injected);
			};

			ethereum.on('connect', handleConnect);
			ethereum.on('chainChanged', handleChainChanged);
			ethereum.on('accountsChanged', handleAccountsChanged);
			ethereum.on('networkChanged', handleNetworkChanged);

			return () => {
				if (ethereum.removeListener) {
					ethereum.removeListener('connect', handleConnect);
					ethereum.removeListener('chainChanged', handleChainChanged);
					ethereum.removeListener('accountsChanged', handleAccountsChanged);
					ethereum.removeListener('networkChanged', handleNetworkChanged);
				}
			};
		}
	}, [active, error, suppress, activate]);
}
