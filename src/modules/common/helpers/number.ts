const BILLION = 1000000000;
const MILLION = 1000000;
export function numberWithSymbol(num: number, symbol: string) {
	return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, symbol);
}

export function formatConcurrency(num: number): string {
	if (Math.floor(num / BILLION) > 0) {
		return `${Math.floor(num / BILLION)}B`;
	}
	if (Math.floor(num / MILLION) > 0) {
		return `${Math.floor(num / MILLION)}M`;
	}
	return numberWithSymbol(num, ',');
}
