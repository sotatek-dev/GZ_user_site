import 'antd/dist/antd.css';
import 'styles/globals.scss';
import 'styles/index.scss';

import Head from 'next/head';
import type { AppProps } from 'next/app';
import { Web3ReactProvider } from '@web3-react/core';
import { providers } from 'ethers';
import DefaultLayout from 'modules/common/layouts';
// import DefaultLayout from '@common/layouts';

import { Provider } from 'react-redux';
import store from 'stores';

function getLibrary(provider: any) {
	const library = new providers.Web3Provider(provider);
	library.pollingInterval = 15000;
	return library;
}

function MyApp({ Component, pageProps }: AppProps) {
	// const Gate: any = typeof window !== 'undefined' && PersistGate;
	return (
		<>
			<Head>
				<title>Galactox Zone</title>
			</Head>
			<Web3ReactProvider getLibrary={getLibrary}>
				<Provider store={store}>
					<DefaultLayout>
						<div suppressHydrationWarning>
							<Component {...pageProps} />
						</div>
					</DefaultLayout>
				</Provider>
			</Web3ReactProvider>
		</>
	);
}
export default MyApp;
