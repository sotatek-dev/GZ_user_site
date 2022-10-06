import BigNumber from 'bignumber.js';
import { toString } from 'lodash';

const BILLION = 1000000000;
const MILLION = 1000000;
export function numberWithSymbol(num: number, symbol: string) {
	return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, symbol);
}

export function formatCurrency(num: number): string {
	const [convert] = toString(num).split('.');
	if (Math.floor(+convert / BILLION) > 0) {
		return `${Math.floor(+convert / BILLION)}B`;
	}
	if (Math.floor(+convert / MILLION) > 0) {
		return `${Math.floor(+convert / MILLION)}M`;
	}

	return formatBigNumber(num, 4);
}

export function formatBigNumber(value: BigNumber.Value, decimals = 2) {
	BigNumber.config({ ROUNDING_MODE: BigNumber.ROUND_DOWN });
	return new BigNumber(value).decimalPlaces(decimals).toFormat();
}
