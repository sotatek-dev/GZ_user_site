import React from 'react';
import About from 'src/modules/landing/components/About';
import Footer from 'src/modules/landing/components/Footer';

import Header from 'src/modules/landing/components/Header';
import PreFooter from 'src/modules/landing/components/PreFooter';
import Roadmap from 'src/modules/landing/components/Roadmap';
import Statistic from 'src/modules/landing/components/Statistic';
import styles from '../../modules/landing/style/landing.module.scss';
export default function LandingPage() {
	return (
		<div className={`${styles['landing']}`}>
			<div
				className='bg-repeat bg-center bg-contain flex items-center flex-col'
				style={{
					backgroundImage: 'url(/images/background.svg)',
				}}
			>
				<div className='max-w-[90rem]'>
					<Header />
					<About />
					<Statistic />
					<Roadmap />
					<PreFooter />
				</div>
				<Footer />
			</div>
		</div>
	);
}
