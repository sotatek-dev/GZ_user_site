import React from 'react';
import styles from '../style/statistic.module.scss';
export default function Statistic() {
	const totalSupply = '438.752.067';
	const currentSupply = '64.155.460';
	const tokensBurned = '61.247.933';
	const totalHolders = '2.626';

	const statisticBoxes = [
		{
			label: 'Total Supply',
			value: totalSupply,
			icon: '/icons/statistic_1.svg',
		},
		{
			label: 'Current Supply',
			value: currentSupply,
			icon: '/icons/statistic_2.svg',
		},
		{
			label: 'Tokens Burned',
			value: tokensBurned,
			icon: '/icons/statistic_3.svg',
		},
		{
			label: 'Total Holders',
			value: totalHolders,
			icon: '/icons/statistic_4.svg',
		},
	];

	return (
		<div className={styles['statistic-container']}>
			<img
				src='/images/roadmap_0.svg'
				className={`w-[1.9169rem] h-[4.375rem] object-contain`}
			/>
			<div className={styles['statistic-list']}>
				{statisticBoxes.map((box, index) => (
					<StatisticBox key={index} {...box} />
				))}
			</div>
		</div>
	);
}

function StatisticBox({
	label,
	value,
	icon,
}: {
	label: string;
	value: string;
	icon: string;
}) {
	return (
		<div className={styles['statistic-box']}>
			<img src={icon} className='w-[4.5rem] h-[4.5rem]' />
			<p className={styles['statistic-box_value']}>{value}</p>
			<p className={styles['statistic-box_label']}>{label}</p>
		</div>
	);
}
