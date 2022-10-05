import { message } from 'antd';
import axiosInstance from 'apis/config';

export function copyToClipboard(text: string) {
	navigator.clipboard.writeText(text);
	message.info('Copied to clipboard');
}

export const getSignature = async () => {
	const queryString = `token-status`;
	return await axiosInstance()
		.get(queryString)
		.then((res) => [res.data, null])
		.catch((error) => [null, error]);
};
