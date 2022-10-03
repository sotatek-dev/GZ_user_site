import { ConnectorKey } from 'web3/connectors';
import { Injected } from 'web3/connectors/injected';

export const SUPPORTED_WALLETS = [
	{
		connector: Injected,
		walletName: ConnectorKey.injected,
		icon: '/icons/metamask.svg',
		isDisabled: false,
	},
];
