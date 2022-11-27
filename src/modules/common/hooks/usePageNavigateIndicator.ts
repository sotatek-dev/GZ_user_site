import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export const usePageNavigateIndicator = () => {
	const router = useRouter();
	const [routerChange, setRouterChange] = useState(false);

	useEffect(() => {
		const handleStart = () => {
			setRouterChange(true);
		};

		const handleStop = () => {
			setRouterChange(false);
		};

		router.events.on('routeChangeStart', handleStart);
		router.events.on('routeChangeComplete', handleStop);
		router.events.on('routeChangeError', handleStop);

		return () => {
			router.events.off('routeChangeStart', handleStart);
			router.events.off('routeChangeComplete', handleStop);
			router.events.off('routeChangeError', handleStop);
		};
	}, [router]);

	return routerChange;
};
