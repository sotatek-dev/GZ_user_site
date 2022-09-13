import { Store } from '@reduxjs/toolkit';
import { composeWithDevTools } from 'redux-devtools-extension';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { persistStore } from 'redux-persist';
import { RootState } from './types';
import { setStoreWallet, storeWallet } from './wallet';
import { setUserStore, userStore } from './user';
import { modalStore, setModalStore } from './modal';

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
});

const rootReducer = (state: any, action: any) => appReducer(state, action);

const middleWares: any[] = [];

const enhancer = composeWithDevTools(applyMiddleware(...middleWares));

export const store = createStore(rootReducer, enhancer);

export const persistor = persistStore(store);

export default store;

setStore(store);
setStoreWallet(store);
setUserStore(store);
setModalStore(store);
