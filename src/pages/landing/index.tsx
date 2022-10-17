import HelmetCommon from 'common/components/helmet';
import { ROUTES } from 'common/constants/constants';
import React from 'react';
import 'react-lazy-load-image-component/src/effects/blur.css';
import styles from '../../modules/landing/style/landing.module.scss';
import dynamic from 'next/dynamic';
const Header = dynamic(
	() => import('./../../modules/landing/components/Header/index')
);
const Footer = dynamic(
	() => import('./../../modules/landing/components/Footer')
);
const PreFooter = dynamic(
	() => import('./../../modules/landing/components/PreFooter')
);
const About = dynamic(() => import('./../../modules/landing/components/About'));
const Roadmap = dynamic(
	() => import('./../../modules/landing/components/Roadmap')
);
const Statistic = dynamic(
	() => import('./../../modules/landing/components/Statistic')
);

export default function LandingPage() {
	return (
		<>
			<HelmetCommon
				title='Landing'
				description='Description landing...'
				href={ROUTES.LANDING}
			/>
			<div className={`${styles['landing']}`}>
				<div className={styles['landing_background']}>
					<div className='desktop:max-w-[90rem] mobile:max-w-[100vw]'>
						<Header />
						<main>
							<About />
							<Statistic />
							<Roadmap />
							<PreFooter />
						</main>
					</div>
					<Footer />
				</div>
			</div>
		</>
	);
}
