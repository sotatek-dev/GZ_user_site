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
		icon: './icons/mint-dnft.svg',
		title: 'Mint dNFT',
	},
	{
		router: ROUTES.MINT_KEY,
		icon: './icons/mint-key.svg',
		title: 'Mint Key',
	},
	{
		router: ROUTES.MERGE_NFT,
		icon: './icons/merge-dNFT.svg',
		title: 'Merge dNFT',
	},
	{
		router: ROUTES.RESCUE_NFT,
		icon: './icons/rescue-nft.svg',
		title: 'Rescue NFT',
	},
];

const DefaultLayout = ({ children, appProps }: any) => {
	if (['/landing'].includes(get(appProps, 'router.pathname'))) {
		return <>{children}</>;
	}

	return (
		<Layout className='!bg-[#061322]'>
			<Sider
				breakpoint='lg'
				collapsedWidth='0'
				className='!bg-[#0E1A2B] min-h-screen !min-w-[260px] !flex-auto'
			>
				<div className='flex items-center justify-center pb-[1rem] px-[10px] border-b-[1px] border-[#36c1ff0d]'>
					<ImageBase
						url='./images/logo.svg'
						type='HtmlImage'
						style={{
							objectFit: 'contain',
						}}
						className='w-[5.0625rem] h-[5.0625rem] mt-[1.25rem] '
					/>
				</div>
				<Menu
					theme='dark'
					className='!bg-[#0E1A2B]  mt-[1.5625rem]'
					mode='inline'
					defaultSelectedKeys={['4']}
				>
					{LIST_SIDER.map((sider: any) => {
						const { router, icon, title } = sider;
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
