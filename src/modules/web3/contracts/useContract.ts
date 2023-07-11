import { BaseContract, ContractInterface, ethers } from 'ethers';
import { getContract } from '../helpers/getContract';
import { useMemo } from 'react';
import { JsonRpcSigner } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';

export const useContract = <T extends BaseContract>(
	abi: ContractInterface,
	address: string
): T | null => {
	const { provider } = useWeb3React();

	return useMemo(() => {
		if (
			!provider ||
			!ethers.utils.isAddress(address) ||
			typeof window === 'undefined'
		) {
			return null;
		}

		const signer: JsonRpcSigner | undefined = provider?.getSigner();
		let signerOrProvider: Parameters<typeof getContract>[2] =
			new ethers.providers.StaticJsonRpcProvider(
				process.env.NEXT_PUBLIC_BSC_RPC_URL
			);

		if (signer) {
			signerOrProvider = signer;
		}

		return getContract<T>(abi, address, signerOrProvider);
	}, [abi, address, provider]);
};
