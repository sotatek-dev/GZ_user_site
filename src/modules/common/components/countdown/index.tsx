import { secondsToTime } from 'common/utils/functions';
import { capitalize, get, keys, map } from 'lodash';
import { FC, memo, useEffect, useState } from 'react';

interface ICountdownProps {
	millisecondsRemain: number;
	title?: string;
	customClass?: string;
	boxStyle?: string;
	titleStyle?: string;
	descriptionStyle?: string;
	callBackApi?: () => void;
}

const Countdown: FC<ICountdownProps> = ({
	millisecondsRemain,
	title = 'You can buy tokens in',
	customClass,
	boxStyle,
	titleStyle,
	descriptionStyle,
	callBackApi,
}) => {
	const [secCountDown, setSecCountDown] = useState<number>(millisecondsRemain);

	useEffect(() => {
		if (millisecondsRemain > 0) {
			setSecCountDown(millisecondsRemain);
		}
	}, [millisecondsRemain]);

	const timeRemain = secondsToTime(secCountDown > 0 ? secCountDown : 0);

	useEffect(() => {
		const intervalId = setInterval(() => {
			setSecCountDown((seconds: number) => {
				if (seconds > 0) return seconds - 1;
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
				{map(keys(timeRemain), (key: string, index) => (
					<div className={`box ${boxStyle}`} key={index}>
						{addZeroToHead(get(timeRemain, key))}
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
