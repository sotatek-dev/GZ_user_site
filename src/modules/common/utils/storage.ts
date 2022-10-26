/* eslint-disable @typescript-eslint/no-explicit-any */
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';

export const STORAGE_KEYS = {
	WALLET_CONNECT: 'walletconnect',
	ACCOUNT: 'account',
	NETWORK: 'network',
	SIGNATURE: 'signature',
	WALLET_CONNECTED: 'walletConnected',
	WALLET_LAST_CONNECTED: 'walletLastConnected',
	ACCESS_TOKEN: 'accessToken',
	EXPIRE_IN: 'expireIn',
};

interface DataStorage {
	key: string;
	value: any;
}

const StorageUtils = {
	setItem: (key: string, value: string) => {
		if (typeof window == 'undefined') return;
		window.localStorage.setItem(key, value);
	},

	getItem: (key: string, defaultValue?: string) => {
		if (typeof window == 'undefined') return;
		const result = window.localStorage.getItem(key);
		if (result === null || result === undefined) return defaultValue;
		return result;
	},

	removeItem: (key: string) => {
		if (typeof window == 'undefined') return;
		window.localStorage.removeItem(key);
	},

	setItemObject: (key: string, itemObject: object) => {
		StorageUtils.setItem(key, JSON.stringify(itemObject));
	},

	getItemObject: (key: string, defaultValue = {}) => {
		const stringJson = StorageUtils.getItem(key);
		if (!stringJson) {
			return defaultValue;
		}
		try {
			return JSON.parse(stringJson);
		} catch (e) {
			return defaultValue;
		}
	},

	removeSessionStorageItem: (key: string) => {
		if (typeof window == 'undefined') return;
		window.sessionStorage.removeItem(key);
	},

	setSectionStorageItem: (key: string, value: string) => {
		if (typeof window == 'undefined') return;
		window.sessionStorage.setItem(key, value);
	},

	getSectionStorageItem: (key: string) => {
		if (typeof window == 'undefined') return;
		const result = window.sessionStorage.getItem(key);
		return result || '';
	},

	removeSectionStorageItem: (key: string) => {
		if (typeof window == 'undefined') return;
		window.sessionStorage.removeItem(key);
	},

	// cookie
	getCookieStorage: (key: string) => Cookies.get(key),

	setOneCookieStorage: (key: string, data: string | number | any) => {
		const domain = process.env.REACT_APP_COOKIE_DOMAIN || '';
		Cookies.set(key, typeof data === 'object' ? JSON.stringify(data) : data, {
			domain,
		});
	},

	setAllCookieStorage: (data: DataStorage[]): any =>
		data.forEach((item) =>
			StorageUtils.setOneCookieStorage(item.key, item.value)
		),

	removeOneCookieStorage: (key: string): any => {
		const domain = process.env.REACT_APP_COOKIE_DOMAIN || '';
		Cookies.remove(key, { domain });
	},

	removeAllCookieStorage: (data: string[]): any =>
		data.forEach((item) => StorageUtils.removeOneCookieStorage(item)),

	setTokenCookie: (access_token: string): void => {
		const tokenDecoded: any = jwt_decode(access_token);
		const expToken = tokenDecoded.exp ? parseFloat(tokenDecoded.exp) * 1000 : 0;

		StorageUtils.setAllCookieStorage([
			{ key: 'access_token', value: access_token },
			{ key: 'expire_token', value: expToken },
		]);
	},

	// section storage
	// static setSectionStorageItem(key: string, value: string) {
	//   window.sessionStorage.setItem(key, value);
	// }

	// static removeUser() {
	//   this.removeSectionStorageItem(KEY.USER);
	// }

	// // Token
	// static setToken(value = "") {
	//   StorageUtils.setSectionStorageItem(KEY.TOKEN_ACCESS, value);
	// }

	// static getToken() {
	//   return StorageUtils.getSectionStorageItem(KEY.TOKEN_ACCESS);
	// }

	// static removeToken() {
	//   StorageUtils.removeSectionStorageItem(KEY.TOKEN_ACCESS);
	// }

	// static setUser(value: any) {
	//   this.setSectionStorageItem(KEY.USER, JSON.stringify(value));
	// }

	// static getUser() {
	//   const user = this.getSectionStorageItem(KEY.USER) as string;
	//   return JSON.parse(user);
	// }

	// static setSignature(value = "") {
	//   StorageUtils.setSectionStorageItem(STORAGE_KEYS.SIGNATURE, value);
	// }

	// static getSignature() {
	//   return StorageUtils.getSectionStorageItem(STORAGE_KEYS.SIGNATURE);
	// }

	// static removeSectionStorageItem(key: string) {
	//   window.sessionStorage.removeItem(key);
	// }
};

export default StorageUtils;
