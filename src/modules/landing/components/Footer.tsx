/* eslint-disable @next/next/no-img-element */
import LazyLoadImageComp from 'common/components/lazyLoadImage';
import Link from 'next/link';
import React from 'react';
import styles from '../style/footer.module.scss';
type ListIntroduceProps = {
	id: number;
	content: {
		id: number;
		title: string;
		href: string;
	}[];
};
export default function Footer() {
	const listIntroduce: ListIntroduceProps[] = [
		{
			id: 1,
			content: [
				{
					id: 1,
					title: 'About',
					href: '#about',
				},
				{
					id: 2,
					title: 'Introduction',
					href: '#introduction',
				},
				{
					id: 3,
					title: 'Token',
					href: '#token',
				},
				{
					id: 4,
					title: 'Team',
					href: '#team',
				},
			],
		},
		{
			id: 2,
			content: [
				{
					id: 1,
					title: 'Contact',
					href: '#contact',
				},
				{
					id: 2,
					title: 'Roadmap',
					href: '#roadmap',
				},
				{
					id: 3,
					title: 'FAQ',
					href: '#faq',
				},
				{
					id: 4,
					title: 'Terms of service',
					href: '#terms-of-service',
				},
			],
		},
	];
	return (
		<footer className={styles['footer-section']}>
			<div className={styles['footer-container']}>
				<div className={styles['footer-1']}>
					<div className='w-[8.125rem] h-[8.125rem]'>
						<LazyLoadImageComp
							placeholderSrc='images/logo.svg'
							effect='blur'
							width={130}
							height={124.77}
							src='images/logo.svg'
							alt='logo'
						/>
					</div>
					<div className={styles['footer-1_menu']}>
						<div className={styles['footer-1_menu_text']}>
							{listIntroduce?.length > 0 &&
								listIntroduce.map((values) => {
									return (
										<div
											key={values.id}
											className={styles['footer-1_menu_text_list']}
										>
											{values?.content?.length > 0 &&
												values.content.map((valuesHref) => {
													return (
														<Link
															href={valuesHref.href}
															key={valuesHref.id}
															passHref
														>
															<a className='text-white font-semibold opacity-70 font-[14px]'>
																{valuesHref.title}
															</a>
														</Link>
													);
												})}
										</div>
									);
								})}
						</div>
						<div className={styles['footer-1_menu_btn']}>
							<button className={styles['footer-btn']}>
								<h1 className={styles['footer-btn_label']}>PITCH DECK</h1>
								<LazyLoadImageComp src='/icons/arrow-right.svg' alt='logo' />
							</button>
							<button className={`${styles['footer-btn']} mt-[1.125rem]`}>
								<h1 className={styles['footer-btn_label']}>WHITE PAPER</h1>
								<LazyLoadImageComp src='/icons/arrow-right.svg' alt='logo' />
							</button>
						</div>
					</div>
				</div>

				<div className={styles['footer-2']}>
					<h1 className='opacity-50 text-white text-[0.875rem]'>
						©2022 Galactix Zone. All rights reserved
					</h1>

					<div className='flex'>
						<a className='w-[1.5625rem] h-[1.5625rem] ml-[1.8125rem]'>
							<LazyLoadImageComp
								src='/icons/facebook.svg'
								alt='facebook'
								width={30}
								height={30}
								placeholderSrc='/icons/facebook.svg'
								effect='blur'
							/>
						</a>
						<a className='w-[1.5625rem] h-[1.5625rem] ml-[1.8125rem]'>
							<LazyLoadImageComp
								src='/icons/telegram.svg'
								alt='telegram'
								width={25}
								height={22.5}
								placeholderSrc='/icons/telegram.svg'
								effect='blur'
							/>
						</a>
						<a className='w-[1.5625rem] h-[1.5625rem] ml-[1.8125rem]'>
							<LazyLoadImageComp
								src='/icons/twitter.svg'
								alt='twitter'
								width={27.31}
								height={22.5}
								placeholderSrc='/icons/twitter.svg'
								effect='blur'
							/>
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
}
