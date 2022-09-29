import {
	billion,
	BUY,
	CLAIMABLE,
	million,
	now,
	UPCOMING,
} from 'common/constants/constants';
import moment from 'moment';
import {
	IPhaseStatistic,
	ITimelineMintNftState,
} from 'modules/mint-dnft/interfaces';
import {
	DECIMAL_PLACED,
	MINT_PHASE,
	MINT_PHASE_ID,
	MINT_PHASE_LABEL,
	MINT_PHASE_STATUS,
	TOKEN_DECIMAL,
} from 'modules/mint-dnft/constants';
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

export const formatNumber = (
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
