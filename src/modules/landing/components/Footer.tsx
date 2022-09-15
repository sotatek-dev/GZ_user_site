/* eslint-disable @next/next/no-img-element */
import React from 'react';
import styles from '../style/landing.module.scss';
export default function Footer() {
	return (
		<div className='w-[100vw] h-[21.875rem] flex justify-center items-end  bg-[#071423]'>
			<div className='m-w-[100%] h-[100%] pt-[3.875rem] mx-[9.375rem] flex flex-col'>
				<div className='flex flex-row'>
					<img
						src='images/logo.svg'
						alt='logo'
						className='w-[8.125rem] h-[8.125rem]'
					/>
					<div className='flex flex-row justify-around flex-grow ml-[10rem]'>
						<div className='flex flex-col justify-between  w-[10rem] h-[10rem]  mr-[8.125rem]'>
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

						<div className='flex flex-col justify-between w-[10rem] h-[10rem]  mr-[8.125rem]'>
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
						<div className='flex flex-col w-[10rem]'>
							<button className={styles['footer-btn']}>
								<p className={styles['footer-btn_label']}>PITCH DECK</p>{' '}
								<img src='/icons/arrow-right.svg' />
							</button>
							<button className={`${styles['footer-btn']} mt-[1.125rem]`}>
								<p className={styles['footer-btn_label']}>WHITE PAPER</p>{' '}
								<img src='/icons/arrow-right.svg' />
							</button>
						</div>
					</div>
				</div>

				<div
					className='flex justify-between items-center mt-[3rem] flex-grow'
					style={{
						borderTop: '1px solid rgba(255, 255, 255, 0.2)',
					}}
				>
					<p className='opacity-50 text-white text-[0.875rem] font-medium'>
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
