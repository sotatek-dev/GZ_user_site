import dayjs from 'dayjs';

export enum BuyKeyState {
	Incomming,
	Available,
}

/**
 * Calculate start buy key time base on minting days setting & available time
 * @param startBuyKeyTime from this tmme, `Minting key` feature will be online, in `Unix timestamp`
 */
export const getActualStartBuyKeyTime = (
	buyKeyStartTime: number,
	mintKeyDays: number
) => {
	const startBuyKeyTime = dayjs.unix(buyKeyStartTime);

	const maxDayInCurrentMonth = startBuyKeyTime.daysInMonth();
	const startBuyKeyDate = startBuyKeyTime.date();

	// If set mint_days = 31, but days_in_month is 28/29/30 days
	let maxAvaiMintKeyDays = Math.min(mintKeyDays, maxDayInCurrentMonth);

	if (startBuyKeyDate <= maxAvaiMintKeyDays) {
		return {
			actualStartBuyKeyTime: startBuyKeyTime,
			mintKeyDays: maxAvaiMintKeyDays,
		};
	}

	// Start buy key time will be set for start time of next month
	const nextMonthStartTime = startBuyKeyTime.add(1, 'month').startOf('month');
	maxAvaiMintKeyDays = Math.min(mintKeyDays, nextMonthStartTime.daysInMonth());

	return {
		actualStartBuyKeyTime: nextMonthStartTime,
		mintKeyDays: maxAvaiMintKeyDays,
	};
};

export const getTimeLeftToBuyKey = (
	startBuyKeyTime: dayjs.Dayjs,
	mintKeyDays: number
) => {
	const now = dayjs();

	if (now.isBefore(startBuyKeyTime)) {
		return {
			buyKeyStatus: BuyKeyState.Incomming,
			timeLeft: startBuyKeyTime.diff(now, 'second'),
		};
	}

	if (now.date() > mintKeyDays) {
		const nextMintKeyStartTime = now.add(1, 'month').startOf('month');
		return {
			buyKeyStatus: BuyKeyState.Incomming,
			timeLeft: nextMintKeyStartTime.diff(now),
		};
	}

	return {
		buyKeyStatus: BuyKeyState.Available,
		timeLeft: now.startOf('month').add(mintKeyDays, 'days').diff(now, 'second'),
	};
};
