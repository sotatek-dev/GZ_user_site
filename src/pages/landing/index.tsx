import React from 'react';
import About from 'src/modules/landing/components/About';
import Footer from 'src/modules/landing/components/Footer';

import Header from 'src/modules/landing/components/Header';
import PreFooter from 'src/modules/landing/components/PreFooter';
import Roadmap from 'src/modules/landing/components/Roadmap';
import styles from '../../modules/landing/style/landing.module.css';
export default function LandingPage() {
	return (
		<div className={`${styles['landing']} bg-[#0C1E32] w-[100vw]`}>
			<div
				className='bg-repeat'
				style={{
					backgroundImage: 'url(/images/background.svg)',
					backgroundPosition: 'center',
					backgroundSize: 'contain',
				}}
			>
				<Header />
				<About />
				<Roadmap />
				<PreFooter />
				<Footer />
			</div>
		</div>
	);
}
