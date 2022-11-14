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
