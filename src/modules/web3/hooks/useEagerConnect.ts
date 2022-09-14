import { useWeb3React } from '@web3-react/core';
import StorageUtils, { STORAGE_KEYS } from 'common/utils/storage';
import { useEffect, useState } from 'react';
import { ConnectorKey, connectors } from '../connectors';
import { useConnectWallet } from './useConnectWallet';

/**
 * Trying eager connect to connectors at first time.
 * @returns `tried` tried eager connect done or not
 */
export function useEagerConnect() {
	const { active } = useWeb3React();
	const { connectWallet } = useConnectWallet();
	const [tried, setTried] = useState(false);

	useEffect(() => {
		const wallet = StorageUtils.getItem(STORAGE_KEYS.WALLET_CONNECTED);
		if (!active) {
			connectors[ConnectorKey.injected]
				.isAuthorized()
				.then((isAuthorized) => {
					if (
						isAuthorized &&
						Object.values(ConnectorKey).includes(wallet as ConnectorKey)
					) {
						return connectWallet(wallet as ConnectorKey);
					}
				})
				.finally(() => {
					setTried(true);
				});

			return;
		}

		setTried(true);
	}, [active]);

	return tried;
}
