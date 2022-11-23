import classNames from 'classnames';
import styles from './style.module.scss';

export default function PageLoadIndicator({
	isRouterChange,
}: {
	isRouterChange: boolean;
}) {
	const cln = classNames(
		`absolute inline-block left-1/2 top-5 w-10 h-10 aspect-square bg-[#0E1A2B] rounded-md p-2 shadow-lg transition-opacity duration-300 hover:opacity-0 pointer-events-none delay-300 z-10`,
		{ 'opacity-0': !isRouterChange }
	);

	return (
		<span className={cln}>
			<span className={styles.spinner} />
		</span>
	);
}
