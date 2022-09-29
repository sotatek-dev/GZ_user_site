import BigNumber from 'bignumber.js';

export enum TOKENS {
	BUSD = 'BUSD',
	BNB = 'BNB',
}

export const selectTokensList = [TOKENS.BUSD, TOKENS.BNB];
export const minBalanceForMint = 5000;
export const DECIMAL = 4;
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
	PUBLIC = 'Public',
}

export enum MINT_PHASE_ID {
	WHITE_LIST = 1,
	PRESALE_1 = 2,
	PRESALE_2 = 3,
	PUBLIC = 4,
}
export const listPhaseId = [
	MINT_PHASE_ID.WHITE_LIST,
	MINT_PHASE_ID.PRESALE_1,
	MINT_PHASE_ID.PRESALE_2,
	MINT_PHASE_ID.PUBLIC,
];
