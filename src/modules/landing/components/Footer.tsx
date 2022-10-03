/* eslint-disable @next/next/no-img-element */
import LazyLoadImageComp from 'common/components/lazyLoadImage';
import React from 'react';
import styles from '../style/footer.module.scss';
export default function Footer() {
	return (
		<div className={styles['footer-section']}>
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
							<div className={styles['footer-1_menu_text_list']}>
								<a
									href='#about'
									className='text-white font-semibold opacity-70 font-[14px]'
								>
									About
								</a>
								<a
									href='#'
									className='text-white font-semibold opacity-70 font-[14px]'
								>
									Introduction
								</a>
								<a
									href='#'
									className='text-white font-semibold opacity-70 font-[14px]'
								>
									Token
								</a>
								<a
									href='#'
									className='text-white font-semibold opacity-70 font-[14px]'
								>
									Team
								</a>
							</div>

							<div className={styles['footer-1_menu_text_list']}>
								<a
									href='#'
									className='text-white font-semibold opacity-70 font-[14px]'
								>
									Contact
								</a>
								<a
									href='#roadmap'
									className='text-white font-semibold opacity-70 font-[14px]'
								>
									Roadmap
								</a>
								<a
									href='#'
									className='text-white font-semibold opacity-70 font-[14px]'
								>
									FAQ
								</a>
								<a
									href='#'
									className='text-white font-semibold opacity-70 font-[14px]'
								>
									Terms of service
								</a>
							</div>
						</div>
						<div className={styles['footer-1_menu_btn']}>
							<button className={styles['footer-btn']}>
								<p className={styles['footer-btn_label']}>PITCH DECK</p>
								<LazyLoadImageComp src='/icons/arrow-right.svg' alt='logo' />
							</button>
							<button className={`${styles['footer-btn']} mt-[1.125rem]`}>
								<p className={styles['footer-btn_label']}>WHITE PAPER</p>
								<LazyLoadImageComp src='/icons/arrow-right.svg' alt='logo' />
							</button>
						</div>
					</div>
				</div>

				<div className={styles['footer-2']}>
					<p className='opacity-50 text-white text-[0.875rem]'>
						©2022 Galactix Zone. All rights reserved
					</p>

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
		</div>
	);
}
