import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
	IPhaseStatistic,
	ITimelineMintNftState,
} from 'modules/mintDnft/interfaces';
import { MINT_PHASE, MINT_PHASE_ID } from 'modules/mintDnft/constants';
import {
	fetchClaimableTime,
	fetchIsWhitelisted,
	fetchListPhase,
	fetchMinimumGXZBalanceRequired,
	fetchRate,
	fetchUserBoughtAmount,
} from 'modules/mintDnft/helpers/fetch';
import { now } from 'common/constants/constants';
import { convertTimelineMintNft } from 'common/utils/functions';
import BigNumber from 'bignumber.js';
import { handleCallMethodError } from 'common/helpers/handleError';

interface InitialState {
	listPhase: Array<IPhaseStatistic>;
	runningPhaseId: MINT_PHASE_ID | number;
	runningPhase?: IPhaseStatistic;
	upcomingPhase?: IPhaseStatistic;
	publicPhase?: IPhaseStatistic;
	timelineMintNft: Array<ITimelineMintNftState>;

	userBoughtAmount: BigNumber.Value;
	rate: BigNumber.Value;
	isWhitelisted: boolean;
	minimumGXZBalanceRequired: BigNumber.Value;

	isLoadingMint: boolean;

	claimableTime: BigNumber.Value;
}

const initialState: InitialState = {
	listPhase: [],
	runningPhaseId: 0,
	timelineMintNft: [],

	userBoughtAmount: new BigNumber(0),
	rate: new BigNumber(1),
	isWhitelisted: false,
	minimumGXZBalanceRequired: new BigNumber(0),

	isLoadingMint: false,

	claimableTime: Number.MAX_SAFE_INTEGER,
};

const mintDnftSlice = createSlice({
	name: 'mint-dnft',
	initialState,
	reducers: {
		setIsLoadingMint: (state, action: PayloadAction<boolean>) => {
			state.isLoadingMint = action.payload;
		},
	},
	extraReducers: (builder) => {
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
				// return item.type === MINT_PHASE.PUBLIC;
				//	CR: the last phase is presale 2
				return item.type === MINT_PHASE.PRESALE_2;
			});

			// timeline
			if (listPhase.length) {
				state.timelineMintNft = convertTimelineMintNft(listPhase);
			}
		});
		// builder.addCase(fetchListPhase.pending, (state, action) => {});
		builder.addCase(fetchListPhase.rejected, (state, action) => {
			state.listPhase = initialState.listPhase;
			state.runningPhaseId = initialState.runningPhaseId;
			state.timelineMintNft = initialState.timelineMintNft;
			state.rate = initialState.rate;
			state.isWhitelisted = initialState.isWhitelisted;

			handleCallMethodError(action.payload);
		});

		builder.addCase(fetchUserBoughtAmount.fulfilled, (state, action) => {
			state.userBoughtAmount = action.payload;
		});
		builder.addCase(fetchUserBoughtAmount.rejected, (state, action) => {
			state.userBoughtAmount = initialState.userBoughtAmount;
			handleCallMethodError(action.payload);
		});

		builder.addCase(fetchRate.fulfilled, (state, action) => {
			state.rate = action.payload;
		});
		builder.addCase(fetchRate.rejected, (state, action) => {
			state.rate = initialState.rate;
			handleCallMethodError(action.payload);
		});

		builder.addCase(fetchIsWhitelisted.fulfilled, (state, action) => {
			state.isWhitelisted = action.payload;
		});
		builder.addCase(fetchIsWhitelisted.rejected, (state, action) => {
			state.isWhitelisted = initialState.isWhitelisted;
			handleCallMethodError(action.payload);
		});

		builder.addCase(
			fetchMinimumGXZBalanceRequired.fulfilled,
			(state, action) => {
				state.minimumGXZBalanceRequired = action.payload;
			}
		);
		builder.addCase(
			fetchMinimumGXZBalanceRequired.rejected,
			(state, action) => {
				state.minimumGXZBalanceRequired = initialState.rate;
				handleCallMethodError(action.payload);
			}
		);

		builder.addCase(fetchClaimableTime.fulfilled, (state, action) => {
			state.claimableTime = action.payload;
		});
		builder.addCase(fetchClaimableTime.rejected, (state, action) => {
			state.claimableTime = initialState.claimableTime;
			handleCallMethodError(action.payload);
		});
	},
});

export const { setIsLoadingMint } = mintDnftSlice.actions;

const { reducer: mintDnftReducer } = mintDnftSlice;

export default mintDnftReducer;
