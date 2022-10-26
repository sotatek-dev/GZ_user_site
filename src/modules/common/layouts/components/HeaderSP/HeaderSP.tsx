import { useState } from 'react';
import { IconDynamic } from 'common/assets/iconography/iconBundle';
import ImageBase from 'common/components/imageBase';
import NavMenuSP from './NavMenuSP';
import Wallet from '../HeaderPC/Wallet';

export default function HeaderSP() {
	const [openMobileNav, setOpenMobileNav] = useState(false);

	return (
		<div className='desktop:hidden flex items-center gap-5 text-h7 w-full'>
			<div className={'grow'}>
				<ImageBase
					url='/images/logo.svg'
					width={40}
					height={40}
					style={{
						objectFit: 'contain',
					}}
				/>
			</div>
			<Wallet />
			<IconDynamic
				image={'/icons/burger.svg'}
				className={'w-8 h-8 cursor-pointer'}
				onClick={() => {
					setOpenMobileNav(true);
				}}
			/>
			<NavMenuSP
				openMobileNav={openMobileNav}
				setOpenMobileNav={setOpenMobileNav}
			/>
		</div>
	);
}
