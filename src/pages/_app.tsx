import { QueryClient, QueryClientProvider } from 'react-query';
import 'styles/globals.scss';
import 'styles/index.scss';

// import { providers } from 'ethers';
import type { AppProps } from 'next/app';

import DefaultLayout from 'common/layouts';
import { Provider } from 'react-redux';
import store from 'stores';
import { AuthProvider } from 'web3/contexts/authContext';
import DocumentHead from 'common/components/head';
import BigNumber from 'bignumber.js';

import { Web3ReactHooks, Web3ReactProvider } from '@web3-react/core';
import type { MetaMask } from '@web3-react/metamask';
import type { Network } from '@web3-react/network';
import type { WalletConnect } from '@web3-react/walletconnect';
import type { WalletConnect as WalletConnectV2 } from '@web3-react/walletconnect-v2';

import { hooks as metaMaskHooks, metaMask } from '../connectors/metaMask';
import { hooks as networkHooks, network } from '../connectors/network';
import {
	hooks as walletConnectHooks,
	walletConnect,
} from '../connectors/walletConnect';
import {
	hooks as walletConnectV2Hooks,
	walletConnectV2,
} from '../connectors/walletConnectV2';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// function getLibrary(provider: any) {
// 	const library = new providers.Web3Provider(provider);
// 	library.pollingInterval = 15000;
// 	return library;
// }
const queryClient = new QueryClient();

BigNumber.config({
	ROUNDING_MODE: BigNumber.ROUND_DOWN,
	EXPONENTIAL_AT: [-50, 50],
});

const connectors: [
	MetaMask | WalletConnect | WalletConnectV2 | Network,
	Web3ReactHooks
][] = [
	[metaMask, metaMaskHooks],
	[walletConnect, walletConnectHooks],
	[walletConnectV2, walletConnectV2Hooks],
	[network, networkHooks],
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
