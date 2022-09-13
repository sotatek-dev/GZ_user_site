import { NETWORK_ID } from 'web3/constants/storages';

export const checkNetwork = (chainId: number, networkSelected?: any) => {
	const networkIdSelected = networkSelected
		? networkSelected
		: localStorage.getItem(NETWORK_ID);
	return chainId === parseInt(networkIdSelected as string);
};
