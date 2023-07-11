/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorCode } from '@ethersproject/logger';
import { handleCommonError, showError } from 'common/helpers/toast';
import { ErrorMessage } from 'common/constants/error';

const METAMASK_SP_REJECTED_ERROR_CODE = 4001;

export const handleWriteMethodError = (e?: any) => {
	if (
		e?.code === ErrorCode.ACTION_REJECTED ||
		e.code === METAMASK_SP_REJECTED_ERROR_CODE ||
		e?.message === 'User rejected the transaction'
	) {
		showError(ErrorMessage.TRANSACTION_REJECTED);
	} else if (
		e?.code === ErrorCode.SERVER_ERROR ||
		e?.code === ErrorCode.TIMEOUT ||
		e?.code === ErrorCode.UNKNOWN_ERROR
	) {
		console.log('==');
		showError(ErrorMessage.NETWORK_ERROR);
	} else {
		handleCommonError();
	}
};

export const handleCallMethodError = (e?: any) => {
	if (
		e?.code === ErrorCode.ACTION_REJECTED ||
		e?.message === 'User rejected the transaction'
	) {
		showError(ErrorMessage.TRANSACTION_REJECTED);
	} else if (
		e?.code === ErrorCode.SERVER_ERROR ||
		e?.code === ErrorCode.TIMEOUT ||
		e?.code === ErrorCode.UNKNOWN_ERROR
	) {
		showError(ErrorMessage.NETWORK_ERROR);
	} else {
		handleCommonError();
	}
};

// create handeFetchError
