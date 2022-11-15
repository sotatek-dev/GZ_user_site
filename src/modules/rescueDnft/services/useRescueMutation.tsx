import { useState } from 'react';
import { AbiDnft, AbiKeynft } from 'web3/abis/types';
import DNFTABI from 'web3/abis/abi-dnft.json';
import DKEYNFTABI from 'web3/abis/abi-keynft.json';
import { useContract } from 'web3/contracts/useContract';
import { useApproval } from 'web3/hooks';
import { isApproved } from 'common/utils/functions';
import { TOKENS } from 'modules/mintDnft/constants';
import RescueSuccessToast from '../components/RescueSuccessToast';
import { message } from 'antd';
import { handleWriteMethodError } from 'common/helpers/handleError';
import {
	fetchClaimableTime,
	fetchListPhase,
	fetchRate,
} from 'modules/mintDnft/helpers/fetch';
import {
	fetchLaunchPriceInBUSD,
	fetchListKey,
	fetchPoolRemaining,
	fetchPriceInBUSD,
} from '../helpers/fetch';
import { useAppDispatch, useAppSelector } from 'stores';
import { fetchRescuePriceBUSD } from './api/fetchRescuePrice';
import { getBusb2Bnb } from 'modules/myProfile/services/apis';
import { ContractTransaction } from 'ethers';

export const useRescueMutation = () => {
	const dispatch = useAppDispatch();
	const { addressWallet } = useAppSelector((state) => state.wallet);
	const [isDoingRescue, setIsDoingRescue] = useState<boolean>(false);
	const dnftContract = useContract<AbiDnft>(
		DNFTABI,
		process.env.NEXT_PUBLIC_DNFT_ADDRESS || ''
	);

	const keyNftContract = useContract<AbiKeynft>(
		DKEYNFTABI,
		process.env.NEXT_PUBLIC_KEYNFT_ADDRESS || ''
	);

	const { allowanceAmount: allowanceBusdAmount, tryApproval: tryApproveBusd } =
		useApproval(
			process.env.NEXT_PUBLIC_BUSD_ADDRESS || '',
			process.env.NEXT_PUBLIC_DNFT_ADDRESS || ''
		);

	const tryRescue = async (key: string, token: TOKENS) => {
		try {
			setIsDoingRescue(true);

			const isBnbRescue = token === TOKENS.BNB;
			let tx: ContractTransaction;

			if (isBnbRescue) {
				tx = await tryBNBRescue(key, token);
			} else {
				tx = await tryBUSDRescue(key, token);
			}

			await tx.wait();
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
		if (!dnftContract) throw new Error();

		const [key, token] = params;
		if (!isApproved(allowanceBusdAmount) && token === TOKENS.BUSD) {
			await tryApproveBusd(false);
		}
		return await dnftContract.rescueUsingKey(key, false);
	};

	const tryBNBRescue = async (...params: Parameters<typeof tryRescue>) => {
		if (!dnftContract) throw new Error();

		const rescuePriceBUSD = await fetchRescuePriceBUSD(dnftContract);
		if (!rescuePriceBUSD) {
			throw new Error();
		}

		const rescuePriceBNB = await getBusb2Bnb(
			keyNftContract,
			rescuePriceBUSD.times(1e18)
		);

		if (!rescuePriceBNB) {
			throw new Error();
		}

		const [key, token] = params;
		if (!isApproved(allowanceBusdAmount) && token === TOKENS.BUSD) {
			await tryApproveBusd(false);
		}

		return await dnftContract.rescueUsingKey(key, true, {
			value: rescuePriceBNB?.toString(),
		});
	};

	const reloadData = async () => {
		// dispatch(fetchListPhase({ dnftContract }));
		dispatch(fetchListPhase());
		dispatch(fetchClaimableTime({ dnftContract }));

		dispatch(fetchPriceInBUSD({ dnftContract }));
		dispatch(fetchLaunchPriceInBUSD({ dnftContract }));
		dispatch(fetchPoolRemaining({ dnftContract }));
		dispatch(fetchRate({ dnftContract }));
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
