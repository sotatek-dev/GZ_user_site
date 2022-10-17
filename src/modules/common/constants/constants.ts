import { NEXT_PUBLIC_BUSD } from 'web3/contracts/instance';

export const ROUTES = {
	TOKEN_PRESALE_ROUNDS: '/token-presale-rounds',
	TOKEN_PRESALE_ROUNDS_DETAIL: '/token-presale-rounds/detail',
	MY_PROFILE: '/my-profile',
	MINT_DNFT: '/mint-dnft',
	MINT_KEY: '/mint-key',
	LIST_DNFT: '/list-dnft',
	LIST_DNFT_DETAIL: '/list-dnft/',
	RESCUE_NFT: '/rescue-nft',
	LANDING: '/landing',
	NFT_DETAIL: '/dnft-detail',
};

export enum STEP_MODAL_CONNECTWALLET {
	SELECT_NETWORK_AND_WALLET = 'SELECT_NETWORK_AND_WALLET',
	LOADING = 'LOADING',
	CONNECT_WALLET = 'CONNECT_WALLET',
	SWITCH_NETWORK = 'SWITCH_NETWORK',
	SIGN_IN = 'SIGN_IN',
}

export enum STATUS_STEP {
	WAIT = 'wait',
	PROCESS = 'process',
	FINISH = 'finish',
}

export const LIMIT_8 = 8 as number;
export const LIMIT_10 = 10 as number;
export const LIMIT_12 = 12 as number;
export const CURRENCY = 'BUSD';
export const UPCOMING = 'Upcoming';
export const BUY = 'Buy';
export const CLAIMABLE = 'Claimable';
export const UPCOMING_CLAIMABLE = 'Upcoming Claimable';
export const END = 'End';
export const TIME_LINE_SALE_ROUND = [UPCOMING, BUY, CLAIMABLE, END];
export const STATUS_LIST_SALE_ROUND = {
	UPCOMING: 'Upcoming',
	BUY: 'Buyable',
	CLAIMABLE: 'Claimable',
	END: 'Ended',
};

export enum ROUND_TYPE {
	MINT_NFT = 'mint-nft',
	SALE_ROUND = 'sale-round',
}

export const now = () => {
	return Date.now();
};

export const second = 1000;
export const minute = 1000 * 60;
export const hour = 1000 * 60 * 60;
export const day = 1000 * 60 * 60 * 24;

export const billion = 1000000000;
export const million = 1000000;

export const HEX_ZERO = '0x00';
export const BUSD_CURRENCY = 'BUSD';
export const BNB_CURRENCY = 'BNB';
export const GXZ_CURRENCY = 'GXZ';
export const BSC_DECIMAL = 18;
export const TYPE_SALE_ROUND = 'sale-round';
export enum STATUS_LIST_DNFT {
	NORMAL = 'normal',
	UNLOCK = 'unlocked',
}

export enum SALE_ROUND_CURRENT_STATUS {
	UPCOMING = 'upcoming',
	BUY = 'buy',
	CLAIMABLE = 'claimable',
	CLAIMABLE_UPCOMING = 'claimable_upcoming',
	INACTIVE = 'inactive',
	END = 'end',
	UNKNOWN = 'unknown',
}

export const SPECIES_DNFT: Array<{ [key: string]: string }> = [
	{ key: 'Adelio', label: 'Adelio' },
	{ key: 'Kinga', label: 'Kinga' },
	{ key: 'Empa', label: 'Empa' },
];

export const RARITY_DNFT: Array<{ [key: string]: string }> = [
	{ key: 'Common', label: 'Common' },
	{ key: 'Rare', label: 'Rare' },
	{ key: 'UltraRare', label: 'Ultra Rare' },
	{ key: 'Legendary', label: 'Legendary' },
	{ key: 'UltraLegendary', label: 'Ultra Legendary' },
	{ key: 'APEX', label: 'Apex' },
];

export const ERC20_ADDRESS: { [key: string]: string } = {
	busd: NEXT_PUBLIC_BUSD,
	eth: '0x0000000000000000000000000000000000000000',
};

export const DECIMALS = {
	BUSD_DECIMALS: 18,
	BNB_DECIMALS: 18,
};

export const RPC_CHAIN: { [key: number]: string } = {
	97: 'https://data-seed-prebsc-1-s1.binance.org:8545/', // bsc testnet
	5: 'goerli', // goerli
	3: 'ropsten', // ropsten
	137: 'https://polygonapi.terminet.io/rpc', // polygon mainnet
	80001: 'https://rpc-mumbai.maticvigil.com', // mumbai - polygon testnet
};

export const STATUS_CODE = {
	SUCCESS: 200,
};

export const TITLE_TIME_COUNTDOWN = {
	UPCOMING: 'You can buy tokens in',
	BUY: 'Buy phase will end in',
	CLAIMABLE_ONE_TIME_ONLY: 'You can claim amount GXZ tokens in',
	CLAIMABLE_MORE_THAN: 'You can claim amount GXZ tokens more in',
	END: 'Round ended',
};

export const ROYALTY_FEE_PURCHASE = 0.0225; // 2.25%
