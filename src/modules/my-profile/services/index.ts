import axiosInstance from 'apis/config';
import { toast } from 'react-toastify';

export function copyToClipboard(text: string) {
	navigator.clipboard.writeText(text);
	toast.info('Copied to clipboard', {
		theme: 'dark',
	});
}

export const getSignature = async () => {
	const queryString = `token-status`;
	return await axiosInstance()
		.get(queryString)
		.then((res) => [res.data, null])
		.catch((error) => [null, error]);
};
