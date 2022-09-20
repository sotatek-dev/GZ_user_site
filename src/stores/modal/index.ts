import { createSlice, PayloadAction, Store } from '@reduxjs/toolkit';
import { STEP_MODAL_CONNECTWALLET } from 'common/constants/constants';

let customStore: Store | undefined;

export const setModalStore = (store: Store) => {
	customStore = store;
};

export interface IModalStates {
	modalConnectWallet: boolean;
	stepModalConnectWallet: string;
}

const initialState: IModalStates = {
	modalConnectWallet: false,
	stepModalConnectWallet: STEP_MODAL_CONNECTWALLET.SELECT_NETWORK_AND_WALLET,
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

		setStepModalConnectWallet: (state, action: PayloadAction<any>) => {
			return {
				...state,
				stepModalConnectWallet: action.payload,
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

export const setStepModalConnectWallet = (step: string) => {
	customStore &&
		customStore.dispatch(modalStore.actions.setStepModalConnectWallet(step));
};

export { modalStore };
