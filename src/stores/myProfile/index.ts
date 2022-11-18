import {
	createAsyncThunk,
	createSlice,
	PayloadAction,
	Store,
} from '@reduxjs/toolkit';
import { getMyDNFTs, getMyProfile, IParamsGetDNFTs } from 'apis/myProfile';
import { get } from 'lodash';
import { IDNFT } from 'modules/my-profile/interfaces';
import { getBusb2Bnb, getKeyPriceBusd } from 'modules/my-profile/services/apis';
import {
	setSystemSettings,
	setBusd2BnbRate,
	setKeyPriceBusd,
} from 'stores/systemSetting';
import { AbiKeynft, AbiPresalepool } from 'web3/abis/types';

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

	dnfts?: {
		data: IDNFT[];
		pagination: {
			total: number;
			page: number;
			limit: number;
		};
	};
	dnft_claimable_count: number;
	dnft_holding_count: number;
}

const initialState: initialStateProps = {
	loading: true,
	dnft_claimable_count: 0,
	dnft_holding_count: 0,
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
		setDNFTsCount: (state, action: PayloadAction<number>) => {
			return {
				...state,
				dnft_holding_count: action.payload,
			};
		},
		cleanDNFTs: (state) => {
			return {
				...state,
				dnfts: undefined,
				dnft_claimable_count: 0,
				dnft_holding_count: 0,
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
			state.dnfts = {
				data: action.payload.list,
				pagination: action.payload.pagination,
			};
			state.loading = false;
		});

		builder.addCase(getMyDNFTsRD.rejected, (state, action) => {
			state.errMessage = action.error.message;
			state.loading = false;
		});

		builder.addCase(getMyDNFTsRD.pending, (state) => {
			state.loading = true;
		});

		builder.addCase(getMyClaimableDNFTsCountRD.fulfilled, (state, action) => {
			state.dnft_claimable_count = action.payload;
		});
	},
});

export const getMyDNFTsRD = createAsyncThunk(
	'profile/getMyDNFTsRD',
	async (params: IParamsGetDNFTs, { rejectWithValue }) => {
		try {
			const res = await getMyDNFTs(params);
			const data = get(res, 'data.data', []);
			return data;
		} catch (err) {
			return rejectWithValue(err);
		}
	}
);

export const getMyClaimableDNFTsCountRD = createAsyncThunk(
	'profile/getMyClaimableDNFTsCountRD',
	async (limit: number, { rejectWithValue }) => {
		try {
			const res = await getMyDNFTs({
				limit,
				status: 'wait-to-claim',
				page: 1,
			});
			const data = get(res, 'data.data.list', []);
			return get(data, 'length');
		} catch (err) {
			return rejectWithValue(err);
		}
	}
);

export const getMyProfileRD = createAsyncThunk(
	'profile/getMyProfile',
	async (
		{
			keyNftContract,
			presalePoolContract,
		}: {
			presalePoolContract: AbiPresalepool | null;
			keyNftContract: AbiKeynft | null;
		},
		{ rejectWithValue, dispatch }
	) => {
		try {
			const [profileRes, rate, keyPrice] = await Promise.all([
				getMyProfile(),
				getBusb2Bnb(presalePoolContract, 1e18),
				getKeyPriceBusd(keyNftContract),
			]);

			const data = get(profileRes, 'data.data', {});
			dispatch(setSystemSettings(data.system_setting));
			dispatch(setBusd2BnbRate(rate?.div(1e18) ?? undefined));
			dispatch(setKeyPriceBusd(keyPrice ?? undefined));
			return data;
		} catch (error) {
			return rejectWithValue(error);
		}
	}
);

export const {
	setUserInfo,
	setErrMessage,
	setLoading,
	setDNFTsCount,
	cleanDNFTs,
} = myProfileStore.actions;

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
