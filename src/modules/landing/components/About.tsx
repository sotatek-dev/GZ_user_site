import LazyLoadImageComp from 'common/components/lazyLoadImage';
import styles from '../style/about.module.scss';
export default function About() {
	return (
		<section id='about'>
			<div className={styles['about-section']}>
				<div className={styles['text-container-section']}>
					<div className={styles['text-section']}>
						<h1
							className={`${styles['text-section_title']} ${styles['gradient-text']}`}
						>
							About
						</h1>
						<h2 className={styles['text-section_subtitle']}>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
							vulputate libero et velit interdum, ac aliquet odio mattis.
						</h2>
						<h2 className={styles['text-section_p']}>
							per inceptos himenaeos. Curabitur tempus urna at turpis
							condimentum lobortis. Ut commodo efficitur neque. Ut diam quam,
							semper iaculis condimentum ac, vestibulum eu nisl.Lorem ipsum
							dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero
							et velit interdum, ac aliquet odio mattis. Class aptent taciti
							sociosqu ad litora torquent per conubia nostra, per inceptos
							himenaeos. Curabitur tempus urna at turpis condimentum lobortis.
							Ut commodo efficitur neque. Ut diam quam, semper iaculis
							condimentum ac, vestibulum eu nisl.Lorem ipsum dolor sit amet,
							consectetur adipiscing elit.
							<br />
							<br />
							Per inceptos himenaeos. Curabitur tempus urna at turpis
							condimentum lobortis. Ut commodo efficitur neque. Ut diam quam,
							semper iaculis condimentum ac, vestibulum eu nisl.Lorem ipsum
							dolor sit amet, consectetur adipiscing elit.
						</h2>
					</div>
				</div>
				<div className={styles['img-section']}>
					<div className='w-[46.125rem]'>
						<LazyLoadImageComp
							src='/images/about-section.svg'
							alt='logo'
							height={604.52}
							width={766}
							placeholderSrc='/images/about-section.svg'
							effect='blur'
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
