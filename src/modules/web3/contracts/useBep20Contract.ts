import { HEX_ZERO } from 'common/constants/constants';
import { convertHexToNumber, fromWei } from 'common/utils/functions';
import { ethers } from 'ethers';
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
		return Number(allowance) >= amount;
	} catch (error) {
		return false;
	}
};

export const handleUserApproveERC20 = async (
	addressToken: string,
	contractAddress: string
) => {
	try {
		const contract = await genERC20PaymentContract(addressToken);
		const approve = await contract.approve(
			contractAddress,
			ethers.constants.MaxUint256
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
