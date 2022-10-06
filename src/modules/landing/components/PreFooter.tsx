import React from 'react';
import styles from '../style/pre-footer.module.scss';
export default function PreFooter() {
	return (
		<section id='gxz-token' className={styles['pre-footer-section']}>
			<div
				itemScope
				itemType='http://schema.org/Organization'
				className={styles['pre-footer-section_box']}
			>
				<h2
					itemProp='content'
					className={styles['pre-footer-section_box_content']}
				>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
					vulputate libero et velit interdum, ac aliquet odio mattis.
				</h2>
				<button
					itemProp='launch-app-btn'
					className={`${styles['laucher-btn']} w-[12.5rem] mt-[2.5rem]`}
				>
					Launch App
				</button>
			</div>
		</section>
	);
}
