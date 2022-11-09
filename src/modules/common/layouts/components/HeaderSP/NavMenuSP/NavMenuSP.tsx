import { Menu } from 'antd';
import { IconDynamic } from 'common/assets/iconography/iconBundle';
import ImageBase from 'common/components/imageBase';
import { ROUTES } from 'common/constants/constants';
import { LIST_SIDER } from 'common/layouts';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import { useAppSelector } from 'stores';
import ConnectedWalletSP from '../ConnectedWalletSP';

interface Props {
	openMobileNav: boolean;
	setOpenMobileNav: (val: boolean) => void;
}

export default function NavMenuSP({ openMobileNav, setOpenMobileNav }: Props) {
	const router = useRouter();
	const isLogin = useAppSelector((state) => state.user.isLogin);

	useEffect(() => {
		setOpenMobileNav(false);
	}, [router.pathname]);

	const isActivateSideBar: string[] = useMemo((): string[] => {
		if (router.pathname.includes(ROUTES.MERGE_DNFT)) return [ROUTES.LIST_DNFT];
		if (router.pathname.includes(ROUTES.NFT_DETAIL)) return [ROUTES.MY_PROFILE];
		if (router.pathname.includes(ROUTES.TOKEN_PRESALE_ROUNDS))
			return [ROUTES.TOKEN_PRESALE_ROUNDS];
		return [router.pathname];
	}, [router.pathname]);

	return (
		// display merge image contents has z-index 160, so z-index navbar must 161
		<div
			className={`${
				openMobileNav ? 'block' : 'hidden'
			} desktop:hidden flex fixed top-0 left-0 h-screen w-screen bg-gray z-[500] leading-5`}
		>
			{/* spacer*/}
			<div className={'w-14'} />
			<div className={'flex flex-col w-full bg-black-10'}>
				<div className='flex items-center justify-start py-4 px-8 w-full'>
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
					<IconDynamic
						image={'/icons/close-nav-mobile.svg'}
						className={'w-8 h-8 cursor-pointer'}
						onClick={() => {
							setOpenMobileNav(false);
						}}
					/>
				</div>
				<Menu
					theme='dark'
					className={'!bg-black-10 grow'}
					mode='inline'
					selectedKeys={isActivateSideBar}
					defaultSelectedKeys={['4']}
				>
					{LIST_SIDER.map((sider) => {
						const { router, icon, title, needLogin } = sider;
						if (needLogin && !isLogin) {
							return null;
						}
						return (
							<Menu.Item
								key={router}
								// onClick={() => router.push(ROUTES.TOKEN_PRESALE_ROUNDS)}
								className='!py-[13px] !px-[24px] !h-fit'
							>
								<Link href={router}>
									<a className='flex items-center font-semibold text-base'>
										{icon && (
											<IconDynamic
												image={icon}
												className='!w-[22px] !h-[22px] mr-[1rem] mb-0'
											/>
										)}
										{title}
									</a>
								</Link>
							</Menu.Item>
						);
					})}
				</Menu>
				<div className={'mx-8 mb-10'}>
					{/* connect wallet button*/}
					<ConnectedWalletSP />
				</div>
			</div>
		</div>
	);
}
