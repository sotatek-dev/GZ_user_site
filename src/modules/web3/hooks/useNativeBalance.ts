import BigNumber from 'bignumber.js';
import { formatEther } from 'ethers/lib/utils';
import { useQuery } from 'react-query';
import { BIG_ZERO } from 'common/constants/bignumbers';
import { useWeb3React } from '@web3-react/core';

export const useNativeBalance = () => {
	const { provider, account } = useWeb3React();

	const getBalance = async () => {
		if (!provider || !account) {
			return;
		}

		const balance = await provider.getBalance(account);
		return new BigNumber(formatEther(balance));
	};

	const { data: balance } = useQuery(['getETHBalance', account], getBalance);
	return balance || BIG_ZERO;
};
