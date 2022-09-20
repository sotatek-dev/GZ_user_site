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
}

export const initialState: IUserStates = {
	userInfo: {
		walletAddress: '',
	},
	isLogin: false,
};

const userStore = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUserInfo: (state, action: PayloadAction<any>) => {
			return {
				...state,
				userInfo: action.payload,
			};
		},
		setLogin: (state, action: PayloadAction<any>) => {
			return {
				...state,
				isLogin: action.payload,
			};
		},
	},
});

export const setUserInfo = (userInfo: any) => {
	customStore && customStore.dispatch(userStore.actions.setUserInfo(userInfo));
};

export const setLogin = (isLogin: boolean) => {
	customStore && customStore.dispatch(userStore.actions.setLogin(isLogin));
};

export { userStore };
