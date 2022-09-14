import type { NextPage } from 'next';
import Head from 'next/head';
import HomePage from 'components/templates/homepage';

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
