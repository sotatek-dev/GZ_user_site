import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getDNFTDetail } from 'apis/dnft';
import { get } from 'lodash';
import { IDNFT } from 'modules/my-profile/interfaces';

interface initialStateProps {
	dnftDetail?: IDNFT;
	loading: boolean;
	errMessage?: string;
	relatedDNFTs?: IDNFT[];
}

const initialState: initialStateProps = {
	loading: false,
};

const dnftDetailStore = createSlice({
	name: 'dnftDetail',
	initialState,
	reducers: {},
	extraReducers(builder) {
		builder.addCase(getDNFTDetailRD.fulfilled, (state, action) => {
			state.dnftDetail = action.payload.nftDetail;
			state.relatedDNFTs = action.payload.relatedDNFTs;
			state.loading = false;
		});

		builder.addCase(getDNFTDetailRD.rejected, (state, action) => {
			state.errMessage = action.error.message;
			state.loading = false;
		});

		builder.addCase(getDNFTDetailRD.pending, (state) => {
			state.loading = true;
		});
	},
});

export const getDNFTDetailRD = createAsyncThunk(
	'profile/getDNFTDetailRD',
	async (_id: string, { rejectWithValue }) => {
		try {
			const res = await getDNFTDetail(_id);
			const data = get(res, 'data.data', []);
			const relatedDNFTs = get(data, 'ingredients');

			return {
				relatedDNFTs,
				nftDetail: data,
			};
		} catch (err) {
			return rejectWithValue(err);
		}
	}
);

export { dnftDetailStore };
