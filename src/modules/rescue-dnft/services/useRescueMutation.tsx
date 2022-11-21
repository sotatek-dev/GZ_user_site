import { useState } from 'react';
import { AbiDnft, AbiKeynft, AbiPresalepool } from 'web3/abis/types';
import DNFTABI from 'web3/abis/abi-dnft.json';
import DKEYNFTABI from 'web3/abis/abi-keynft.json';
import PresalePoolAbi from 'web3/abis/abi-presalepool.json';
import { useContract } from 'web3/contracts/useContract';
import { useApproval } from 'web3/hooks';
import { isApproved } from 'common/utils/functions';
import { TOKEN_DECIMAL, TOKENS } from 'modules/mint-dnft/constants';
import RescueSuccessToast from '../components/RescueSuccessToast';
import { message } from 'antd';
import { handleWriteMethodError } from 'common/helpers/handleError';
import {
	fetchClaimableTime,
	fetchListPhase,
	fetchRate,
} from 'modules/mint-dnft/helpers/fetch';

import { useAppDispatch, useAppSelector } from 'stores';
import { ContractTransaction } from 'ethers';
import {
	fetchLaunchPriceInBUSD,
	fetchListKey,
	fetchPoolRemaining,
	fetchPriceInBUSD,
	fetchRescuePriceBUSD,
} from './apis';
import BigNumber from 'bignumber.js';

export const useRescueMutation = () => {
	const dispatch = useAppDispatch();
	const { rate } = useAppSelector((state) => state.mintDnft);
	const { addressWallet } = useAppSelector((state) => state.wallet);
	const dnftContract = useContract<AbiDnft>(
		DNFTABI,
		process.env.NEXT_PUBLIC_DNFT_ADDRESS || ''
	);
	const presalePoolContract = useContract<AbiPresalepool>(
		PresalePoolAbi,
		process.env.NEXT_PUBLIC_PRESALE_POOL_ADDRESS || ''
	);

	const keyNftContract = useContract<AbiKeynft>(
		DKEYNFTABI,
		process.env.NEXT_PUBLIC_KEYNFT_ADDRESS || ''
	);
	const [isDoingRescue, setIsDoingRescue] = useState<boolean>(false);

	const { allowanceAmount: allowanceBusdAmount, tryApproval: tryApproveBusd } =
		useApproval(
			process.env.NEXT_PUBLIC_BUSD_ADDRESS || '',
			process.env.NEXT_PUBLIC_DNFT_ADDRESS || ''
		);

	const tryRescue = async (key: string, token: TOKENS) => {
		try {
			setIsDoingRescue(true);

			const isBnbRescue = token === TOKENS.BNB;
			let tx: ContractTransaction | null;

			if (isBnbRescue) {
				tx = (await tryBNBRescue(key, token)) || null;
			} else {
				tx = (await tryBUSDRescue(key, token)) || null;
			}

			await tx?.wait();
			const hash: string = tx ? tx.hash : '';
			if (hash) {
				message.success(<RescueSuccessToast txHash={hash} />);
			}
		} catch (e) {
			handleWriteMethodError(e);
		} finally {
			reloadData();
			setIsDoingRescue(false);
		}
	};

	const tryBUSDRescue = async (...params: Parameters<typeof tryRescue>) => {
		const [key, token] = params;

		if (dnftContract) {
			if (!isApproved(allowanceBusdAmount) && token === TOKENS.BUSD) {
				await tryApproveBusd(true);
			}
			return await dnftContract.rescueUsingKey(key, false);
		} else {
			throw new Error();
		}
	};

	const tryBNBRescue = async (...params: Parameters<typeof tryRescue>) => {
		const [key, token] = params;
		if (dnftContract) {
			const priceInBUSD = await fetchRescuePriceBUSD(dnftContract);

			const price = new BigNumber(priceInBUSD || 0)
				.times(rate)
				.times(TOKEN_DECIMAL)
				.dp(0)
				.toString(10);
			if (!isApproved(allowanceBusdAmount) && token === TOKENS.BUSD) {
				await tryApproveBusd(true);
			}

			return await dnftContract.rescueUsingKey(key, true, {
				value: price,
			});
		} else {
			throw new Error();
		}
	};

	const reloadData = async () => {
		// dispatch(fetchListPhase({ dnftContract }));
		dispatch(fetchListPhase());
		dispatch(fetchClaimableTime({ dnftContract }));

		dispatch(fetchPriceInBUSD({ dnftContract }));
		dispatch(fetchLaunchPriceInBUSD({ dnftContract }));
		dispatch(fetchPoolRemaining({ dnftContract }));
		dispatch(fetchRate({ presalePoolContract }));
		dispatch(
			fetchListKey({
				dnftContract,
				keyNftContract,
				walletAddress: addressWallet,
			})
		);
	};

	return { tryRescue, isDoingRescue };
};
