export const STORAGE_KEYS = {
	WALLET_CONNECT: 'walletconnect',
	ACCOUNT: 'account',
	NETWORK: 'network',
	SIGNATURE: 'signature',
	CONNECTOR: 'connector',
	WALLET_LAST_CONNECTED: 'walletLastConnected',
};

const StorageUtils = {
	setItem: (key: string, value: string) => {
		window.localStorage && window.localStorage.setItem(key, value);
	},

	getItem: (key: string, defaultValue?: string) => {
		const result = window.localStorage && window.localStorage.getItem(key);
		if (result === null || result === undefined) return defaultValue;
		return result;
	},

	removeItem: (key: string) => {
		window.localStorage && window.localStorage.removeItem(key);
	},

	setItemObject: (key: string, itemObject: any) => {
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

	// section storage
	// static setSectionStorageItem(key: string, value: string) {
	//   window.sessionStorage.setItem(key, value);
	// }

	// static getSectionStorageItem(key: string) {
	//   return window.sessionStorage.getItem(key);
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
