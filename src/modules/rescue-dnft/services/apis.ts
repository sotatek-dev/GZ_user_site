import { createAsyncThunk } from '@reduxjs/toolkit';
import BigNumber from 'bignumber.js';
import { second } from 'common/constants/constants';
import dayjs from 'dayjs';
import { formatEther } from 'ethers/lib/utils';
import { TOKEN_DECIMAL } from 'modules/mint-dnft/constants';
import { AbiDnft, AbiKeynft } from 'web3/abis/types';

interface FetchListKeyParams {
	dnftContract?: AbiDnft | null;
	keyNftContract?: AbiKeynft | null;
	walletAddress: string;
}
export const fetchListKey = createAsyncThunk(
	'rescueDnft/fetchKeyList',
	async (params: FetchListKeyParams, { rejectWithValue }) => {
		const { dnftContract, keyNftContract, walletAddress } = params;

		try {
			if (dnftContract && keyNftContract && walletAddress) {
				const res =
					(await keyNftContract.getAllTokenIdsOfAddress(walletAddress)) || [];
				const allKeys = res.map((item) => {
					return new BigNumber(item._hex).toString(10);
				});
				const usableKeys: Array<string> = [];
				await Promise.all(
					allKeys.map(async (item) => {
						const nextTimeUsingKey = await dnftContract.nextTimeUsingKey(item);
						if (
							new BigNumber(nextTimeUsingKey._hex)
								.times(second)
								.lt(dayjs().unix())
						) {
							usableKeys.push(item);
						}
					})
				);
				return usableKeys;
			}
			return [];
		} catch (e) {
			return rejectWithValue(e);
		}
	}
);

interface FetchPoolRemainingParams {
	dnftContract?: AbiDnft | null;
}

const PERCENT_TOKEN_LEFT_TO_RESCUE = 1 / 2; // 50%

export const fetchPoolRemaining = createAsyncThunk(
	'rescueDnft/fetchPoolRemaining',
	async (params: FetchPoolRemainingParams, { rejectWithValue }) => {
		const { dnftContract } = params;

		try {
			if (dnftContract) {
				const unSoldTokenOfAllPhase =
					await dnftContract.getNumberOfTokenInCosmicVoid();
				const numberOfTokenInCosmicVoid = new BigNumber(
					unSoldTokenOfAllPhase._hex
				).times(PERCENT_TOKEN_LEFT_TO_RESCUE);
				const totalRescued = await dnftContract.totalUserRescued();
				const theRest = new BigNumber(numberOfTokenInCosmicVoid).minus(
					totalRescued._hex
				);
				return theRest;
			}
			return new BigNumber(0);
		} catch (e) {
			return rejectWithValue(e);
		}
	}
);

interface FetchLaunchPriceInBUSDParams {
	dnftContract?: AbiDnft | null;
}
export const fetchLaunchPriceInBUSD = createAsyncThunk(
	'rescueDnft/fetchLaunchPriceInBUSD',
	async (params: FetchLaunchPriceInBUSDParams, { rejectWithValue }) => {
		const { dnftContract } = params;

		try {
			if (dnftContract) {
				const res = await dnftContract.launchPrice();
				return new BigNumber(res._hex).div(TOKEN_DECIMAL);
			}
			return new BigNumber(0);
		} catch (e) {
			return rejectWithValue(e);
		}
	}
);

interface FetchPriceInBUSDParams {
	dnftContract?: AbiDnft | null;
}
export const fetchPriceInBUSD = createAsyncThunk(
	'rescueDnft/fetchPriceInBUSD',
	async (params: FetchPriceInBUSDParams, { rejectWithValue }) => {
		const { dnftContract } = params;

		try {
			if (dnftContract) {
				const res = await dnftContract.rescuePrice();
				return new BigNumber(res._hex).div(TOKEN_DECIMAL);
			}
			return new BigNumber(0);
		} catch (e) {
			return rejectWithValue(e);
		}
	}
);

export const fetchRescuePriceBUSD = async (dKeyNFTContract: AbiDnft | null) => {
	if (!dKeyNFTContract) {
		return null;
	}

	const busdAmount = await dKeyNFTContract.rescuePrice();
	return new BigNumber(formatEther(busdAmount));
};
