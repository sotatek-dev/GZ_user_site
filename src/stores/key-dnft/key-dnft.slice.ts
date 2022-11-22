import { createSlice } from '@reduxjs/toolkit';
import {
	fetchKeyBalance,
	fetchMinDnftToBuyKey,
	fetchStartBuyKeyTime,
} from './key-dnft.thunks';

type RequestState = 'idle' | 'pending' | 'succeeded' | 'failed';

interface State {
	startBuyKeyTime: number | undefined;
	loading: RequestState;
	minDnftToBuyKey: number | undefined;
	isLoadingMinDnftToBuyKey: boolean;
	keyBalance: number | undefined;
	isLoadKeyBalance: boolean;
	error: unknown | undefined;
}

const initialState: State = {
	startBuyKeyTime: undefined,
	loading: 'idle',
	minDnftToBuyKey: undefined,
	isLoadingMinDnftToBuyKey: false,
	keyBalance: undefined,
	isLoadKeyBalance: false,
	error: undefined,
};

const keyDnftSlice = createSlice({
	name: 'keyDnft',
	initialState,
	reducers: {},
	extraReducers(builder) {
		builder.addCase(fetchStartBuyKeyTime.fulfilled, (state, action) => {
			state.startBuyKeyTime = action.payload;
			state.loading = 'succeeded';
		});
		builder.addCase(fetchStartBuyKeyTime.rejected, (state, action) => {
			state.error = action.error;
			state.loading = 'failed';
		});
		builder.addCase(fetchStartBuyKeyTime.pending, (state) => {
			state.loading = 'pending';
		});

		builder.addCase(fetchMinDnftToBuyKey.fulfilled, (state, action) => {
			state.minDnftToBuyKey = action.payload;
			state.isLoadingMinDnftToBuyKey = false;
		});
		builder.addCase(fetchMinDnftToBuyKey.rejected, (state) => {
			state.isLoadingMinDnftToBuyKey = false;
		});
		builder.addCase(fetchMinDnftToBuyKey.pending, (state) => {
			state.isLoadingMinDnftToBuyKey = true;
		});

		builder.addCase(fetchKeyBalance.fulfilled, (state, action) => {
			state.keyBalance = action.payload;
			state.isLoadKeyBalance = false;
		});
		builder.addCase(fetchKeyBalance.rejected, (state) => {
			state.isLoadKeyBalance = false;
		});
		builder.addCase(fetchKeyBalance.pending, (state) => {
			state.isLoadKeyBalance = true;
		});
	},
});

const { reducer: keyDnftReducer } = keyDnftSlice;

export default keyDnftReducer;
