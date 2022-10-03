import {
	createAsyncThunk,
	createSlice,
	PayloadAction,
	Store,
} from '@reduxjs/toolkit';
import { getMyDNFTs, getMyProfile, IParamsGetDNFTs } from 'apis/my-profile';
import { get } from 'lodash';
import { IDNFT } from 'modules/my-profile/interfaces';
import { setSystemSettings } from 'stores/system-setting';

let customStore: Store | undefined;

export const setMyProfileStore = (store: Store) => {
	customStore = store;
};

export interface ITypeUserInfo {
	wallet_address: string;
	firstname: string;
	lastname: string;
	email: string;
	role: string;
	status: string;
	key_holding: boolean;
	key_holding_count: number;
	nft_holding: number;
}

interface initialStateProps {
	userInfo?: ITypeUserInfo;
	errMessage?: string;
	loading: boolean;

	dnfts?: IDNFT[];
}

const initialState: initialStateProps = {
	loading: false,
};

const myProfileStore = createSlice({
	name: 'myProfile',
	initialState,
	reducers: {
		setUserInfo: (state, action: PayloadAction<ITypeUserInfo | undefined>) => {
			return {
				...state,
				userInfo: action.payload,
			};
		},
		setErrMessage: (state, action: PayloadAction<string | undefined>) => {
			return {
				...state,
				errMessage: action.payload,
			};
		},

		setLoading: (state, action: PayloadAction<boolean>) => {
			return {
				...state,
				loading: action.payload,
			};
		},
	},
	extraReducers(builder) {
		builder.addCase(getMyProfileRD.fulfilled, (state, action) => {
			state.userInfo = action.payload.profile;
			state.loading = false;
		});

		builder.addCase(getMyProfileRD.rejected, (state, action) => {
			state.errMessage = action.error.message;
			state.loading = false;
		});

		builder.addCase(getMyProfileRD.pending, (state) => {
			state.loading = true;
		});

		builder.addCase(getMyDNFTsRD.fulfilled, (state, action) => {
			const _myDNFTs: IDNFT[] = action.payload.map((item: any) => {
				if (!item.metadata) {
					item.metadata = {
						species: 'TBA',
						rankLevel: 'TBA',
					};
				}
				return item;
			});
			state.dnfts = _myDNFTs;
			state.loading = false;
		});

		builder.addCase(getMyDNFTsRD.rejected, (state, action) => {
			state.errMessage = action.error.message;
			state.loading = false;
		});

		builder.addCase(getMyDNFTsRD.pending, (state) => {
			state.loading = true;
		});
	},
});

export const getMyDNFTsRD = createAsyncThunk(
	'profile/getMyDNFTsRD',
	async (params: IParamsGetDNFTs, { rejectWithValue }) => {
		try {
			const res = await getMyDNFTs(params);
			const data = get(res, 'data.data.list', []);
			return data;
		} catch (err) {
			return rejectWithValue(err);
		}
	}
);

export const getMyProfileRD = createAsyncThunk(
	'profile/getMyProfile',
	async (_, { rejectWithValue, dispatch }) => {
		try {
			const response = await getMyProfile();
			const data = get(response, 'data.data', {});
			dispatch(setSystemSettings(data.system_setting));
			return data;
		} catch (error: any) {
			return rejectWithValue(error);
		}
	}
);

export const { setUserInfo, setErrMessage, setLoading } =
	myProfileStore.actions;

export const setUserInfoRD = (userInfo?: ITypeUserInfo) => {
	customStore &&
		customStore.dispatch(myProfileStore.actions.setUserInfo(userInfo));
};

export const setErrMessageRD = (message?: string) => {
	customStore &&
		customStore.dispatch(myProfileStore.actions.setErrMessage(message));
};

export const setLoadingRD = (loading: boolean) => {
	customStore &&
		customStore.dispatch(myProfileStore.actions.setLoading(loading));
};

export { myProfileStore };
