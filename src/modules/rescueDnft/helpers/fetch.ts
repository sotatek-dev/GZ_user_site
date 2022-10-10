import { AbiDnft, AbiKeynft } from 'web3/abis/types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import BigNumber from 'bignumber.js';
import { now, second } from 'common/constants/constants';
import { TOKEN_DECIMAL } from 'modules/mintDnft/constants';

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
						if (new BigNumber(nextTimeUsingKey._hex).times(second).lt(now())) {
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
export const fetchPoolRemaining = createAsyncThunk(
	'rescueDnft/fetchPoolRemaining',
	async (params: FetchPoolRemainingParams, { rejectWithValue }) => {
		const { dnftContract } = params;

		try {
			if (dnftContract) {
				const unSoldTokenOfAllPhase =
					await dnftContract.getUnSoldTokenOfAllPhase();
				const totalRescued = await dnftContract.totalRescued();
				const theRest = new BigNumber(unSoldTokenOfAllPhase._hex).minus(
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
