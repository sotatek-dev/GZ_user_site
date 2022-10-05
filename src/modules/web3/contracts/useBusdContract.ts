import { AbiBusd } from '../abis/types';
import { useContract } from './useContract';
import BusdABI from 'web3/abis/abi-busd.json';

export const useBusdContract = (address: string): AbiBusd | null => {
	return useContract<AbiBusd>(BusdABI, address);
};
