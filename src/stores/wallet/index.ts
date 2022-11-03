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
	network?: INetworkList;
	balance: {
		[key: string]: string;
	};
	wallerConnected: string;
}

const initialState: IWalletState = {
	isNetworkValid: false,
	addressWallet: '',
	isConnect: false,
	network: undefined,
	balance: {
		busdBalance: '0',
		bnbBalance: '0',
	},
	wallerConnected: '',
};

const storeWallet = createSlice({
	name: 'storeWallet',
	initialState,
	reducers: {
		setNetworkValid: (state, action: PayloadAction<boolean>) => ({
			...state,
			isNetworkValid: action.payload,
		}),
		setAddressWallet: (state, action: PayloadAction<string>) => ({
			...state,
			addressWallet: action.payload,
		}),
		setStatusConnect: (state, action: PayloadAction<boolean>) => ({
			...state,
			isConnect: action.payload,
		}),
		setNetworkConnected: (state, action: PayloadAction<INetworkList>) => ({
			...state,
			network: action.payload,
		}),
		setBalance: (state, action: PayloadAction<{ [key: string]: string }>) => ({
			...state,
			balance: action.payload,
		}),
		setWallerConnected: (state, action: PayloadAction<string>) => ({
			...state,
			wallerConnected: action.payload,
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

export const setNetworkConnected = (network: INetworkList) => {
	customStore &&
		customStore.dispatch(storeWallet.actions.setNetworkConnected(network));
};

export const setBalance = (balance: { [key: string]: string }) => {
	customStore && customStore.dispatch(storeWallet.actions.setBalance(balance));
};

export const setWallerConnected = (wallerConnected: string) => {
	customStore &&
		customStore.dispatch(
			storeWallet.actions.setWallerConnected(wallerConnected)
		);
};

export { storeWallet };
