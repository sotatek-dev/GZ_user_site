// import { Newtwork } from '../types';
import {
	// ETH_BLOCK_EXPLORER_URL,
	ETH_CHAIN_ID,
	ETH_CHAIN_ID_HEX,
	// ETH_RPC_URL,
	// REACT_APP_ETH_NAME,
} from './envs';

// export const SUPPORTED_NETWORKS: { [key: string]: Newtwork } = {
// 	[ETH_CHAIN_ID]: {
// 		chainId: Number(ETH_CHAIN_ID),
// 		chainIdHex: ETH_CHAIN_ID_HEX,
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
	CHAIN_ID_HEX: ETH_CHAIN_ID_HEX,
	CHAIN_ID_DECIMAL: ETH_CHAIN_ID,
	CHAIN_NAME: 'Binance Smart Chain',
	RPC_URLS: 'https://bsc-dataseed.binance.org/',
	BLOCK_EXPLORER_URLS: 'https://www.bscscan.com/',
	NATIVE_CURRENCY: {
		NAME: 'Binance Smart Chain',
		SYMBOL: 'BSC',
		DECIMAL: 18,
	},
};

export const NETWORK_LIST = [
	{
		icon: './icons/bsc-network.svg',
		networkName: NETWORK_NAME.BSC,
		isDisabled: false,
		supportedNetwork: BSC_NETWORK,
		chainId: ETH_CHAIN_ID,
		currency: 'BNB',
	},
];
