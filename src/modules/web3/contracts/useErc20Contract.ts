import { HEX_ZERO } from 'common/constants/constants';
import { fromWei } from 'common/utils/functions';
import { get } from 'lodash';
import Erc20ABI from 'web3/abis/erc20.json';
import { Erc20 } from '../abis/types';
import { genERC20PaymentContract, NEXT_PUBLIC_PRESALE_POOL } from './instance';
import { useContract } from './useContract';
const MAX_INT =
	'0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

export const useErc20Contract = (address: string): Erc20 | null => {
	return useContract<Erc20>(Erc20ABI, address);
};

export const isUserApprovedERC20 = async (
	contractAddress: string,
	userAddress: string,
	amount: number
) => {
	try {
		const contract = await genERC20PaymentContract(contractAddress);
		const result = await contract.allowance(
			userAddress,
			NEXT_PUBLIC_PRESALE_POOL
		);
		const allowance = fromWei(get(result, '_hex', HEX_ZERO));
		if (allowance > amount) return true;
	} catch (error) {
		return false;
	}
};

export const handleUserApproveERC20 = async (contractAddress: string) => {
	try {
		const contract = await genERC20PaymentContract(contractAddress);
		const approve = await contract.approve(NEXT_PUBLIC_PRESALE_POOL, MAX_INT);
		return [approve, null];
	} catch (error) {
		return [null, error];
	}
};
