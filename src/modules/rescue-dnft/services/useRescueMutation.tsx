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
import { fetchListPhase, fetchRate } from 'modules/mintDnft/helpers/fetch';
import {
	fetchLaunchPriceInBUSD,
	fetchListKey,
	fetchPoolRemaining,
	fetchPriceInBUSD,
} from '../helpers/fetch';
import { useAppDispatch, useAppSelector } from 'stores';
import { fetchRescuePriceBUSD } from './api/fetchRescuePrice';
import { getBusb2Bnb } from 'modules/my-profile/services';

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

			const rescuePriceBUSD = await fetchRescuePriceBUSD(dnftContract);
			if (!rescuePriceBUSD) return;

			const rescuePriceBNB = await getBusb2Bnb(
				keyNftContract,
				rescuePriceBUSD.times(1e18)
			);

			if (dnftContract) {
				if (!isApproved(allowanceBusdAmount) && token === TOKENS.BUSD) {
					await tryApproveBusd(false);
				}

				const isBnbRescue = token === TOKENS.BNB;
				const res = await dnftContract.rescueUsingKey(
					key,
					isBnbRescue,
					isBnbRescue
						? {
								value: rescuePriceBNB?.toString(),
						  }
						: undefined
				);

				await res.wait();
				const hash: string = res ? res.hash : '';
				if (hash) {
					message.success(<RescueSuccessToast txHash={hash} />);
				}
			}
		} catch (e) {
			handleWriteMethodError(e);
		} finally {
			reloadData();
			setIsDoingRescue(false);
		}
	};

	const reloadData = async () => {
		dispatch(fetchListPhase({ dnftContract }));

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
