import {
	createAsyncThunk,
	createSlice,
	PayloadAction,
	Store,
} from '@reduxjs/toolkit';
import { getMyDNFTs, getMyProfile, IParamsGetDNFTs } from 'apis/myProfile';
import dayjs from 'dayjs';
import { get } from 'lodash';
import { IDNFT } from 'modules/my-profile/interfaces';
import { getBusb2Bnb, getKeyPriceBusd } from 'modules/my-profile/services/apis';
import {
	setSystemSettings,
	setBusd2BnbRate,
	setKeyPriceBusd,
} from 'stores/systemSetting';
import { AbiKeynft, AbiPresalepool } from 'web3/abis/types';
import { fetchDnftHolding } from './my-profile.thunks';

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

interface FetchDNFTResponse {
	list: IDNFT[];
	pagination: {
		total: number;
		page: number;
		limit: number;
	};
}

interface initialStateProps {
	userInfo?: ITypeUserInfo;
	errMessage?: string;
	loading: boolean;

	dnfts: FetchDNFTResponse | undefined;
	lastUpdated: number;

	claimableDnfts: FetchDNFTResponse | undefined;
	isFetchClaimableDnfts: boolean;
	dnft_holding_count: number | undefined;
}

const initialState: initialStateProps = {
	loading: false,
	dnfts: undefined,
	lastUpdated: dayjs().unix(),
	claimableDnfts: undefined,
	isFetchClaimableDnfts: false,
	dnft_holding_count: undefined,
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
			state.dnfts = action.payload;
			state.loading = false;
			state.lastUpdated = dayjs().unix();
		});

		builder.addCase(getMyDNFTsRD.rejected, (state, action) => {
			state.errMessage = action.error.message;
			state.loading = false;
		});

		builder.addCase(getMyDNFTsRD.pending, (state) => {
			state.loading = true;
		});

		builder.addCase(getMyClaimableDNFTsCountRD.pending, (state) => {
			state.isFetchClaimableDnfts = true;
		});
		builder.addCase(getMyClaimableDNFTsCountRD.rejected, (state) => {
			state.isFetchClaimableDnfts = false;
		});
		builder.addCase(getMyClaimableDNFTsCountRD.fulfilled, (state, action) => {
			state.claimableDnfts = action.payload;
			state.isFetchClaimableDnfts = false;
		});

		builder.addCase(fetchDnftHolding.rejected, (state) => {
			state.loading = false;
		});
		builder.addCase(fetchDnftHolding.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(fetchDnftHolding.fulfilled, (state, action) => {
			state.dnft_holding_count = action.payload;
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
	async (_, { rejectWithValue }) => {
		try {
			const res = await getMyDNFTs({
				status: 'wait-to-claim',
			});
			return get(res, 'data.data');
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

export const { setUserInfo, setErrMessage, setLoading, cleanDNFTs } =
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
