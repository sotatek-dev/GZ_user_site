import StorageUtils, { STORAGE_KEYS } from 'common/utils/storage';
import dayjs from 'dayjs';

export function isJwtTokenExpired() {
	if (window !== undefined) {
		const expiredTime = StorageUtils.getCookieStorage('expire_token');
		return !expiredTime || dayjs.unix(expiredTime).isBefore(dayjs());
	}
}

export function hasStorageJwtToken() {
	if (window !== undefined) {
		return !!StorageUtils.getCookieStorage(STORAGE_KEYS.ACCESS_TOKEN);
	}
}

export function removeStorageJwtToken() {
	if (window !== undefined) {
		StorageUtils.removeOneCookieStorage(STORAGE_KEYS.ACCESS_TOKEN);
	}
}
