import { ConnectorKey } from 'web3/connectors';
import { Injected, walletConnect } from 'web3/connectors/injected';

export const SUPPORTED_WALLETS = [
	{
		connector: Injected,
		walletName: ConnectorKey.injected,
		icon: '/icons/metamask.svg',
		isDisabled: false,
	},
	{
		connector: walletConnect,
		walletName: ConnectorKey.walletConnect,
		icon: '/icons/walletconnect.svg',
		isDisabled: false,
	},
];
