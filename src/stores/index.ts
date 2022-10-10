/* eslint-disable @typescript-eslint/no-explicit-any */
import { Store } from '@reduxjs/toolkit';
import { composeWithDevTools } from 'redux-devtools-extension';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { persistStore } from 'redux-persist';
import { RootState } from './types';
import { setStoreWallet, storeWallet } from './wallet';
import { setUserStore, userStore } from './user';
import { modalStore, setModalStore } from './modal';
import {
	setSystemSettingStore,
	systemSettingStore,
} from 'stores/system-setting';
import { myProfileStore } from 'stores/my-profile';
import thunkMiddleware from 'redux-thunk';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { dnftDetailStore } from 'stores/dnft/dnft-detail';
import mintDnftReducer from 'stores/mint-dnft';

let customStore: Store | undefined;

const setStore = (store: Store) => {
	customStore = store;
};

export const getStore = (): Store<RootState> => {
	if (!customStore) {
		throw new Error('Please implement setStore before using this function');
	}
	return customStore;
};

const appReducer = combineReducers({
	wallet: storeWallet.reducer,
	user: userStore.reducer,
	modal: modalStore.reducer,
	systemSetting: systemSettingStore.reducer,
	myProfile: myProfileStore.reducer,
	dnftDetail: dnftDetailStore.reducer,
	mintDnft: mintDnftReducer,
});

const rootReducer = (state: any, action: any) => appReducer(state, action);

const middleWares: any[] = [thunkMiddleware];

const enhancer = composeWithDevTools(applyMiddleware(...middleWares));

export const store = createStore(rootReducer, enhancer);

export const persistor = persistStore(store);

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;

setStore(store);
setStoreWallet(store);
setUserStore(store);
setModalStore(store);
setSystemSettingStore(store);
