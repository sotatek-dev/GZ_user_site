import 'antd/dist/antd.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import 'react-toastify/dist/ReactToastify.css';
import 'styles/globals.scss';
import 'styles/index.scss';

import { Web3ReactProvider } from '@web3-react/core';
import { providers } from 'ethers';
import type { AppProps } from 'next/app';
// import DefaultLayout from '@common/layouts';

import DefaultLayout from 'common/layouts';
import { Provider } from 'react-redux';
import store from 'stores';
import { AuthProvider } from 'web3/contexts/authContext';
import HeadCommon from 'common/components/head';
import { HelmetProvider } from 'react-helmet-async';

// eslint-disable-next-line @typescript-eslint/no-explicit-any

function getLibrary(provider: any) {
	const library = new providers.Web3Provider(provider);
	library.pollingInterval = 15000;
	return library;
}
const queryClient = new QueryClient();
function MyApp({ Component, pageProps, ...appProps }: AppProps) {
	return (
		<>
			<HeadCommon title='Galactix Zone' />
			<QueryClientProvider client={queryClient}>
				<Web3ReactProvider getLibrary={getLibrary}>
					<Provider store={store}>
						<AuthProvider>
							<HelmetProvider>
								<DefaultLayout appProps={appProps}>
									<Component {...pageProps} />
								</DefaultLayout>
							</HelmetProvider>
						</AuthProvider>
					</Provider>
				</Web3ReactProvider>
			</QueryClientProvider>
		</>
	);
}

export default MyApp;
