// import { Newtwork } from '../types';
import {
	// ETH_BLOCK_EXPLORER_URL,
	BSC_CHAIN_ID,
	BSC_CHAIN_ID_HEX,
	// ETH_RPC_URL,
	// REACT_APP_ETH_NAME,
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

// export const SUPPORTED_NETWORKS: { [key: string]: Newtwork } = {
// 	[BSC_CHAIN_ID]: {
// 		chainId: Number(BSC_CHAIN_ID),
// 		chainIdHex: BSC_CHAIN_ID_HEX,
// 		chainName: REACT_APP_ETH_NAME,
// 		nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
// 		blockExplorerUrls: [ETH_BLOCK_EXPLORER_URL],
// 		rpcUrls: [ETH_RPC_URL],
// 	},
// };
export const NETWORK_NAME = {
	BSC: 'BSC',
};

export const BSC_NETWORK = {
	CHAIN_ID_HEX: BSC_CHAIN_ID_HEX,
	CHAIN_ID_DECIMAL: 97,
	CHAIN_NAME: 'Binance Smart Chain Testnet',
	RPC_URLS: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
	BLOCK_EXPLORER_URLS: 'https://testnet.bscscan.com/',
	NATIVE_CURRENCY: {
		NAME: 'Binance Smart Chain Testnet',
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
