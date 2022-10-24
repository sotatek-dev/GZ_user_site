import { QueryClient, QueryClientProvider } from 'react-query';
import 'styles/globals.scss';
import 'styles/index.scss';

import { Web3ReactProvider } from '@web3-react/core';
import { providers } from 'ethers';
import type { AppProps } from 'next/app';

import DefaultLayout from 'common/layouts';
import { Provider } from 'react-redux';
import store from 'stores';
import { AuthProvider } from 'web3/contexts/authContext';
import DocumentHead from 'common/components/head';
import BigNumber from 'bignumber.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any

function getLibrary(provider: any) {
	const library = new providers.Web3Provider(provider);
	library.pollingInterval = 15000;
	return library;
}
const queryClient = new QueryClient();

BigNumber.config({
	ROUNDING_MODE: BigNumber.ROUND_DOWN,
	EXPONENTIAL_AT: [-50, 50],
});

function MyApp(props: AppProps) {
	return (
		<>
			<DocumentHead title='Galactix Zone' />
			<QueryClientProvider client={queryClient}>
				<Web3ReactProvider getLibrary={getLibrary}>
					<Provider store={store}>
						<AuthProvider>
							<DefaultLayout {...props} />
						</AuthProvider>
					</Provider>
				</Web3ReactProvider>
			</QueryClientProvider>
		</>
	);
}

export default MyApp;
