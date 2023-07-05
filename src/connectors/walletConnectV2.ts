import { initializeConnector } from '@web3-react/core';
import { WalletConnect as WalletConnectV2 } from '@web3-react/walletconnect-v2';

import { MAINNET_CHAINS } from '../chains';

const [mainnet, ...optionalChains] = Object.keys(MAINNET_CHAINS).map(Number);

export const [walletConnectV2, hooks] = initializeConnector<WalletConnectV2>(
	(actions: any) =>
		new WalletConnectV2({
			actions,
			options: {
				projectId: '9ef697a845fb33dcd3da7885a1036d3a',
				chains: [mainnet],
				optionalChains,
				showQrModal: true,
			},
		})
);
