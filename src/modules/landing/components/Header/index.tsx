import { ROUTES } from 'common/constants/constants';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useState } from 'react';
import styles from './../../style/header.module.scss';
import Image from 'next/image';
import LazyLoadCommon from 'common/components/lazyLoad';
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
							<LazyLoadCommon>
								<Image
									src='/images/logo.svg'
									alt='logo'
									height={86.38}
									width={90}
								/>
							</LazyLoadCommon>
						</a>
					</Link>
				</div>
			</div>
			<div className={styles['menu-btn']}>
				<button onClick={() => showDrawer()}>
					<LazyLoadCommon>
						<Image
							width={30}
							height={30}
							src='/icons/header_1.svg'
							alt='logo'
						/>
					</LazyLoadCommon>
				</button>
			</div>
			<ul
				itemScope
				itemType='http://schema.org/Organization'
				id='menu'
				className={styles['menu']}
			>
				<li itemProp='about' className={styles['menu-item']}>
					<Link href='#about' prefetch={false}>
						<a>About</a>
					</Link>
				</li>
				<li itemProp='whitepaper' className={styles['menu-item']}>
					<Link href='#whitepaper' prefetch={false}>
						<a>Whitepaper</a>
					</Link>
				</li>
				<li itemProp='roadmap' className={styles['menu-item']}>
					<Link href='#roadmap' prefetch={false}>
						<a>Roadmap</a>
					</Link>
				</li>
				<li itemProp='gxz-token' className={styles['menu-item']}>
					<Link href='#gxz-token' prefetch={false}>
						<a>GXZ Token</a>
					</Link>
				</li>
				<button itemProp='launch-app' className={styles['laucher-btn']}>
					Launch App
				</button>
			</ul>
			{visible && <MenuComponent visible={visible} onClose={onClose} />}
		</header>
	);
}
