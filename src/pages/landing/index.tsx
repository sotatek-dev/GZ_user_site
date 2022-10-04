import HelmetCommon from 'common/components/helmet';
import { ROUTES } from 'common/constants/constants';
import About from 'modules/landing/components/About';
import Footer from 'modules/landing/components/Footer';
import Header from 'modules/landing/components/Header';
import PreFooter from 'modules/landing/components/PreFooter';
import Roadmap from 'modules/landing/components/Roadmap';
import Statistic from 'modules/landing/components/Statistic';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import ReactGa from 'react-ga';
import 'react-lazy-load-image-component/src/effects/blur.css';
import styles from '../../modules/landing/style/landing.module.scss';
export default function LandingPage() {
	const router = useRouter();
	useEffect(() => {
		ReactGa.initialize(process?.env?.NEXT_PUBLIC_GA_TRACKING_CODE || '');
		// to report page view Google Analytics
		ReactGa.pageview(router?.pathname || '');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
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
