import BigNumber from 'bignumber.js';
import { formatEther } from 'ethers/lib/utils';
// import { useQuery } from 'react-query';
import { BIG_ZERO } from 'common/constants/bignumbers';
import { useActiveWeb3React } from 'web3/hooks';
import { useBep20Contract } from 'web3/contracts/useBep20Contract';
import { useQuery } from 'react-query';

export const useBalance = (address: string) => {
	const { account } = useActiveWeb3React();
	const tokenContract = useBep20Contract(address);

	const getBalance = async () => {
		if (!tokenContract || !account) return;

		try {
			const balance = await tokenContract.balanceOf(account);
			return new BigNumber(formatEther(balance));
		} catch {
			return BIG_ZERO;
		}
	};

	const { data: balance = BIG_ZERO, isLoading } = useQuery(
		['getBalance', address, account],
		getBalance
	);
	return { balance, isLoading };
};
