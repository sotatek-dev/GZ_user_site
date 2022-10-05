import { createSlice, PayloadAction, Store } from '@reduxjs/toolkit';
import BigNumber from 'bignumber.js';

let customStore: Store | undefined;

export const setSystemSettingStore = (store: Store) => {
	customStore = store;
};

export interface ISystemSetting {
	key_price: number;
	rescure_price: number;
	treasury_address: string;
	mint_days: number;
}
interface initialStateProps {
	systemSetting?: ISystemSetting;
	busd2Bnb?: BigNumber;
}

const initialState: initialStateProps = {};
const systemSettingStore = createSlice({
	name: 'systemSetting',
	initialState,
	reducers: {
		setSystemSettings: (
			state,
			action: PayloadAction<ISystemSetting | undefined>
		) => {
			return {
				...state,
				systemSetting: action.payload,
			};
		},
		setBusd2BnbRate: (state, action: PayloadAction<BigNumber | undefined>) => {
			return {
				...state,
				busd2Bnb: action.payload,
			};
		},
	},
});

export const dispatchSetSystemSettings = (setting?: ISystemSetting) => {
	customStore &&
		customStore.dispatch(systemSettingStore.actions.setSystemSettings(setting));
};

export const { setSystemSettings, setBusd2BnbRate } =
	systemSettingStore.actions;

export { systemSettingStore };
