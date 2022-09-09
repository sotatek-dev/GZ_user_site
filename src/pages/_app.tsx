import 'src/styles/globals.css';
import 'antd/dist/antd.css';

import Head from 'next/head';
import type { AppProps } from 'next/app';
import { Web3ReactProvider } from '@web3-react/core';
import { providers } from 'ethers';

import DefaultLayout from '@common/layouts';

// import { useStore } from 'react-redux';
// import { PersistGate } from 'redux-persist/integration/react';

function getLibrary(provider: any) {
	const library = new providers.Web3Provider(provider);
	library.pollingInterval = 15000;
	return library;
}

function MyApp({ Component, pageProps }: AppProps) {
	// const store: any = useStore();
	// const Gate: any = typeof window !== 'undefined' ? PersistGate : Box;
	return (
		<>
			<Head>
				<title>Galactox Zone</title>
				<link
					rel='preconnect'
					href='https://fonts.gstatic.com'
					crossOrigin='true'
				/>
				<link rel='preconnect' href='https://fonts.googleapis.com' />
				<link
					href='https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap'
					rel='stylesheet'
				/>

				<link
					href='https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap'
					rel='stylesheet'
				/>
			</Head>
			<Web3ReactProvider getLibrary={getLibrary}>
				<DefaultLayout>
					<div suppressHydrationWarning>
						<Component {...pageProps} />
					</div>
				</DefaultLayout>
			</Web3ReactProvider>
		</>
	);
}
export default MyApp;
