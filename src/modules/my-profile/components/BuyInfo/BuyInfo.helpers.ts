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
): {
	available: boolean;
	actualStartBuyKeyTime?: dayjs.Dayjs;
	mintKeyDays: number;
} => {
	const now = dayjs();

	const currentDate = now.get('date');
	const startBuyKeyTime = dayjs.unix(buyKeyStartTime);

	const maxDayInCurrentMonth = startBuyKeyTime.daysInMonth();
	const startBuyKeyDate = startBuyKeyTime.get('date');
	// If set mint_days = 31, but days_in_month is 28/29/30 days
	const maxAvaiMintKeyDays = Math.min(mintKeyDays, maxDayInCurrentMonth);

	if (now.isAfter(startBuyKeyTime) || now.isSame(startBuyKeyTime)) {
		if (currentDate > maxAvaiMintKeyDays) {
			return {
				available: false,
				actualStartBuyKeyTime: now.add(1, 'month').startOf('month'),
				mintKeyDays: maxAvaiMintKeyDays,
			};
		}

		return {
			available: true,
			mintKeyDays: maxAvaiMintKeyDays,
		};
	}

	// now < startBuyKeyTime
	if (startBuyKeyDate <= maxAvaiMintKeyDays) {
		return {
			available: false,
			actualStartBuyKeyTime: startBuyKeyTime,
			mintKeyDays: maxAvaiMintKeyDays,
		};
	}

	return {
		available: false,
		actualStartBuyKeyTime: startBuyKeyTime.add(1, 'month').startOf('month'),
		mintKeyDays: maxAvaiMintKeyDays,
	};
};

export const getTimeLeftToBuyKey = (
	available: boolean,
	mintKeyDays: number,
	startBuyKeyTime?: dayjs.Dayjs
) => {
	const now = dayjs();

	if (available) {
		return {
			buyKeyStatus: BuyKeyState.Available,
			timeLeft: dayjs()
				.startOf('month')
				.set('date', mintKeyDays + 1)
				.diff(now, 'second'),
		};
	}

	return {
		buyKeyStatus: BuyKeyState.Incomming,
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		timeLeft: startBuyKeyTime!.diff(now, 'second'),
	};
};
