import { Injected, walletConnect } from './injected';

export enum ConnectorKey {
	injected = 'MetaMask',
	walletConnect = 'WalletConnect',
}

export const connectors = {
	[ConnectorKey.injected]: Injected,
	[ConnectorKey.walletConnect]: walletConnect,
};
