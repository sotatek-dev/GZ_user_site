import { metaMask, metamaskHooks } from './metamask';
import { walletConnect, walletConnectHooks } from './walletConnectV2';

export enum ConnectorKey {
	metamask = 'MetaMask',
	walletConnect = 'WalletConnect',
}

export const connectors = {
	[ConnectorKey.metamask]: metaMask,
	[ConnectorKey.walletConnect]: walletConnect,
};

export const hooks = {
	[ConnectorKey.metamask]: metamaskHooks,
	[ConnectorKey.walletConnect]: walletConnectHooks,
};
