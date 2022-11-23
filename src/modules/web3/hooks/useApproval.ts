import { message } from 'antd';
import BigNumber from 'bignumber.js';
import { constants } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import myProfileConstants from 'modules/my-profile/constant';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useBep20Contract } from '../contracts/useBep20Contract';
import { useActiveWeb3React } from './useActiveWeb3React';

/**
 * Hook for token approving
 * @param tokenAddress token address need to check approval state
 * @param spender which contract address want to use your token
 * @returns approval state and trying approve function
 */
export const useApproval = (tokenAddress: string, spender: string) => {
	const queryClient = useQueryClient();
	const tokenContract = useBep20Contract(tokenAddress);
	const { account } = useActiveWeb3React();

	const getAllowance = async () => {
		if (!tokenContract || !account) return;

		const allowanceAmount = await tokenContract.allowance(account, spender);
		return new BigNumber(formatEther(allowanceAmount));
	};

	const { data: allowanceAmount } = useQuery(
		['getAllowance', tokenAddress, account],
		getAllowance
	);

	/**
	 * Trying approve
	 * @param rethrowErr throw error to outer try/catch block
	 * @returns void
	 */
	const approve = async (rethrowErr?: boolean) => {
		if (!tokenContract) return;

		try {
			const txn = await tokenContract.approve(
				spender,
				new BigNumber(constants.MaxUint256.toString()).toString(10)
			);
			await txn.wait();
		} catch (error) {
			if (rethrowErr) {
				throw error;
			}
		}
	};

	const { mutateAsync: tryApproval, isLoading: isApproving } = useMutation(
		approve,
		{
			onSuccess() {
				message.success(myProfileConstants.TRANSACTION_COMFIRMATION);
				return queryClient.invalidateQueries(['getAllowance']);
			},
			onError(err) {
				return handleTxError(err);
			},
		}
	);

	return {
		allowanceAmount,
		tryApproval,
		isApproving,
	};
};

export const TX_ERROR_CODE = {
	REJECTED: 'ACTION_REJECTED',
	WALLET_CONNECT_REJECTED: -32000,
};

/**
 * Handle Smart Contract interaction error
 * @param err error object from try-catch or promise block
 * @param callback callback handler with tx error state, (updating Tx state usually)
 * @returns void
 */
export const handleTxError = (err: unknown) => {
	const { code } = err as { code: string | number };

	if (
		code === TX_ERROR_CODE.REJECTED ||
		code === TX_ERROR_CODE.WALLET_CONNECT_REJECTED
	) {
		message.error(myProfileConstants.TRANSACTION_REJECTED);
		return;
	}

	throw err;
};
