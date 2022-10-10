import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
	IPhaseStatistic,
	ITimelineMintNftState,
} from 'modules/mintDnft/interfaces';
import { MINT_PHASE, MINT_PHASE_ID } from 'modules/mintDnft/constants';
import {
	fetchIsWhitelisted,
	fetchListPhase,
	fetchMinimumGXZBalanceRequired,
	fetchRate,
} from 'modules/mintDnft/helpers/fetch';
import { now } from 'common/constants/constants';
import { convertTimelineMintNft } from 'common/utils/functions';
import BigNumber from 'bignumber.js';

interface InitialState {
	listPhase: Array<IPhaseStatistic>;
	runningPhaseId: MINT_PHASE_ID | number;
	runningPhase?: IPhaseStatistic;
	upcomingPhase?: IPhaseStatistic;
	publicPhase?: IPhaseStatistic;
	timelineMintNft: Array<ITimelineMintNftState>;

	rate: BigNumber.Value;
	isWhitelisted: boolean;
	minimumGXZBalanceRequired: BigNumber.Value;

	isLoadingMint: boolean;
}

const initialState: InitialState = {
	listPhase: [],
	runningPhaseId: 0,
	timelineMintNft: [],

	rate: new BigNumber(1),
	isWhitelisted: false,
	minimumGXZBalanceRequired: new BigNumber(0),

	isLoadingMint: false,
};

const mintDnftSlice = createSlice({
	name: 'mint-dnft',
	initialState,
	reducers: {
		setIsLoadingMint: (state, action: PayloadAction<boolean>) => {
			state.isLoadingMint = action.payload;
		},
	},
	extraReducers(builder) {
		builder.addCase(fetchListPhase.fulfilled, (state, action) => {
			const { runningPhaseId, listPhase } = action.payload;
			state.listPhase = listPhase;
			state.runningPhaseId = runningPhaseId;

			// get phase detail
			state.runningPhase = listPhase.find((item: IPhaseStatistic) => {
				return (
					item.id === runningPhaseId &&
					item.startTime < now() &&
					item.endTime > now()
				);
			});
			state.upcomingPhase = listPhase.find((item) => {
				return item.id === runningPhaseId && item.startTime > now();
			});
			state.publicPhase = listPhase.find((item: IPhaseStatistic) => {
				return item.type === MINT_PHASE.PUBLIC;
			});

			// timeline
			if (listPhase.length) {
				state.timelineMintNft = convertTimelineMintNft(listPhase);
			}
		});
		// builder.addCase(fetchListPhase.pending, (state, action) => {});
		builder.addCase(fetchListPhase.rejected, (state) => {
			state.listPhase = initialState.listPhase;
			state.runningPhaseId = initialState.runningPhaseId;
			state.timelineMintNft = initialState.timelineMintNft;
			state.rate = initialState.rate;
			state.isWhitelisted = initialState.isWhitelisted;
			// e = action.payload
		});

		builder.addCase(fetchRate.fulfilled, (state, action) => {
			state.rate = action.payload;
		});
		builder.addCase(fetchRate.rejected, (state) => {
			state.rate = initialState.rate;
			// e = action.payload
		});

		builder.addCase(fetchIsWhitelisted.fulfilled, (state, action) => {
			state.isWhitelisted = action.payload;
		});
		builder.addCase(fetchIsWhitelisted.rejected, (state) => {
			state.isWhitelisted = initialState.isWhitelisted;
			// e = action.payload
		});

		builder.addCase(
			fetchMinimumGXZBalanceRequired.fulfilled,
			(state, action) => {
				state.minimumGXZBalanceRequired = action.payload;
			}
		);
		builder.addCase(fetchMinimumGXZBalanceRequired.rejected, (state) => {
			state.minimumGXZBalanceRequired = initialState.rate;
			// e = action.payload
		});
	},
});

export const { setIsLoadingMint } = mintDnftSlice.actions;

const { reducer: mintDnftReducer } = mintDnftSlice;

export default mintDnftReducer;
