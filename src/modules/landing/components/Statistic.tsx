import { getStatistics } from 'apis/landing';
import { numberWithDot } from 'common/helpers/number';
import React, { useEffect, useMemo, useState } from 'react';
import styles from '../style/statistic.module.scss';

interface IStatistic {
	totalSupply: number;
	currentSupply: number;
	tokensBurned: number;
	totalHolders: number;
}

export default function Statistic() {
	const defaultData: IStatistic = {
		totalSupply: 0,
		currentSupply: 0,
		tokensBurned: 0,
		totalHolders: 0,
	};
	const [statistic, setStatistic] = useState<IStatistic>(defaultData);

	useEffect(() => {
		const getStatistic = async () => {
			const [data, err] = await getStatistics();

			if (err) {
				setStatistic(defaultData);
			} else {
				const { current_supply, total_burned, total_holders, total_supply } =
					data.data;
				setStatistic({
					currentSupply: current_supply,
					totalSupply: total_supply,
					tokensBurned: total_burned,
					totalHolders: total_holders,
				});
			}
		};
		getStatistic();
	}, []);

	const statisticBoxes = useMemo(() => {
		return [
			{
				label: 'Total Supply',
				value: statistic.totalSupply,
				icon: '/icons/statistic_1.svg',
			},
			{
				label: 'Current Supply',
				value: statistic.currentSupply,
				icon: '/icons/statistic_2.svg',
			},
			{
				label: 'Tokens Burned',
				value: statistic.tokensBurned,
				icon: '/icons/statistic_3.svg',
			},
			{
				label: 'Total Holders',
				value: statistic.totalHolders,
				icon: '/icons/statistic_4.svg',
			},
		];
	}, [statistic]);

	return (
		<div className={styles['statistic-container']}>
			<img
				src='/images/roadmap_0.svg'
				className={`w-[1.9169rem] h-[4.375rem] object-contain`}
				alt='roadmap'
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
	value: number;
	icon: string;
}) {
	return (
		<div className={styles['statistic-box']}>
			<img src={icon} className='w-[4.5rem] h-[4.5rem]' alt={icon} />
			<p className={styles['statistic-box_value']}>{numberWithDot(value)}</p>
			<p className={styles['statistic-box_label']}>{label}</p>
		</div>
	);
}
