import BigNumber from 'bignumber.js';
import { formatEther } from 'ethers/lib/utils';
import { useActiveWeb3React } from 'web3/hooks/useActiveWeb3React';
import { useQuery } from 'react-query';
import { BIG_ZERO } from 'common/constants/bignumbers';

export const useNativeBalance = () => {
	const { library: provider, account } = useActiveWeb3React();

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
