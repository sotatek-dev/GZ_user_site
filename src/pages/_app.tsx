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
					<AuthProvider>
						<Component {...pageProps} />
					</AuthProvider>
				</Provider>
			</Web3ReactProvider>
		</>
	);
}

export default MyApp;
