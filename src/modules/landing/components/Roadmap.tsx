import React from 'react';
import styles from '../style/roadmap.module.scss';

interface Timeline {
	imgSrc: string;
	imgStyle: any;
	title: string;
	descriptions: string[];
	position: 'left' | 'right';
}

export default function Roadmap() {
	const timelines: Timeline[] = [
		{
			imgSrc: '/images/roadmap_1.svg',
			imgStyle: {
				width: '35.5406rem',
				height: '28.2156rem',
				marginLeft: '3rem',
			},
			title: 'Q3 2022',
			descriptions: [
				'Finalize plan',
				'Firm up the whitepaper & pitch deck & list of all products',
				'Looking for & close deal with the very first investors & backers to get initial funds for project',
				'Start contract for development',
				'Start building community on social platforms 2022',
			],
			position: 'left',
		},
		{
			imgSrc: '/images/roadmap_2.svg',
			imgStyle: {
				width: '23.8256rem',
				height: '27.25rem',
				marginRight: '7.6875rem',
			},
			title: 'Q4 2022',
			descriptions: [
				'Teams will work on the documenting all products first: BRD, SRS, wireframes, technical architecture, etc..',
				'Design gameplay & concepts',
				'Develop GXZ token contract',
				'Develop NFT minting webpage (initial)',
				'Design gameplay (continue, need very detailed requirements)',
				'Design & visualize the NFTs',
				'Develop NFT miniting webpage (continue & complete)',
				'Design & visualize the NFTs (must finish at least all of NFTs for the first sale)',
				'Integrate all NFT materials with the minting page',
			],
			position: 'right',
		},
		{
			imgSrc: '/images/roadmap_3.svg',
			imgStyle: {
				width: '34.25rem',
				height: '31.2081rem',
				marginLeft: '6.5rem',
			},
			title: 'Q1 2023',
			descriptions: [
				'Audit all contracts & finish materials for IDO & NFT launch',
				'Develop admin page to monitor the all game: both tokens & NFTs (initial)',
				'Develop NFT marketplace (if team has plan to do it)',
				'Develop game',
				'Develop admin page to monitor the all game: both tokens & NFTs (continue)',
				'Develop game (continue)',
				'Develop NFT marketplace (continue & complete)',
				'Develop NFT marketplace (continue & complete)',
				'Develop admin page to monitor the all game: both tokens & NFTs (continue & complete all major components)',
				'Develop game (continue)',
				'Develop user profile & inventory functions inside marketplace webpage (initial)',
			],
			position: 'left',
		},
		{
			imgSrc: '/images/roadmap_4.svg',
			imgStyle: {
				width: '19.5963rem',
				height: '23.7294rem',
				marginRight: '6.8125rem',
			},
			title: 'Q2 2023',
			descriptions: [
				'Develop game (continue)',
				'Develop user profile & inventory functions inside marketplace webpage (continue)',
				'Develop game (continue)',
				'Develop game',
				'Develop user profile & inventory functions inside marketplace webpage (continue & complete)',
				'Game UAT',
				'Release the beta/testnet version of the game',
			],
			position: 'right',
		},
		{
			imgSrc: '/images/roadmap_5.svg',
			imgStyle: {
				width: '44.8125rem',
				height: '27.625rem',
			},
			title: 'Q3 2023',
			descriptions: [
				'Game UAT (continue)',
				'Prepapre for Google/Apple Store submission',
				'Preapre & deploy production system',
				'Submit to Google/Apple Store (without wallet function first, for easier to get approval)',
				'Develop admin page to monitor the all game: both tokens & NFTs (continue)',
				'Form devops & technical support team for 24/7 opearting & monitoring',
				'Develop in-game wallet functions (need to check the policies of Google/Apple Store at that moment carefully)',
				'Finish & submit the game version with wallet functionalities',
				'Build the analytics system to monitor in-game data (initial)',
			],
			position: 'left',
		},
		{
			imgSrc: '/images/roadmap_6.svg',
			imgStyle: {
				width: '27.3781rem',
				height: '25.125rem',
				marginRight: '6rem',
			},
			title: 'Q4 2023',
			descriptions: [
				'Build the analytics system to monitor in-game data (continue)',
				'Monitor & bug fixes',
				'Improve game: game event/tournament/competition/etc..',
				'Improve game: challenges/quests/etc.. system',
				'Improve game: other ideas',
			],
			position: 'right',
		},
	];

	return (
		<div className={styles['roadmap-section']} id='roadmap'>
			<div className='flex justify-center mb-[1.25rem]'>
				<p
					className={`text-[3.125rem] font-semibold  ${styles['gradient-text']}`}
				>
					Roadmap
				</p>
			</div>

			<div className={styles['timeline-container']}>
				{timelines.map((timeline, index) => (
					<TimelineSection key={index} timeline={timeline} />
				))}
			</div>
		</div>
	);
}

function TimelineSection({ timeline }: { timeline: Timeline }) {
	const { imgSrc, title, descriptions, position, imgStyle } = timeline;
	const flex = position === 'left' ? 'flex-row ' : 'flex-row-reverse ';
	const boxClass = `timeline-box-${position}`;
	const imgClass = `timeline-img-${position}`;
	const listTimelineClass = `timeline-list-${position}`;
	const timelinePointClass = `timeline-point-${position}`;
	return (
		<div className={`${flex}  ${styles['timeline-child-container']}`}>
			<div className={`${styles['timeline-box']} ${styles[boxClass]}`}>
				<p className={styles['timeline-title']}>{title}</p>
				<div
					className={`${styles[timelinePointClass]} ${styles['timeline-point']}`}
				/>
				<ul
					className={`${styles['timeline-list']} ${styles[listTimelineClass]} `}
				>
					{descriptions.map((description, index) => (
						<li key={index}>{description}</li>
					))}
				</ul>
			</div>
			<div className={`${styles['timeline-img']} ${styles[imgClass]}`}>
				<img src={imgSrc} style={imgStyle} />
			</div>
		</div>
	);
}
