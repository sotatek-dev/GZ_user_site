import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { BSC_CHAIN_ID } from 'web3/constants/envs';
import RPC from 'web3/constants/rpc';

const bsc_chain_id = Number(BSC_CHAIN_ID);
const WALLET_CONNECT_BRIDGE_URL = 'https://bridge.walletconnect.org';

export const Injected = new InjectedConnector({
	supportedChainIds: [bsc_chain_id],
});

export const walletConnect = new WalletConnectConnector({
	supportedChainIds: [bsc_chain_id],
	rpc: RPC,
	bridge: WALLET_CONNECT_BRIDGE_URL,
	qrcode: true,
});
