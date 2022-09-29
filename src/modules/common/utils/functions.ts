import BigNumber from 'bignumber.js';
import {
	BSC_DECIMAL,
	BUY,
	CLAIMABLE,
	LIST_PHASE_MINT_NFT,
	UPCOMING,
} from 'common/constants/constants';
import { toNumber } from 'lodash';
import moment from 'moment';
import { IListPhaseMintNft } from 'pages/mint-dnft';

export const EllipsisMiddle = (account: string | null | undefined) => {
	return account ? account.slice(0, 6) + '...' + account.slice(-3) : '';
};

export const secondsToTime = (time: number) => {
	const days = Math.floor(time / (3600 * 24));
	const hours = Math.floor((time % (3600 * 24)) / 3600);
	const minutes = Math.floor((time % 3600) / 60);
	const seconds = Math.floor(time % 60);

	return { days, hours, minutes, seconds };
};

export const convertTimeLine = (
	startTime: number,
	endTime: number,
	timestampNow: number
) => {
	let status = UPCOMING;
	let timeCountDow = 0;
	if (startTime >= timestampNow) {
		status = UPCOMING;
		timeCountDow = startTime - timestampNow;
	}
	if (timestampNow > startTime && timestampNow <= endTime) {
		status = BUY;
		timeCountDow = endTime - timestampNow;
	} else if (timestampNow > endTime) {
		status = CLAIMABLE;
		timeCountDow = 0;
	} else if (timestampNow) {
		// end
	}
	return { status, timeCountDow };
};

export const convertTimeStampToDate = (date: number, formatDate?: string) => {
	return moment.unix(date).format(formatDate ? formatDate : 'MM-DD-YYYY hh:mm');
};

export const convertTimelineMintNft = (
	listPhaseMintNft: Array<IListPhaseMintNft>
) => {
	const timeLineMintNft = listPhaseMintNft.map((phase: IListPhaseMintNft) => {
		const { type, status, start_mint_time, end_mint_time } = phase;
		const label = LIST_PHASE_MINT_NFT.find(
			(item: { label: string; value: string }) => item.value === type
		)?.label;

		return {
			label,
			status,
			startMintTime: start_mint_time,
			endMintTime: end_mint_time,
		};
	});

	const phaseRunning = listPhaseMintNft.find(
		(phase: IListPhaseMintNft) => phase.status === 'RUNNING'
	);
	const labelPhaseRunning = LIST_PHASE_MINT_NFT.find(
		(phase: { label: string; value: string }) =>
			phase.value === phaseRunning?.type
	)?.label;
	return {
		timeLineMintNft,
		phaseRunning: {
			endTime: phaseRunning?.end_mint_time,
			phase: labelPhaseRunning,
		},
	};
};

export const convertHexToNumber = (data: string) => {
	return new BigNumber(data).toNumber();
};

export const toWei = (value: number | string, decimal = BSC_DECIMAL) => {
	BigNumber.config({ EXPONENTIAL_AT: 50 });
	return new BigNumber(value).multipliedBy(Math.pow(10, decimal)).toString();
};

export const fromWei = (value: string | number) => {
	const result = new BigNumber(value)
		.div(new BigNumber(10).exponentiatedBy(BSC_DECIMAL))
		.toString(); // divide by token decimal
	return JSON.parse(result);
};

export function formatNumber(value: string | number): string {
	const MIN_NUMBER = 0.0001;
	const SUPER_MIN = '< 0.0001';
	if (value === undefined) {
		return '';
	}
	const comps = String(value).split('.');

	if (
		comps.length > 2 ||
		!comps[0].match(/^[0-9,]*$/) ||
		(comps[1] && !comps[1].match(/^[0-9]*$/)) ||
		value === '.' ||
		value === '-.'
	) {
		return '';
	}

	let suffix = '';
	if (comps.length === 1) {
		suffix = '.00';
	}
	if (comps.length === 2) {
		suffix = '.' + (comps[1] || '0');
	}
	while (suffix.length > 3 && suffix[suffix.length - 1] === '0') {
		suffix = suffix.substring(0, suffix.length - 1);
	}

	const formatted = [];
	let whole = comps[0].replace(/[^0-9]/g, '');
	while (whole.substring(0, 1) === '0') {
		whole = whole.substring(1);
	}

	if (whole === '') {
		whole = '0';
		if (
			toNumber(whole + suffix) !== 0 &&
			toNumber(whole + suffix) < MIN_NUMBER
		) {
			return SUPER_MIN;
		}
	}

	const roundNumber = Number(
		Math.floor(toNumber('0' + suffix) * 10000) / 10000
	);

	if (roundNumber) {
		suffix = '.' + String(roundNumber).split('.')[1];
	} else {
		suffix = '';
	}

	while (whole.length) {
		if (whole.length <= 3) {
			formatted.unshift(whole);
			break;
		} else {
			const index = whole.length - 3;
			formatted.unshift(whole.substring(index));
			whole = whole.substring(0, index);
		}
	}

	return formatted.join(',') + suffix;
}
