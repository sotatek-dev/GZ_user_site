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

export const now = () => {
	return Date.now();
};

export const second = 1000;
export const minute = 1000 * 60;
export const hour = 1000 * 60 * 60;
export const day = 1000 * 60 * 60 * 24;

export const billion = 1000000000;
export const million = 1000000;
