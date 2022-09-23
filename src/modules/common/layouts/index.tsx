import { Layout, Menu } from 'antd';
import ImageBase from 'common/components/imageBase';
// import ImageBase from 'common/components/imageBase';
import { IconDynamic } from 'common/assets/iconography/iconBundle';
import { ROUTES } from 'common/constants/constants';
import { get } from 'lodash';
import Link from 'next/link';
import Footer from './Footer';
import LayoutHeader from './Header';

const { Sider, Content } = Layout;

const LIST_SIDER = [
	{
		router: ROUTES.TOKEN_PRESALE_ROUNDS,
		icon: './icons/TokenPresaleRounds.svg',
		title: 'Token Presale Rounds',
	},
	{
		router: ROUTES.MY_PROFILE,
		icon: './icons/my-profile.svg',
		title: 'My Profile',
	},
	{
		router: ROUTES.MINT_DNFT,
		icon: './images/logo.svg',
		title: 'Mint dNFT',
	},
	{
		router: ROUTES.MERGE_NFT,
		icon: './icons/merge-dNFT.svg',
		title: 'Merge dNFT',
	},
	{
		router: ROUTES.RESCUE_NFT,
		// icon: './images/logo.svg',
		title: 'Rescue NFT',
	},
];

const DefaultLayout = ({ children, appProps }: any) => {
	if (['/landing'].includes(get(appProps, 'router.pathname'))) {
		return <>{children}</>;
	}

	return (
		<Layout className='!bg-background-dark'>
			<Sider
				breakpoint='lg'
				collapsedWidth='0'
				// onBreakpoint={(broken) => {
				// console.log(broken);
				// }}
				// onCollapse={(collapsed, type) => {
				// 	console.log(collapsed, type);
				// }}
				className='px-[35px] !bg-background-dark min-h-screen !w-fit !max-w-fit	!flex-auto'
			>
				<ImageBase
					url='./images/logo.svg'
					type='HtmlImage'
					style={{
						objectFit: 'contain',
					}}
					className='w-[140px] h-[140px]'
				/>
				<Menu
					theme='dark'
					className='!bg-background-dark'
					mode='inline'
					defaultSelectedKeys={['4']}
				>
					{LIST_SIDER.map((sider: any) => {
						const { router, icon, title } = sider;
						return (
							<Menu.Item
								key={router}
								// onClick={() => router.push(ROUTES.TOKEN_PRESALE_ROUNDS)}
								className='!px-0 '
							>
								<Link href={router}>
									<a className='flex items-center font-normal text-base'>
										{icon && (
											<IconDynamic
												image={icon}
												className='!w-[22px] !h-[22px] mr-4 mb-0'
											/>
										)}
										{title}
									</a>
								</Link>
							</Menu.Item>
						);
					})}
				</Menu>
			</Sider>
			<Layout>
				<LayoutHeader />
				<Content className='p-8 !bg-background-dark'>{children}</Content>
				<Footer />
			</Layout>
		</Layout>
	);
};

export default DefaultLayout;
