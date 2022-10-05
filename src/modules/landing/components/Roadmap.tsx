import LazyLoadCommon from 'common/components/lazyLoad';
import Image from 'next/image';
import React from 'react';
import styles from '../style/roadmap.module.scss';

interface Timeline {
	imgSrc: string;
	imgStyle?: any;
	title: string;
	width: number;
	height: number;
	descriptions: string[];
	position: 'left' | 'right';
}

export default function Roadmap() {
	const timelines: Timeline[] = [
		{
			imgSrc: '/images/roadmap_1.svg',
			width: 560,
			height: 448,
			imgStyle: {
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
			width: 384,
			height: 432,
			imgStyle: {
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
			width: 544,
			height: 496,
			imgStyle: {
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
			width: 320,
			height: 384,
			imgStyle: {
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
			width: 720,
			height: 448,
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
			width: 432,
			height: 400,
			imgStyle: {
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
		<section className={styles['roadmap-section']} id='roadmap'>
			<div className='flex justify-center mb-[1.25rem]'>
				<h1
					className={`text-[3.125rem] font-semibold  ${styles['gradient-text']}`}
				>
					Roadmap
				</h1>
			</div>

			<div className={styles['timeline-container']}>
				{timelines.map((timeline, index) => (
					<TimelineSection key={index} timeline={timeline} />
				))}
			</div>
		</section>
	);
}

function TimelineSection({ timeline }: { timeline: Timeline }) {
	const { imgSrc, title, descriptions, position, imgStyle, width, height } =
		timeline;
	const flex = position === 'left' ? 'flex-row ' : 'flex-row-reverse ';
	const boxClass = `timeline-box-${position}`;
	const imgClass = `timeline-img-${position}`;
	const listTimelineClass = `timeline-list-${position}`;
	const timelinePointClass = `timeline-point-${position}`;
	return (
		<div className={`${flex}  ${styles['timeline-child-container']}`}>
			<div
				itemScope
				itemType='http://schema.org/Organization'
				className={`${styles['timeline-box']} ${styles[boxClass]}`}
			>
				<h1 itemProp='title' className={styles['timeline-title']}>
					{title}
				</h1>
				<div
					itemProp='point'
					className={`${styles[timelinePointClass]} ${styles['timeline-point']}`}
				/>
				<ul
					itemProp='description'
					className={`${styles['timeline-list']} ${styles[listTimelineClass]} `}
				>
					{descriptions.map((description, index) => (
						<li key={index}>{description}</li>
					))}
				</ul>
			</div>
			<div className={`${styles['timeline-img']} ${styles[imgClass]}`}>
				<div style={imgStyle}>
					<LazyLoadCommon>
						<Image height={height} width={width} src={imgSrc} alt='logo' />
					</LazyLoadCommon>
				</div>
			</div>
		</div>
	);
}
