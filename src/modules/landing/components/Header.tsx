import styles from '../style/landing.module.css';
export default function Header() {
	return (
		<div className='h-[6.875rem] w-[100%] flex justify-between	' id='header'>
			<div className='relative h-[100%] w-[5.625rem] ml-[9.375rem]'>
				<img
					src='images/logo.svg'
					className='w-[100%] h-[5.3987rem] mb-[0.2263rem] bottom-0 absolute'
					alt='logo'
				/>
			</div>
			<ul
				id='menu'
				className='laptop:flex items-center pt-[2.8125rem] mr-[9.375rem] mobile:hidden'
			>
				<li className={styles['menu-item']}>About</li>
				<li className={styles['menu-item']}>Whitepaper</li>
				<li className={styles['menu-item']}>Roadmap</li>
				<li className={styles['menu-item']}>GXZ Token</li>
				<button className={`${styles['laucher-btn']}`}>Launch App</button>
			</ul>
		</div>
	);
}
