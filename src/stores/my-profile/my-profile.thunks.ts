import { createAsyncThunk } from '@reduxjs/toolkit';
import type { AbiDnft } from 'web3/abis/types';

export const fetchDnftHolding = createAsyncThunk<
	number,
	{ dnftContract: AbiDnft; account: string }
>(
	'myProfile/fetchDnftHolding',
	async ({ dnftContract, account }, { rejectWithValue }) => {
		try {
			const balance = await dnftContract.balanceOf(account);
			return balance.toNumber();
		} catch (error) {
			return rejectWithValue(error);
		}
	}
);
