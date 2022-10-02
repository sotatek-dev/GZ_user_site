import { ROUTES } from 'common/constants/constants';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function HomePage() {
	const router = useRouter();
	useEffect(() => {
		router.push(ROUTES.TOKEN_PRESALE_ROUNDS);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return <div className='bg-background-dark-900'></div>;
}
