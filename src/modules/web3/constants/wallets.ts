import { Injected } from 'web3/connectors/injected';

export const SUPPORTED_WALLETS = [
	{
		connector: Injected,
		walletName: 'MetaMask',
		icon: './icons/metamask.svg',
		isDisabled: false,
	},
];
