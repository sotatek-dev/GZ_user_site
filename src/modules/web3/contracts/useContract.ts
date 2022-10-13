import { BaseContract, Contract, ContractInterface, ethers } from 'ethers';
import { useActiveWeb3React } from '../hooks/useActiveWeb3React';
import { getContract } from '../helpers/getContract';
import { useEffect, useMemo, useState } from 'react';

export const useContract = <T extends BaseContract>(
	abi: ContractInterface,
	address: string
): T | null => {
	const [defaultContract, setDefaultContract] = useState<any>();
	const { library } = useActiveWeb3React();

	const contract = useMemo(() => {
		if (!ethers.utils.isAddress(address)) {
			return null;
		}

		if (!library) {
			return null;
		}

		return getContract<T>(abi, address, library?.getSigner());
	}, [abi, address, library]);

	useEffect(() => {
		if (window?.ethereum) {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			setDefaultContract(new Contract(address, abi, provider));
		}
	}, []);

	return contract || defaultContract;
};
