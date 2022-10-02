import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useWeb3React } from '@web3-react/core';
import { DECIMALS, ERC20_ADDRESS } from 'common/constants/constants';
import { getERC20AmountBalance } from 'web3/contracts/useErc20Contract';
import { convertBigNumberValueToNumber } from 'web3/contracts/ether';
import { setBalance } from 'stores/wallet';

export const useUpdateBalance = () => {
	const { library, account, chainId } = useWeb3React();
	const [refresh, setRefresh] = useState<number>(0);
	const accessToken = useSelector((state) => state.user.accessToken);

	const handleGetBalance = useCallback(async () => {
		if (!accessToken || !library || !account) return;
		try {
			const temptBUSDBalance = await getERC20AmountBalance(
				ERC20_ADDRESS.busd,
				account as string
			);

			const numberBUSDBalance = temptBUSDBalance[0]
				? convertBigNumberValueToNumber(
						temptBUSDBalance[0],
						DECIMALS.BUSD_DECIMALS
				  )
				: '0';

			setBalance({
				busdBalance: JSON.parse(numberBUSDBalance),
			});
		} catch (error) {
			console.log('Error getBalance', error);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [library, account, accessToken, chainId]);

	useEffect(() => {
		if (refresh) {
			handleGetBalance();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [refresh]);
	return {
		updateBalance: () => setRefresh(Date.now()),
	};
};
