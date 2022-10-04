import { ErrorMessage } from 'common/constants/error';
import { message } from 'antd';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const handleCommonError = (e?: any) => {
	if (e) {
		message.error(e?.message | e?.code | e?.toString() | e);
	}
	message.error(ErrorMessage.NETWORK_ERROR);
};

export const showSuccess = (m: string) => {
	message.success(m);
};

export const showInfo = (m: string) => {
	message.info(m);
};

export const showError = (m: string) => {
	message.error(m);
};
