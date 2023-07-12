import { initializeConnector } from '@web3-react/core';
import { WalletConnect as WalletConnectV2 } from '@web3-react/walletconnect-v2';

import { CHAINS } from '../chains';
import { BSC_CHAIN_ID, BSC_RPC_URL } from 'web3/constants/envs';

const [mainnet] = Object.keys(CHAINS).map(Number);

export const [walletConnect, walletConnectHooks] =
	initializeConnector<WalletConnectV2>(
		(actions) =>
			new WalletConnectV2({
				actions,
				options: {
					projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECTID as string,
					chains: [mainnet],
					showQrModal: true,
					rpcMap: {
						[BSC_CHAIN_ID]: BSC_RPC_URL,
					},
				},
			})
	);
