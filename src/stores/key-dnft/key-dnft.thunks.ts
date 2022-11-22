import { createAsyncThunk } from '@reduxjs/toolkit';
import type { AbiKeynft } from 'web3/abis/types';

export const fetchStartBuyKeyTime = createAsyncThunk<number, AbiKeynft>(
	'keyDnft/fetchStartBuyKeyTime',
	async (keyNftContract, { rejectWithValue }) => {
		try {
			const startBuyKeyTime = await keyNftContract.buyTime();

			return startBuyKeyTime.toNumber();
		} catch (error) {
			return rejectWithValue(error);
		}
	}
);

export const fetchMinDnftToBuyKey = createAsyncThunk<number, AbiKeynft>(
	'keyDnft/fetchMinDnftToBuyKey',
	async (keyNftContract, { rejectWithValue }) => {
		try {
			const minDnftRequired = await keyNftContract.minimumDNFTTokenRequire();

			return minDnftRequired.toNumber();
		} catch (error) {
			return rejectWithValue(error);
		}
	}
);

export const fetchKeyBalance = createAsyncThunk<
	number,
	{ keyNftContract: AbiKeynft; account: string }
>(
	'keyDnft/fetchKeyBalance',
	async ({ keyNftContract, account }, { rejectWithValue }) => {
		try {
			const keyBalance = await keyNftContract.balanceOf(account);
			return keyBalance.toNumber();
		} catch (error) {
			return rejectWithValue(error);
		}
	}
);
