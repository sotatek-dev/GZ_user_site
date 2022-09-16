import 'antd/dist/antd.css';
import 'styles/globals.scss';
import 'styles/index.scss';

import { Web3ReactProvider } from '@web3-react/core';
import { providers } from 'ethers';
import type { AppProps } from 'next/app';
import Head from 'next/head';
// import DefaultLayout from '@common/layouts';

import { Provider } from 'react-redux';
import store from 'stores';
import { AuthProvider } from 'web3/contexts/authContext';
import DefaultLayout from 'common/layouts';

function getLibrary(provider: any) {
	const library = new providers.Web3Provider(provider);
	library.pollingInterval = 15000;
	return library;
}

function MyApp({ Component, pageProps, ...appProps }: AppProps) {
	return (
		<>
			<Head>
				<title>Galactix Zone</title>
			</Head>
			<Web3ReactProvider getLibrary={getLibrary}>
				<Provider store={store}>
					<AuthProvider>
						<DefaultLayout appProps={appProps}>
							<Component {...pageProps} />
						</DefaultLayout>
					</AuthProvider>
				</Provider>
			</Web3ReactProvider>
		</>
	);
}

export default MyApp;
