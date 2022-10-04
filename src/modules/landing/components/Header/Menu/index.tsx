import { Drawer } from 'antd';
import LazyLoadImageComp from 'common/components/lazyLoadImage';
import Link from 'next/link';
import styles from './../../../style/header.module.scss';
const MenuComponent = ({
	onClose,
	visible,
}: {
	onClose: () => void;
	visible: boolean;
}) => {
	return (
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
						<div className={styles['logo']}>
							<LazyLoadImageComp
								src='images/logo.svg'
								alt='logo'
								width={50}
								height={48}
								placeholderSrc='images/logo.svg'
								effect='blur'
							/>
						</div>
					</div>
					<div className={styles['menu-btn']}>
						<button onClick={() => onClose()}>
							<LazyLoadImageComp src='/icons/header_2.svg' alt='logo' />
						</button>
					</div>
				</div>

				<ul className={styles['popup-menu_menu']}>
					<li
						onClick={() => {
							onClose();
						}}
						className={styles['menu-item']}
					>
						<Link href='#about' prefetch={false}>
							<a>About</a>
						</Link>
					</li>
					<li
						onClick={() => {
							onClose();
						}}
						className={styles['menu-item']}
					>
						<Link href='#whitepaper' prefetch={false}>
							<a>Whitepaper</a>
						</Link>
					</li>
					<li
						onClick={() => {
							onClose();
						}}
						className={styles['menu-item']}
					>
						<Link href='#roadmap' prefetch={false}>
							<a>Roadmap</a>
						</Link>
					</li>
					<li
						onClick={() => {
							onClose();
						}}
						className={styles['menu-item']}
					>
						<Link href='#gxz-token' prefetch={false}>
							<a>GXZ Token</a>
						</Link>
					</li>
					<button className={`${styles['laucher-btn']}`}>Launch App</button>
				</ul>
			</div>
		</Drawer>
	);
};
export default MenuComponent;
