import { useWeb3React } from '@web3-react/core';
import StorageUtils, { STORAGE_KEYS } from 'common/utils/storage';
import { useEffect, useState } from 'react';
import { ConnectorKey } from 'web3/connectors';
import { Injected, walletConnect } from 'web3/connectors/injected';
import { useConnectWallet } from './useConnectWallet';
import { isMobile } from 'react-device-detect';

/**
 * Trying eager connect to connectors at first time.
 * @returns `tried` tried eager connect done or not
 */
export function useEagerConnect() {
	const { active, activate, library } = useWeb3React();
	const [tried, setTried] = useState(false);
	const { disconnectWallet } = useConnectWallet();

	useEffect(() => {
		const { ethereum } = window;
		const walletSelected = StorageUtils.getSectionStorageItem(
			STORAGE_KEYS.WALLET_CONNECTED
		);
		if (!walletSelected) return;
		if (walletSelected === ConnectorKey.injected) {
			Injected.isAuthorized().then((isAuthorized: boolean) => {
				if (isAuthorized) {
					activate(Injected, undefined, true).catch(() => {
						setTried(true);
						disconnectWallet();
					});
				} else {
					if (isMobile && ethereum) {
						activate(Injected, undefined, true).catch(() => {
							setTried(true);
							disconnectWallet();
						});
					} else {
						setTried(true);
					}
				}
			});
		}

		if (walletSelected === ConnectorKey.walletConnect && !library) {
			// setTimeout(() => {
			activate(walletConnect).catch(() => {
				setTried(true);
				disconnectWallet();
			});
			// }, 500);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [active]);

	useEffect(() => {
		if (!tried && active) {
			setTried(true);
		}
	}, [tried, active]);

	return tried;
}

export function useInactiveListener(suppress = false) {
	const { active, error, activate } = useWeb3React();

	useEffect((): any => {
		const ethereum = (window as any)?.ethereum;
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
