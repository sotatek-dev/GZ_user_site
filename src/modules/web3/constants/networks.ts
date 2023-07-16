import {
	BSC_BLOCK_EXPLORER_URL,
	BSC_CHAIN_ID,
	BSC_CHAIN_ID_HEX,
	BSC_CHAIN_NAME,
	BSC_RPC_URL,
} from './envs';

export interface INativeCurrency {
	NAME: string;
	SYMBOL: string;
	DECIMAL: number;
}

export interface INetwork {
	CHAIN_ID_HEX: string | undefined;
	CHAIN_ID_DECIMAL: number | undefined;
	CHAIN_NAME: string;
	RPC_URLS: string;
	BLOCK_EXPLORER_URLS: string;
	NATIVE_CURRENCY: INativeCurrency;
}
export interface INetworkList {
	icon: string;
	networkName: string;
	isDisabled: boolean;
	supportedNetwork: INetwork;
	chainId: string | undefined;
	currency: string;
}

export const NETWORK_NAME = {
	BSC: 'BSC',
};

export const BSC_NETWORK = {
	CHAIN_ID_HEX: BSC_CHAIN_ID_HEX,
	CHAIN_ID_DECIMAL: Number(BSC_CHAIN_ID),
	CHAIN_NAME: BSC_CHAIN_NAME,
	RPC_URLS: BSC_RPC_URL,
	BLOCK_EXPLORER_URLS: BSC_BLOCK_EXPLORER_URL,
	NATIVE_CURRENCY: {
		NAME: BSC_CHAIN_NAME,
		SYMBOL: 'tBNB',
		DECIMAL: 18,
	},
};

export const NETWORK_LIST: Array<INetworkList> = [
	{
		icon: '/icons/bsc-network.svg',
		networkName: NETWORK_NAME.BSC,
		isDisabled: false,
		supportedNetwork: BSC_NETWORK,
		chainId: BSC_CHAIN_ID,
		currency: 'BNB',
	},
];
