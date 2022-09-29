export const ROUTES = {
	TOKEN_PRESALE_ROUNDS: '/token-presale-rounds',
	MY_PROFILE: '/my-profile',
	MINT_DNFT: '/mint-dnft',
	MINT_KEY: '/mint-key',
	MERGE_NFT: '/merge-nft',
	RESCUE_NFT: '/rescue-nft',
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

export const LIMIT_10 = 10 as number;
export const CURRENCY = 'BUSD';
export const UPCOMING = 'Upcoming';
export const BUY = 'Buy';
export const CLAIMABLE = 'Claimable';
export const END = 'End';
export const TIME_LINE_SALE_ROUND = [UPCOMING, BUY, CLAIMABLE, END];

//mint nft
export const LIST_PHASE_MINT_NFT = [
	{ label: 'Whitelist', value: 'WHITE_LIST' },
	{ label: 'Presale 1', value: 'PRESALE_1' },
	{ label: 'Presale 2', value: 'PRESALE_2' },
	{ label: 'Public', value: 'PUBLIC' },
];

export enum LIST_STATUS_TIME_LINE {
	DONE = 'DONE',
	RUNNING = 'RUNNING',
	PENDING = 'PENDING',
}

export const now = () => {
	return Date.now();
};
