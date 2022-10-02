import { createSlice, PayloadAction, Store } from '@reduxjs/toolkit';

let customStore: Store | undefined;

export const setUserStore = (store: Store) => {
	customStore = store;
};

interface ITypeUserInfo {
	walletAddress: string;
}

interface IUserStates {
	userInfo: ITypeUserInfo;
	isLogin: boolean;
	accessToken: string;
}

export const initialState: IUserStates = {
	userInfo: {
		walletAddress: '',
	},
	isLogin: false,
	accessToken: '',
};

const userStore = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUserInfo: (state, action: PayloadAction<ITypeUserInfo>) => {
			return {
				...state,
				userInfo: action.payload,
			};
		},
		setLogin: (state, action: PayloadAction<boolean>) => {
			return {
				...state,
				isLogin: action.payload,
			};
		},
		setAccessToken: (state, action: PayloadAction<string>) => {
			return {
				...state,
				accessToken: action.payload,
			};
		},
	},
});

export const setUserInfo = (userInfo: ITypeUserInfo) => {
	customStore && customStore.dispatch(userStore.actions.setUserInfo(userInfo));
};

export const setLogin = (isLogin: boolean) => {
	customStore && customStore.dispatch(userStore.actions.setLogin(isLogin));
};

export const setAccessToken = (accessToken: string) => {
	customStore &&
		customStore.dispatch(userStore.actions.setAccessToken(accessToken));
};

export { userStore };
