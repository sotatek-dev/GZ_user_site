import HelmetCommon from 'common/components/helmet';
import { ROUTES } from 'common/constants/constants';
import BuyInfo from 'modules/my-profile/components/BuyInfo';
import MyDNFT from 'modules/my-profile/components/MyDNFT';
import PersonalInfo from 'modules/my-profile/components/PersonalInfo';

export default function MyProfile() {
	return (
		<>
			<HelmetCommon
				title='My Profile'
				description='Description my profile ...'
				href={ROUTES.MY_PROFILE}
			/>
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
