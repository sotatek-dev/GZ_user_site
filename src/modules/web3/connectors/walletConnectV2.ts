import { initializeConnector } from '@web3-react/core';
import { WalletConnect as WalletConnectV2 } from '@web3-react/walletconnect-v2';

import { CHAINS } from '../chains';
import { BSC_RPC_URL } from 'web3/constants/envs';

const [mainnet] = Object.keys(CHAINS).map(Number);

export const [walletConnect, walletConnectHooks] =
	initializeConnector<WalletConnectV2>(
		(actions) =>
			new WalletConnectV2({
				actions,
				options: {
					projectId: 'e4f5df559cc7a033a42ca6ca3a0357be',
					chains: [mainnet],
					showQrModal: true,
					rpcMap: {
						97: BSC_RPC_URL,
					},
				},
			})
	);
