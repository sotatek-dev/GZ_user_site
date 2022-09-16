/* eslint-disable @next/next/no-img-element */
import React from 'react';
import styles from '../style/footer.module.scss';
export default function Footer() {
	return (
		<div className={styles['footer-section']}>
			<div className={styles['footer-container']}>
				<div className={styles['footer-1']}>
					<img
						src='images/logo.svg'
						alt='logo'
						className='w-[8.125rem] h-[8.125rem]'
					/>
					<div className={styles['footer-1_menu']}>
						<div className={styles['footer-1_menu_text']}>
							<div className={styles['footer-1_menu_text_list']}>
								<a
									href='#'
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
									href='#'
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
								<img src='/icons/arrow-right.svg' />
							</button>
							<button className={`${styles['footer-btn']} mt-[1.125rem]`}>
								<p className={styles['footer-btn_label']}>WHITE PAPER</p>
								<img src='/icons/arrow-right.svg' />
							</button>
						</div>
					</div>
				</div>

				<div className={styles['footer-2']}>
					<p className='opacity-50 text-white text-[0.875rem]'>
						©2022 Galactix Zone. All rights reserved
					</p>

					<div className='flex'>
						<a>
							<img
								src='/icons/facebook.svg'
								alt='facebook'
								className='w-[1.5625rem] h-[1.5625rem] ml-[1.8125rem]'
							/>
						</a>
						<a>
							<img
								src='/icons/telegram.svg'
								alt='telegram'
								className='w-[1.5625rem] h-[1.5625rem] ml-[1.8125rem]'
							/>
						</a>
						<a>
							<img
								src='/icons/twitter.svg'
								alt='twitter'
								className='w-[1.5625rem] h-[1.5625rem] ml-[1.8125rem]'
							/>
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}
