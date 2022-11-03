import BuyInfo from 'modules/myProfile/components/BuyInfo';
import MyDNFT from 'modules/myProfile/components/MyDNFT';
import PersonalInfo from 'modules/myProfile/components/PersonalInfo';

export default function MyProfile() {
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
