import { BaseContract, ContractInterface, ethers } from 'ethers';
import { useActiveWeb3React } from '../hooks/useActiveWeb3React';
import { getContract } from '../helpers/getContract';
import { useMemo } from 'react';
import { JsonRpcSigner } from '@ethersproject/providers';

export const useContract = <T extends BaseContract>(
	abi: ContractInterface,
	address: string
): T | null => {
	const { library } = useActiveWeb3React();

	return useMemo(() => {
		if (!ethers.utils.isAddress(address) || typeof window === 'undefined') {
			return null;
		}

		const signer: JsonRpcSigner | undefined = library?.getSigner();
		let signerOrProvider: Parameters<typeof getContract>[2] =
			// new ethers.providers.Web3Provider(window.ethereum);
			new ethers.providers.JsonRpcProvider(
				'https://data-seed-prebsc-1-s1.binance.org:8545/'
			);
		if (signer) {
			signerOrProvider = signer;
		}

		return getContract<T>(abi, address, signerOrProvider);
	}, [abi, address, library]);
};
