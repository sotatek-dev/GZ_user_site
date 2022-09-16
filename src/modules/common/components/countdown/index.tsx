import { secondsToTime } from 'common/utils/functions';
import { FC, memo, useEffect, useState } from 'react';

interface ICountdownProps {
	millisecondsRemain?: number;
	title?: string;
	customClass?: string;
}

interface ITimeRemain {
	days: number | undefined;
	hours: number | undefined;
	minutes: number | undefined;
	seconds: number | undefined;
}

const timeRemainDefault = {
	days: 0,
	hours: 0,
	minutes: 0,
	seconds: 0,
};

const Countdown: FC<ICountdownProps> = ({
	millisecondsRemain = 1663344791 - 1663153149,
	title = 'You can buy tokens in',
	customClass,
}) => {
	const [secCountDown, setSecCountDown] = useState<number>(millisecondsRemain);
	const [timeRemain, settimeRemain] = useState<ITimeRemain>(timeRemainDefault);
	const { days, hours, minutes, seconds } = timeRemain;

	useEffect(() => {
		setSecCountDown(millisecondsRemain);
	}, [millisecondsRemain]);

	useEffect(() => {
		const timeRemain = secondsToTime(secCountDown);
		settimeRemain(timeRemain);
	}, [secCountDown]);

	useEffect(() => {
		const intervalId = setInterval(() => {
			setSecCountDown((seconds: number) => {
				if (seconds !== 0) return seconds - 1;
				clearInterval(intervalId);
				return seconds;
			});
		}, 1000);

		return () => clearInterval(intervalId);
	}, []);

	return (
		<div className={customClass}>
			{title && <div className='font-bold pb-4'>{title}</div>}
			<div className='countdown'>
				<div className='box'>
					{days}
					<div className='description'>Days</div>
				</div>
				<div className='box'>
					{hours}
					<div className='description'>Hours</div>
				</div>
				<div className='box'>
					{minutes}
					<div className='description'>Minutes</div>
				</div>
				<div className='box'>
					{seconds}
					<div className='description'>Seconds</div>
				</div>
			</div>
		</div>
	);
};

export default memo(Countdown);
