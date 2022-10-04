import LazyLoadImageComp from 'common/components/lazyLoadImage';
import { ROUTES } from 'common/constants/constants';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useState } from 'react';
import styles from './../../style/header.module.scss';
const MenuComponent = dynamic(() => import('./Menu/index'));
export default function Header() {
	const [visible, setVisible] = useState(false);
	function onClose() {
		setVisible(false);
	}
	function showDrawer() {
		setVisible(true);
	}
	return (
		<header className={styles['header']} id='header'>
			<div className={styles['logo-box']}>
				<div className={styles['logo']}>
					<Link href={ROUTES.LANDING} passHref>
						<a>
							<LazyLoadImageComp
								src='images/logo.svg'
								alt='logo'
								height={86.38}
								width={90}
								placeholderSrc='images/logo.svg'
								effect='blur'
							/>
						</a>
					</Link>
				</div>
			</div>
			<div className={styles['menu-btn']}>
				<button onClick={() => showDrawer()}>
					<LazyLoadImageComp src='/icons/header_1.svg' alt='logo' />
				</button>
			</div>
			<ul id='menu' className={styles['menu']}>
				<li className={styles['menu-item']}>
					<Link href='#about' prefetch={false}>
						<a>About</a>
					</Link>
				</li>
				<li className={styles['menu-item']}>
					<Link href='#whitepaper' prefetch={false}>
						<a>Whitepaper</a>
					</Link>
				</li>
				<li className={styles['menu-item']}>
					<Link href='#roadmap' prefetch={false}>
						<a>Roadmap</a>
					</Link>
				</li>
				<li className={styles['menu-item']}>
					<Link href='#gxz-token' prefetch={false}>
						<a>GXZ Token</a>
					</Link>
				</li>
				<button className={styles['laucher-btn']}>Launch App</button>
			</ul>
			{visible && <MenuComponent visible={visible} onClose={onClose} />}
		</header>
	);
}
