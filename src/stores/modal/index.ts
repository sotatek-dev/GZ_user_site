import { createSlice, PayloadAction, Store } from '@reduxjs/toolkit';

let customStore: Store | undefined;

export const setModalStore = (store: Store) => {
	customStore = store;
};

interface initialStateProps {
	modalConnectWallet: boolean;
}

const initialState: initialStateProps = {
	modalConnectWallet: false,
};

const modalStore = createSlice({
	name: 'modalStore',
	initialState,
	reducers: {
		setStatusModalConnectWallet: (state, action: PayloadAction<any>) => {
			return {
				...state,
				modalConnectWallet: action.payload,
			};
		},
	},
});

export const setStatusModalConnectWallet = (status: boolean) => {
	customStore &&
		customStore.dispatch(
			modalStore.actions.setStatusModalConnectWallet(status)
		);
};

export { modalStore };
