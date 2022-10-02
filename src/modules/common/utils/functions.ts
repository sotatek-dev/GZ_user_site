import {
	billion,
	BSC_DECIMAL,
	BUY,
	CLAIMABLE,
	END,
	million,
	now,
	UPCOMING,
} from 'common/constants/constants';
import { toNumber } from 'lodash';
import moment from 'moment';
import {
	IPhaseStatistic,
	ITimelineMintNftState,
} from 'modules/mintDnft/interfaces';
import {
	DECIMAL_PLACED,
	MINT_PHASE,
	MINT_PHASE_ID,
	MINT_PHASE_LABEL,
	MINT_PHASE_STATUS,
	TOKEN_DECIMAL,
} from 'modules/mintDnft/constants';
import BigNumber from 'bignumber.js';
import { constants } from 'ethers';

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
	timestampNow: number,
	currentTimeLine: string
) => {
	let status = UPCOMING;
	let timeCountDow = -1;
	if (startTime >= timestampNow) {
		status = UPCOMING;
		timeCountDow = startTime - timestampNow;
	} else if (timestampNow > startTime && timestampNow <= endTime) {
		status = BUY;
		timeCountDow = endTime - timestampNow;
	} else if (timestampNow > endTime && currentTimeLine !== 'end') {
		status = CLAIMABLE;
		timeCountDow = -1;
	} else {
		status = END;
		timeCountDow = -1;
	}
	return { status, timeCountDow };
};

export const convertTimeStampToDate = (date: number, formatDate?: string) => {
	return moment.unix(date).format(formatDate ? formatDate : 'MM-DD-YYYY hh:mm');
};

export const convertMiliSecondTimestampToDate = (
	date: number,
	formatDate?: string
) => {
	return moment(date).format(formatDate ? formatDate : 'MM-DD-YYYY hh:mm');
};

export const geMintPhaseType = (id: MINT_PHASE_ID): MINT_PHASE | void => {
	if (id === MINT_PHASE_ID.WHITE_LIST) return MINT_PHASE.WHITE_LIST;
	if (id === MINT_PHASE_ID.PRESALE_1) return MINT_PHASE.PRESALE_1;
	if (id === MINT_PHASE_ID.PRESALE_2) return MINT_PHASE.PRESALE_2;
	if (id === MINT_PHASE_ID.PUBLIC) return MINT_PHASE.PUBLIC;
};

export const getMintPhaseLabel = (
	id: MINT_PHASE_ID
): MINT_PHASE_LABEL | void => {
	if (id === MINT_PHASE_ID.WHITE_LIST) return MINT_PHASE_LABEL.WHITE_LIST;
	if (id === MINT_PHASE_ID.PRESALE_1) return MINT_PHASE_LABEL.PRESALE_1;
	if (id === MINT_PHASE_ID.PRESALE_2) return MINT_PHASE_LABEL.PRESALE_2;
	if (id === MINT_PHASE_ID.PUBLIC) return MINT_PHASE_LABEL.PUBLIC;
};

export const getMintPhaseStatus = (
	phase: IPhaseStatistic
): MINT_PHASE_STATUS => {
	if (phase.endTime < now()) {
		return MINT_PHASE_STATUS.DONE;
	} else if (phase.endTime > now() && phase.startTime < now()) {
		return MINT_PHASE_STATUS.RUNNING;
	} else {
		return MINT_PHASE_STATUS.PENDING;
	}
};

export const convertTimelineMintNft = (
	listPhase: Array<IPhaseStatistic>
): Array<ITimelineMintNftState> => {
	return listPhase.map((phase: IPhaseStatistic) => {
		const { id, startTime, endTime } = phase;
		return {
			label: getMintPhaseLabel(id) || '',
			status: getMintPhaseStatus(phase),
			startMintTime: startTime,
			endMintTime: endTime,
		};
	});
};

export const formatBigNumber = (
	number: BigNumber.Value,
	decimalPlaced = DECIMAL_PLACED,
	noDataString = '-'
): string => {
	const n = new BigNumber(number);
	const nabs = n.abs();

	if (n.isNaN()) {
		return noDataString;
	}
	if (n.eq(0)) {
		return '0';
	}

	const negative = n.lt(0) ? '-' : '';

	if (nabs.gte(billion)) {
		return `${negative}${nabs.div(billion).dp(decimalPlaced).toString(10)}B`;
	} else if (nabs.gte(million) && nabs.lt(billion)) {
		return `${negative}${nabs.div(million).dp(decimalPlaced).toString(10)}M`;
	}

	return `${negative}${nabs.dp(decimalPlaced).toString(10)}`;
};

export const isApproved = (allowance?: BigNumber.Value): boolean => {
	return (
		!!allowance &&
		new BigNumber(allowance).gt(
			new BigNumber(constants.MaxUint256.toString())
				.div(TOKEN_DECIMAL)
				.idiv(2)
				.dp(0)
		)
	);
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
