import 'src/styles/globals.css';
<<<<<<< Updated upstream
=======
import 'antd/dist/antd.css';

import Head from 'next/head';
>>>>>>> Stashed changes
import type { AppProps } from 'next/app';
import { Web3ReactProvider } from '@web3-react/core';
import { providers } from 'ethers';

<<<<<<< Updated upstream
function App({ Component, pageProps }: AppProps) {
	return <Component {...pageProps} />;
=======
import DefaultLayout from '@common/layouts';

// import { useStore } from 'react-redux';
// import { PersistGate } from 'redux-persist/integration/react';

function getLibrary(provider: any) {
	const library = new providers.Web3Provider(provider);
	library.pollingInterval = 15000;
	return library;
>>>>>>> Stashed changes
}

function MyApp({ Component, pageProps }: AppProps) {
	// const store: any = useStore();
	// const Gate: any = typeof window !== 'undefined' ? PersistGate : Box;
	return (
		<>
			<Head>
				<title>Galactox Zone</title>
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
