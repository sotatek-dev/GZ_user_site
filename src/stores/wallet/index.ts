import { createSlice, PayloadAction, Store } from '@reduxjs/toolkit';

let customStore: Store | undefined;
export const setStoreWallet = (store: Store) => {
	customStore = store;
};

interface IWalletTpye {
	isNetworkValid: boolean;
	addressWallet: string;
}

const initialState: IWalletTpye = {
	isNetworkValid: false,
	addressWallet: '',
};

const storeWallet = createSlice({
	name: 'storeWallet',
	initialState,
	reducers: {
		setNetworkValid: (state, action: PayloadAction<any>) => ({
			...state,
			isNetworkValid: action.payload.isNetworkValid,
		}),
		setAddressWallet: (state, action: PayloadAction<any>) => ({
			...state,
			addressWallet: action.payload.addressWallet,
		}),
	},
});

export const setNetworkValid = (isNetworkValid: boolean) => {
	customStore &&
		customStore.dispatch(storeWallet.actions.setNetworkValid(isNetworkValid));
};

export const setAddressWallet = (addressWallet: string) => {
	customStore &&
		customStore.dispatch(storeWallet.actions.setAddressWallet(addressWallet));
};

export { storeWallet };
