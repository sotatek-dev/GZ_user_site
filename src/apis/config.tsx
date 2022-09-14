import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND;

const axiosInstance = (options: any = {}) => {
	const { headers = {}, baseUrl = BASE_URL } = options;
	const existToken = sessionStorage.getItem('accessToken');
	if (existToken) {
		headers['Authorization'] = `Bearer ${existToken}`;
	}
	const axiosIns = axios.create({
		baseURL: `${baseUrl}`,
		responseType: 'json',
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
			...headers,
		},
		transformRequest: [
			(data, headers) => {
				if (data instanceof FormData) {
					if (headers) {
						delete headers['Content-Type'];
					}
					return data;
				}
				return JSON.stringify(data);
			},
		],
	});
	return axiosIns;
};
export default axiosInstance;
