import { Drawer } from 'antd';
import { useState } from 'react';
import styles from '../style/header.module.scss';
export default function Header() {
	const [visible, setVisible] = useState(false);

	function onClose() {
		setVisible(false);
	}

	function showDrawer() {
		setVisible(true);
	}

	return (
		<div className={styles['header']} id='header'>
			<div className={styles['logo-box']}>
				<img src='images/logo.svg' className={styles['logo']} alt='logo' />
			</div>
			<div className={styles['menu-btn']}>
				<button onClick={() => showDrawer()}>
					<img src='/icons/header_1.svg' />
				</button>
			</div>
			<ul id='menu' className={styles['menu']}>
				<li className={styles['menu-item']}>
					<a href='#about'>About</a>
				</li>
				<li className={styles['menu-item']}>
					<a href='#'>Whitepaper</a>
				</li>
				<li className={styles['menu-item']}>
					<a href='#roadmap'>Roadmap</a>
				</li>
				<li className={styles['menu-item']}>
					<a href='#'>GXZ Token</a>
				</li>
				<button className={`${styles['laucher-btn']}`}>Launch App</button>
			</ul>
			<Drawer
				className={styles['drawer']}
				width={'100vw'}
				placement='left'
				drawerStyle={{
					backgroundColor: '#0c1e32',
				}}
				bodyStyle={{ padding: 0 }}
				closable={false}
				onClose={() => {
					onClose();
				}}
				visible={visible}
			>
				<div className={styles['popup-menu']}>
					<div className={styles['header']} id='header'>
						{/* <PopupMenu /> */}
						<div className={styles['logo-box']}>
							<img
								src='images/logo.svg'
								className={styles['logo']}
								alt='logo'
							/>
						</div>
						<div className={styles['menu-btn']}>
							<button onClick={() => onClose()}>
								<img src='/icons/header_2.svg' />
							</button>
						</div>
					</div>

					<ul className={styles['popup-menu_menu']}>
						<li className={styles['menu-item']}>
							<a
								onClick={() => {
									onClose();
								}}
								href='#about'
							>
								About
							</a>
						</li>
						<li
							onClick={() => {
								onClose();
							}}
							className={styles['menu-item']}
						>
							<a href='#'>Whitepaper</a>
						</li>
						<li
							onClick={() => {
								onClose();
							}}
							className={styles['menu-item']}
						>
							<a href='#roadmap'>Roadmap</a>
						</li>
						<li
							onClick={() => {
								onClose();
							}}
							className={styles['menu-item']}
						>
							<a href='#'>GXZ Token</a>
						</li>
						<button className={`${styles['laucher-btn']}`}>Launch App</button>
					</ul>
				</div>
			</Drawer>
		</div>
	);
}
