import { ErrorCode } from '@ethersproject/logger';
import { handleCommonError, showError } from 'common/helpers/toast';
import { ErrorMessage } from 'common/constants/error';

export const handleWriteMethodError = (e?: any) => {
	if (e?.code === ErrorCode.ACTION_REJECTED) {
		showError(ErrorMessage.TRANSACTION_REJECTED);
	} else if (
		e.code === ErrorCode.SERVER_ERROR ||
		e?.code === ErrorCode.TIMEOUT ||
		e?.code === ErrorCode.UNKNOWN_ERROR
	) {
		showError(ErrorMessage.NETWORK_ERROR);
	} else {
		handleCommonError();
	}
};

export const handleCallMethodError = (e?: any) => {
	if (e?.code === ErrorCode.ACTION_REJECTED) {
		showError(ErrorMessage.TRANSACTION_REJECTED);
	} else if (
		e.code === ErrorCode.SERVER_ERROR ||
		e?.code === ErrorCode.TIMEOUT ||
		e?.code === ErrorCode.UNKNOWN_ERROR
	) {
		showError(ErrorMessage.NETWORK_ERROR);
	} else {
		handleCommonError();
	}
};

// create handeFetchError
