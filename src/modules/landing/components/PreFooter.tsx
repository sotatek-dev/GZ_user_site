import React from 'react';
import styles from '../style/landing.module.css';
export default function PreFooter() {
	return (
		<div
			className='w-[100%] h-[28.125rem] flex justify-center items-center '
			style={{
				backgroundImage: 'url(/images/footer_1.svg)',
				backgroundPosition: 'center',
				backgroundSize: 'contain',
				backgroundRepeat: 'no-repeat',
			}}
		>
			<div className='px-[19.75rem]  flex flex-col items-center'>
				<p className='font-medium text-[1.875rem] text-[#D47AF5] text-center leading-[2.8125rem]'>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
					vulputate libero et velit interdum, ac aliquet odio mattis.
				</p>
				<button className={`${styles['laucher-btn']} w-[12.5rem] mt-[2.5rem]`}>
					Launch App
				</button>
			</div>
		</div>
	);
}
