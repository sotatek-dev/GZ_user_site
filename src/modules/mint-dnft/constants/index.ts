import BigNumber from 'bignumber.js';

export enum TOKENS {
	BUSD = 'BUSD',
	BNB = 'BNB',
}

export const selectTokensList = [TOKENS.BUSD, TOKENS.BNB];
export const minBalanceForMint = 5000;
export const DECIMAL = 4;
export const TOKEN_DECIMAL = new BigNumber(10).pow(18);
