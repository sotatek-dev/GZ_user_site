import React from 'react';
import styles from '../style/landing.module.css';

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
				width: '45.1875rem',
				height: '41.0625rem',
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
				width: '32.4787rem',
				height: '29.375rem',
				marginRight: '2.9375rem',
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
				width: '36.1775rem',
				height: '34.9669rem',
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
				width: '20.4375rem',
				height: '23.375rem',
				marginRight: '6.875rem',
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
				width: '26.6875rem',
				height: '24.4525rem',
				marginLeft: '5.9375rem',
			},
			title: 'Q4 2023',
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
				width: '19.375rem',
				height: '19.375rem',
				marginRight: '5rem',
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
		<div className='mt-[4.5rem] w-[100%]'>
			<div className='flex items-center flex-col mb-[20px]'>
				<img
					src='/images/road_map_1.svg'
					className={`w-[1.9169rem] h-[4.375rem] object-contain`}
				/>

				<p
					className={`text-[3.125rem] font-semibold mt-[4.75rem] ${styles['gradient-text']}`}
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
	const flex = position === 'left' ? 'flex-row' : 'flex-row-reverse';
	const boxClass = `timeline-box-${position}`;
	const imgClass = `timeline-img-${position}`;
	const listTimelineClass = `timeline-list-${position}`;
	const timelinePointClass = `timeline-point-${position}`;
	return (
		<div className={`${flex} ${styles['timeline-child-container']}`}>
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
