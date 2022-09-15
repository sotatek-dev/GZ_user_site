import styles from '../style/landing.module.scss';
export default function About() {
	return (
		<div id='about'>
			<div className='flex flex-row justify-center items-center  mt-[6.875rem]'>
				<div className='w-[50%] flex justify-end'>
					<div className='flex-col w-[31rem] mr-[5rem] flex items-end'>
						<p
							className={`text-[3.125rem] inline-block text-right font-semibold mt-[4.75rem] ${styles['gradient-text']}`}
						>
							About
						</p>
						<p className='text-[#D47AF5] text-[1.375rem] font-medium text-right mt-[1.25rem]'>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
							vulputate libero et velit interdum, ac aliquet odio mattis.
						</p>
						<p className='text-[#FFFFFF] opacity-80 text-[0.875rem] text-right mt-[1.25rem]'>
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
						</p>
					</div>
				</div>
				<div className='w-[50%]'>
					<img src={'/images/about-section.svg'} className='w-[46.125rem]  ' />
				</div>
			</div>
		</div>
	);
}
