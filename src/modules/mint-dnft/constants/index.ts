import BigNumber from 'bignumber.js';

export enum TOKENS {
	BUSD = 'BUSD',
	BNB = 'BNB',
}

export const selectTokensList = [TOKENS.BUSD, TOKENS.BNB];
export const minBalanceForMint = 5000;
export const DECIMAL_PLACED = 4;
export const TOKEN_DECIMAL = new BigNumber(10).pow(18);

export enum MINT_PHASE {
	WHITE_LIST = 'WHITE_LIST',
	PRESALE_1 = 'PRESALE_1',
	PRESALE_2 = 'PRESALE_2',
	PUBLIC = 'PUBLIC',
}

export enum MINT_PHASE_LABEL {
	WHITE_LIST = 'Whitelist',
	PRESALE_1 = 'Presale 1',
	PRESALE_2 = 'Presale 2',
	LAUNCH = 'Launch',
}

export enum MINT_PHASE_ID {
	WHITE_LIST = 1,
	PRESALE_1 = 2,
	PRESALE_2 = 3,
	PUBLIC = 4,
}

export enum MINT_PHASE_STATUS {
	DONE = 'DONE',
	RUNNING = 'RUNNING',
	PENDING = 'PENDING',
}

export const listPhaseId = [
	MINT_PHASE_ID.WHITE_LIST,
	MINT_PHASE_ID.PRESALE_1,
	MINT_PHASE_ID.PRESALE_2,
	MINT_PHASE_ID.PUBLIC,
];

export enum Message {
	MINT_SUCCESS = 'You can collect your dNFT 7 days after the end of Presale 2',
	RESCUE_SUCCESS = 'Transaction completed',

	REACH_LIMIT = 'You have reach the limitation of minting',
	NOT_HAVE_ENOUGH_BNB_BALANCE = "You don't have enough BNB",
	NOT_HAVE_ENOUGH_BUSD_BALANCE = "You don't have enough BUSD",
	NOT_ROYALTY = "You don't have enough BUSD for royalty",
	ELIGIBLE_TO_MINT = 'You are eligible to mint this NFT',
	ELIGIBLE_TO_CLAIM = 'You are eligible to claim this NFT',
	ELIGIBLE_TO_RESCUE = 'You are eligible to rescue this NFT',
	NOT_ELIGIBLE_TO_MINT = 'You are not eligible to mint this NFT',
	NO_NFT_LEFT = 'There is no NFT left to be rescued',
}
