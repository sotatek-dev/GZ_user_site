import React from 'react';
import { Layout } from 'antd';
import ConnectWallet from 'wallet/connect';

import HeaderSP from '../HeaderSP';
import HeaderPC from '../HeaderPC';

const { Header: AntLayoutHeader } = Layout;

const LayoutHeader = () => {
	return (
		<AntLayoutHeader className='relative site-layout-sub-header-background !bg-background-dark w-full flex p-4 desktop:py-9 desktop:px-12 !h-fit'>
			<HeaderPC />
			<HeaderSP />
			<ConnectWallet />
		</AntLayoutHeader>
	);
};

export default LayoutHeader;
