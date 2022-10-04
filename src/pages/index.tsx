import type { NextPage } from 'next';
import Head from 'next/head';
// import HomePage from 'components/templates/homepage';
import TokenPresaleRound from './token-presale-rounds';

const Home: NextPage = () => {
	return (
		<div>
			<Head>
				<title>Galactix Zone</title>
				<link rel='icon' href='/favicon.png' />
			</Head>
			{/* <HomePage /> */}
			<TokenPresaleRound />
		</div>
	);
};

export default Home;
