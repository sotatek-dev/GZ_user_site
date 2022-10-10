import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import BigNumber from 'bignumber.js';
import {
	fetchLaunchPriceInBUSD,
	fetchListKey,
	fetchPoolRemaining,
	fetchPriceInBUSD,
} from 'modules/rescueDnft/helpers/fetch';

interface InitialState {
	listKey: Array<string>;
	poolRemaining: BigNumber.Value;
	priceInBUSD: BigNumber.Value;
	launchPriceInBUSD: BigNumber.Value;

	isLoadingRescue: boolean;
}

const initialState: InitialState = {
	listKey: [],
	poolRemaining: new BigNumber(0),
	priceInBUSD: new BigNumber(0),
	launchPriceInBUSD: new BigNumber(0),

	isLoadingRescue: false,
};

const rescueDnftSlice = createSlice({
	name: 'rescue-dnft',
	initialState,
	reducers: {
		setIsLoadingRescue: (state, action: PayloadAction<boolean>) => {
			state.isLoadingRescue = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(fetchListKey.fulfilled, (state, action) => {
			state.listKey = action.payload;
		});
		builder.addCase(fetchListKey.rejected, (state) => {
			state.listKey = initialState.listKey;
			// e = action.payload
		});

		builder.addCase(fetchPoolRemaining.fulfilled, (state, action) => {
			state.poolRemaining = action.payload;
		});
		builder.addCase(fetchPoolRemaining.rejected, (state) => {
			state.poolRemaining = initialState.poolRemaining;
			// e = action.payload
		});

		builder.addCase(fetchPriceInBUSD.fulfilled, (state, action) => {
			state.priceInBUSD = action.payload;
		});
		builder.addCase(fetchPriceInBUSD.rejected, (state) => {
			state.priceInBUSD = initialState.poolRemaining;
			// e = action.payload
		});

		builder.addCase(fetchLaunchPriceInBUSD.fulfilled, (state, action) => {
			state.launchPriceInBUSD = action.payload;
		});
		builder.addCase(fetchLaunchPriceInBUSD.rejected, (state) => {
			state.launchPriceInBUSD = initialState.poolRemaining;
			// e = action.payload
		});
	},
});

export const { setIsLoadingRescue } = rescueDnftSlice.actions;

const { reducer: rescueDnftReducer } = rescueDnftSlice;

export default rescueDnftReducer;
