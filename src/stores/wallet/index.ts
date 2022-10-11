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
	balance: {
		[key: string]: string;
	};
}

const initialState: IWalletState = {
	isNetworkValid: false,
	addressWallet: '',
	isConnect: false,
	network: null,
	balance: {
		busdBalance: '0',
		bnbBalance: '0',
	},
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
		setNetwork: (state, action: PayloadAction<INetworkList | null>) => ({
			...state,
			network: action.payload,
		}),
		setBalance: (state, action: PayloadAction<{ [key: string]: string }>) => ({
			...state,
			balance: action.payload,
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

export const setNetwork = (network: INetworkList | null) => {
	customStore && customStore.dispatch(storeWallet.actions.setNetwork(network));
};

export const setBalance = (balance: { [key: string]: string }) => {
	customStore && customStore.dispatch(storeWallet.actions.setBalance(balance));
};

export { storeWallet };
