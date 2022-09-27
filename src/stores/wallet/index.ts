import { createSlice, PayloadAction, Store } from '@reduxjs/toolkit';
import { INetworkList } from 'web3/constants/networks';

let customStore: Store | undefined;
export const setStoreWallet = (store: Store) => {
	customStore = store;
};

interface IWalletState {
	isNetworkValid: boolean;
	addressWallet: string;
	isConnect: boolean;
	network: INetworkList | null;
}

const initialState: IWalletState = {
	isNetworkValid: false,
	addressWallet: '',
	isConnect: false,
	network: null,
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
			addressWallet: action.payload,
		}),
		setStatusConnect: (state, action: PayloadAction<any>) => ({
			...state,
			isConnect: action.payload,
		}),
		setNetwork: (state, action: PayloadAction<any>) => ({
			...state,
			isConnect: action.payload,
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

export const setStatusConnect = (isConnect: boolean) => {
	customStore &&
		customStore.dispatch(storeWallet.actions.setStatusConnect(isConnect));
};

export const setNetwork = (network: object) => {
	customStore && customStore.dispatch(storeWallet.actions.setNetwork(network));
};

export { storeWallet };
