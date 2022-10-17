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
			new ethers.providers.StaticJsonRpcProvider(
				process.env.NEXT_PUBLIC_BSC_RPC_URL
			);

		if (signer) {
			signerOrProvider = signer;
		}

		return getContract<T>(abi, address, signerOrProvider);
	}, [abi, address, library]);
};
