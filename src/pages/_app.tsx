import { QueryClient, QueryClientProvider } from 'react-query';
import 'styles/globals.scss';
import 'styles/index.scss';

import { Web3ReactHooks, Web3ReactProvider } from '@web3-react/core';
import { Provider } from 'react-redux';
import BigNumber from 'bignumber.js';
import type { AppProps } from 'next/app';

import DefaultLayout from 'common/layouts';
import store from 'stores';
import { AuthProvider } from 'web3/contexts/authContext';
import DocumentHead from 'common/components/head';
import { metaMask, metamaskHooks } from 'web3/connectors/metamask';
import {
	walletConnect,
	walletConnectHooks,
} from 'web3/connectors/walletConnectV2';
import { MetaMask } from '@web3-react/metamask';
import { WalletConnect } from '@web3-react/walletconnect-v2';

const queryClient = new QueryClient();

BigNumber.config({
	ROUNDING_MODE: BigNumber.ROUND_DOWN,
	EXPONENTIAL_AT: [-50, 50],
});

const connectors: [MetaMask | WalletConnect, Web3ReactHooks][] = [
	[metaMask, metamaskHooks],
	[walletConnect, walletConnectHooks],
];

function MyApp(props: AppProps) {
	return (
		<>
			<DocumentHead title='Galactix Zone' />
			<QueryClientProvider client={queryClient}>
				<Web3ReactProvider connectors={connectors}>
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
