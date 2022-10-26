import { NETWORK_ID } from 'web3/constants/storages';
import { ethers } from 'ethers';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const checkNetwork = (chainId: number, networkSelected?: any) => {
	const networkIdSelected = networkSelected
		? networkSelected
		: localStorage.getItem(NETWORK_ID);
	return chainId === parseInt(networkIdSelected as string);
};

export const convertBigNumberValueToNumber = (
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	weiBalance: any,
	decimal: string | number
) => {
	const res = ethers.utils.formatUnits(weiBalance, decimal).toString();
	return res;
};
