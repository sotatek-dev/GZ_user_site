/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorCode } from '@ethersproject/logger';
import { ErrorMessage } from 'common/constants/error';
import { handleCommonError, showError } from 'common/helpers/toast';

export const handleBuyInfoError = (e?: any) => {
	if (e?.code === ErrorCode.ACTION_REJECTED || e?.code === 4001) {
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

export const handleClaimError = (e?: any) => {
	if (e?.code === ErrorCode.ACTION_REJECTED || e?.code === 4001) {
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
