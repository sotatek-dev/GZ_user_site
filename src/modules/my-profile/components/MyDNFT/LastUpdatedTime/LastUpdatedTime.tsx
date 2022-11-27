import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import { useEffect, useState } from 'react';
import { useAppSelector } from 'stores';

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);
dayjs.updateLocale('en', {
	relativeTime: {
		future: 'in %s',
		past: '%s ago',
		s: 'a few seconds',
		m: 'a minute',
		mm: '%d minutes',
		h: 'an hour',
		hh: '%d hours',
		d: 'a day',
		dd: '%d days',
		M: 'a month',
		MM: '%d months',
		y: 'a year',
		yy: '%d years',
	},
});

export default function LastUpdatedTime() {
	const lastUpdated = useAppSelector((state) => state.myProfile.lastUpdated);
	const [, forceUpdate] = useState({});

	useEffect(() => {
		const interval = setInterval(() => {
			forceUpdate({});
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	return <span>{dayjs.unix(lastUpdated).fromNow()}</span>;
}
