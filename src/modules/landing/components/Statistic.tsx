import { getStatistics } from 'apis/landing';
import { numberWithDot } from 'common/helpers/number';
import React, { useEffect, useMemo, useState } from 'react';
import styles from '../style/statistic.module.scss';
import Image from 'next/image';
import LazyLoadCommon from 'common/components/lazyLoad';

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
				width: 59.49,
			},
			{
				label: 'Current Supply',
				value: statistic.currentSupply,
				icon: '/icons/statistic_2.svg',
				width: 59.97,
			},
			{
				label: 'Tokens Burned',
				value: statistic.tokensBurned,
				icon: '/icons/statistic_3.svg',
				width: 43.93,
			},
			{
				label: 'Total Holders',
				value: statistic.totalHolders,
				icon: '/icons/statistic_4.svg',
				width: 59.98,
			},
		];
	}, [statistic]);

	return (
		<section className={styles['statistic-container']}>
			<div className={`w-[1.9169rem] h-[4.375rem] object-contain`}>
				<LazyLoadCommon>
					<Image
						width={30.67}
						height={70}
						src='/images/roadmap_0.svg'
						alt='roadmap'
					/>
				</LazyLoadCommon>
			</div>
			<div className={styles['statistic-list']}>
				{statisticBoxes.map((box, index) => (
					<StatisticBox key={index} {...box} />
				))}
			</div>
		</section>
	);
}

function StatisticBox({
	label,
	value,
	icon,
	width,
}: {
	label: string;
	value: number;
	icon: string;
	width: number;
}) {
	return (
		<div
			itemScope
			itemType='http://schema.org/Organization'
			id='whitepaper'
			className={styles['statistic-box']}
		>
			<div className='w-[4.5rem] h-[4.5rem]'>
				<LazyLoadCommon>
					<Image width={width} height={60} src={icon} alt={icon} />
				</LazyLoadCommon>
			</div>
			<h1 itemProp='value' className={styles['statistic-box_value']}>
				{numberWithDot(value)}
			</h1>
			<h2 itemProp='label' className={styles['statistic-box_label']}>
				{label}
			</h2>
		</div>
	);
}
