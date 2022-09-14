export const ROUTES = {
	TOKEN_PRESALE_ROUNDS: 'token-presale-rounds',
	MY_PROFILE: 'my-profile',
	MINT_DNFT: 'mint-dnft',
	MINT_KEY: 'mint-key',
	MERGE_DNFT: 'merge-dnft',
	RESCUE_NFT: 'rescue-nft',
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
