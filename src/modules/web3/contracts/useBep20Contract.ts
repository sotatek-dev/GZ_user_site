import { HEX_ZERO } from 'common/constants/constants';
import { convertHexToNumber, fromWei, toWei } from 'common/utils/functions';
import { get } from 'lodash';
import Bep20ABI from 'web3/abis/bep20.json';
import { Bep20 } from '../abis/types';
import { genERC20PaymentContract } from './instance';
import { useContract } from './useContract';

export const useBep20Contract = (address: string): Bep20 | null => {
	return useContract<Bep20>(Bep20ABI, address);
};

//

export const isUserApprovedERC20 = async (
	tokenApproveAddress: string,
	userAddress: string,
	amount: number,
	contractAddress: string
) => {
	try {
		const contract = await genERC20PaymentContract(tokenApproveAddress);
		const result = await contract.allowance(userAddress, contractAddress);
		const allowance = fromWei(
			convertHexToNumber(get(result, '_hex', HEX_ZERO))
		);
		if (allowance >= amount) return true;
	} catch (error) {
		return false;
	}
};

export const handleUserApproveERC20 = async (
	addressToken: string,
	contractAddress: string,
	mergeTax: number | string
) => {
	try {
		const contract = await genERC20PaymentContract(addressToken);
		const decimal = await contract.decimals();
		const approve = await contract.approve(
			contractAddress,
			toWei(mergeTax, decimal)
		);
		const result = await approve.wait(1);
		return [result, null];
	} catch (error) {
		return [null, error];
	}
};

export const getERC20AmountBalance = async (
	contractAddress: string,
	walletAddress: string
) => {
	try {
		const contract = await genERC20PaymentContract(contractAddress);
		const response = await contract.balanceOf(walletAddress);
		return [response, null];
	} catch (error) {
		return [null, error];
	}
};
