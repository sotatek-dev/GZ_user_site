import type { NextPage } from 'next';
import Head from 'next/head';
import { providers } from 'ethers';
import HomePage from 'components/templates/homepage';

function getLibrary(provider: any) {
	const library = new providers.Web3Provider(provider);
	library.pollingInterval = 15000;
	return library;
}

const Home: NextPage = () => {
	return (
		<div>
			<Head>
				<title>Galactix Zone</title>
				<link rel='icon' href='/favicon.png' />
			</Head>
			<HomePage />
		</div>
	);
};

export default Home;
