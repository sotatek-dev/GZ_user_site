import BigNumber from 'bignumber.js';

export const BIG_ZERO = new BigNumber(0);
export const BIG_ONE = new BigNumber(1);
export const BIG_TEN = new BigNumber(10);
export const BIG_HUNDRED = new BigNumber(100);

export const UNLIMITED_ALLOWANCE_IN_BASE_UNITS = new BigNumber(2)
	.pow(256)
	.minus(1);
