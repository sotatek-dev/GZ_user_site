import { ConnectorKey } from 'web3/connectors';
import { metaMask } from 'web3/connectors/metamask';
import { walletConnect } from 'web3/connectors/walletConnectV2';

export const SUPPORTED_WALLETS = [
	{
		connector: metaMask,
		walletName: ConnectorKey.metamask,
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
