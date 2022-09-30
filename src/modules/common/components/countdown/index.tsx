import { secondsToTime } from 'common/utils/functions';
import { capitalize, get, keys, map } from 'lodash';
import { FC, memo, useEffect, useState } from 'react';

interface ICountdownProps {
	millisecondsRemain?: number;
	title?: string;
	customClass?: string;
	boxStyle?: string;
	titleStyle?: string;
	descriptionStyle?: string;
	callBackApi?: () => void;
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
	boxStyle,
	titleStyle,
	descriptionStyle,
	callBackApi,
}) => {
	const [secCountDown, setSecCountDown] = useState<number>(millisecondsRemain);
	const [timeRemain, settimeRemain] = useState<ITimeRemain>(timeRemainDefault);

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

	useEffect(() => {
		if (secCountDown === 0 && callBackApi) {
			callBackApi();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [secCountDown]);

	return (
		<div className={customClass}>
			{title && <div className={`font-bold pb-4 ${titleStyle}`}>{title}</div>}
			<div className='countdown'>
				{map(keys(timeRemain), (key: string) => (
					<div className={`box ${boxStyle}`}>
						{addZeroToHead(get(timeRemain, key) || 0)}
						<div className={`description ${descriptionStyle}`}>
							{capitalize(key)}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default memo(Countdown);

function addZeroToHead(number: number) {
	return `0${number}`.slice(-2);
}
