import { createSlice } from '@reduxjs/toolkit';
import { fetchStartBuyKeyTime } from './key-dnft.thunks';

type RequestState = 'idle' | 'pending' | 'succeeded' | 'failed';

interface State {
	startBuyKeyTime: number | undefined;
	loading: RequestState;
	error: unknown | undefined;
}

const initialState: State = {
	startBuyKeyTime: undefined,
	loading: 'idle',
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
	},
});

const { reducer: keyDnftReducer } = keyDnftSlice;

export default keyDnftReducer;
