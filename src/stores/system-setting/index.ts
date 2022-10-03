import { createSlice, PayloadAction, Store } from '@reduxjs/toolkit';

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
	},
});

export const dispatchSetSystemSettings = (setting?: ISystemSetting) => {
	customStore &&
		customStore.dispatch(systemSettingStore.actions.setSystemSettings(setting));
};

export const { setSystemSettings } = systemSettingStore.actions;

export { systemSettingStore };
