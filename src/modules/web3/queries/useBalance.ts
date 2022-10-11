import BigNumber from 'bignumber.js';
import { formatEther } from 'ethers/lib/utils';
// import { useQuery } from 'react-query';
import { BIG_ZERO } from 'common/constants/bignumbers';
import { useErc20Contract } from 'web3/contracts';
import { useActiveWeb3React } from 'web3/hooks';
import { useEffect, useState } from 'react';

export const useBalance = (address: string) => {
	const { account } = useActiveWeb3React();
	const tokenContract = useErc20Contract(address);
	const [balance, setBalance] = useState<BigNumber>(BIG_ZERO);

	useEffect(() => {
		const getBalance = async () => {
			if (!tokenContract || !account) {
				return;
			}
			tokenContract
				.balanceOf(account)
				.then((balance) => {
					setBalance(new BigNumber(formatEther(balance)));
				})
				.catch(() => {
					setBalance(BIG_ZERO);
				});
		};
		getBalance();
	}, [account, tokenContract]);

	return balance;
};
