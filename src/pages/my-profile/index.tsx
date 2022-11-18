import BuyInfo from 'modules/my-profile/components/BuyInfo';
import MyDNFT from 'modules/my-profile/components/MyDNFT';
import PersonalInfo from 'modules/my-profile/components/PersonalInfo';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAppSelector } from 'stores';

export default function MyProfile() {
	const router = useRouter();
	const { isLogin } = useAppSelector((store) => store.user);

	useEffect(() => {
		const accessToken = window.sessionStorage.getItem('accessToken');
		if (!accessToken) {
			router.replace('/');
		}
	}, [router, isLogin]);

	return (
		<>
			<div className='flex flex-col gap-2.5 desktop:gap-y-6'>
				<div className='flex flex-col desktop:flex-row gap-2.5 desktop:gap-x-6'>
					<PersonalInfo />
					<BuyInfo />
				</div>
				<MyDNFT />
			</div>
		</>
	);
}
