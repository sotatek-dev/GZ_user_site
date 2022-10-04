import React from 'react';
import styles from '../style/pre-footer.module.scss';
export default function PreFooter() {
	return (
		<section className={styles['pre-footer-section']}>
			<div className={styles['pre-footer-section_box']}>
				<h2 className={styles['pre-footer-section_box_content']}>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
					vulputate libero et velit interdum, ac aliquet odio mattis.
				</h2>
				<button className={`${styles['laucher-btn']} w-[12.5rem] mt-[2.5rem]`}>
					Launch App
				</button>
			</div>
		</section>
	);
}
