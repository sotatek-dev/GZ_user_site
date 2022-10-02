import { NETWORK_ID } from 'web3/constants/storages';
import { ethers } from 'ethers';

export const checkNetwork = (chainId: number, networkSelected?: any) => {
	const networkIdSelected = networkSelected
		? networkSelected
		: localStorage.getItem(NETWORK_ID);
	return chainId === parseInt(networkIdSelected as string);
};

export const convertBigNumberValueToNumber = (
	weiBalance: any,
	decimal: string | number
) => {
	const res = ethers.utils.formatUnits(weiBalance, decimal).toString();
	return res;
};
