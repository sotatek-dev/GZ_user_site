import { Layout, Menu } from 'antd';
import { useMemo, useState } from 'react';
import { IconDynamic } from 'common/assets/iconography/iconBundle';
import IconOutLined from 'assets/svg-components/LeftOutlinedCustom';
import { useRouter } from 'next/router';
import { ROUTES } from 'common/constants/constants';
import type { MenuProps } from 'antd';
import type { AppProps } from 'next/app';
import ImageBase from 'common/components/imageBase';
import LayoutHeader from './components/Header';
import { useAppSelector } from 'stores';
import PageLoadIndicator from 'common/components/pageLoadIndicator';
import { usePageNavigateIndicator } from 'common/hooks/usePageNavigateIndicator';

const { Sider, Content } = Layout;
type MenuItem = Required<MenuProps>['items'][number];

function getItem(
	label: React.ReactNode,
	key: React.Key,
	onClick: () => void,
	icon?: React.ReactNode,
	className?: string,
	children?: MenuItem[],
	type?: 'group'
): MenuItem {
	return {
		key,
		icon,
		children,
		label,
		type,
		className,
		onClick,
	} as MenuItem;
}

interface ISider {
	router: string;
	icon: string;
	title: string;
	needLogin?: boolean;
}

export const LIST_SIDER = [
	{
		router: ROUTES.TOKEN_PRESALE_ROUNDS,
		icon: '/icons/TokenPresaleRounds.svg',
		title: 'Token Presale Rounds',
	},
	{
		router: ROUTES.MY_PROFILE,
		icon: '/icons/my-profile.svg',
		title: 'My Profile',
		needLogin: true,
	},
	{
		router: ROUTES.MINT_DNFT,
		icon: '/icons/mint-dnft.svg',
		title: 'Mint sdNFT',
	},

	{
		router: ROUTES.LIST_DNFT,
		icon: '/icons/merge-dNFT.svg',
		title: 'Synergize Merge Mint',
	},
	{
		router: ROUTES.RESCUE_NFT,
		icon: '/icons/rescue-nft.svg',
		title: 'Cosmic Void Rescue',
	},
];

const DefaultLayout = ({ Component, pageProps }: AppProps) => {
	const { isLogin } = useAppSelector((state) => state.user);
	const [collapsed, setCollapsed] = useState(false);
	const isRouterChange = usePageNavigateIndicator();
	const router = useRouter();
	const isActivateSideBar: string[] = useMemo((): string[] => {
		if (router.pathname.includes(ROUTES.MERGE_DNFT)) return [ROUTES.LIST_DNFT];
		if (router.pathname.includes(ROUTES.NFT_DETAIL)) return [ROUTES.MY_PROFILE];
		if (router.pathname.includes(ROUTES.TOKEN_PRESALE_ROUNDS))
			return [ROUTES.TOKEN_PRESALE_ROUNDS];
		return [router.pathname];
	}, [router]);

	const itemsMenuSide = useMemo(() => {
		const results: MenuItem[] = [];
		LIST_SIDER.forEach((sider: ISider) => {
			if (!sider.needLogin || (sider.needLogin && isLogin))
				results.push(
					getItem(
						sider.title,
						sider.router,
						() => router.push(sider.router),
						<IconDynamic
							image={sider.icon}
							className='!w-[22px] !h-[22px] mr-[1rem] mb-0'
						/>,
						'!py-[5px] !px-[24px] !h-fit font-semibold text-base'
					)
				);
		});
		return results;
	}, [isLogin, router]);

	return (
		<>
			<PageLoadIndicator isRouterChange={isRouterChange} />
			<Layout className='!bg-[#353945] desktop:!bg-background-dark min-h-[100vh]'>
				<Sider
					id='siderbar-desktop'
					collapsed={collapsed}
					onCollapse={(value) => setCollapsed(value)}
					width={260}
					className={
						'hidden desktop:block !bg-[#0E1A2B] min-h-screen !flex-auto'
					}
				>
					<div className='flex items-center justify-center py-4 px-[10px] border-b-[1px] border-[#36c1ff0d] relative'>
						<ImageBase
							url='/images/logo.svg'
							width={80}
							height={80}
							style={{
								objectFit: 'contain',
							}}
							className='w-[5.0625rem] h-[5.0625rem] mt-[1.25rem]'
						/>
						<div
							className='absolute btn-collapsed-sidebar'
							onClick={() => setCollapsed(!collapsed)}
						>
							<BtnCollapsed collapsedStatus={collapsed} />
						</div>
					</div>
					<Menu
						theme='dark'
						className='!bg-[#0E1A2B]  mt-[1.5625rem]'
						mode='inline'
						selectedKeys={isActivateSideBar}
						defaultSelectedKeys={['4']}
						items={itemsMenuSide || [null]}
					/>
				</Sider>
				<Layout>
					<LayoutHeader />
					<Content className='p-4 desktop:px-12 !bg-gray desktop:!bg-background-dark'>
						<Component {...pageProps} />
					</Content>
				</Layout>
			</Layout>
		</>
	);
};

const BtnCollapsed = (props: {
	collapsedStatus: boolean;
	className?: string;
}) => {
	const { collapsedStatus } = props;
	return (
		<span className={`${collapsedStatus ? 'activate' : ''}`}>
			<IconOutLined />
		</span>
	);
};

export default DefaultLayout;
