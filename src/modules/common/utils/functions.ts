import {
	BUY,
	CLAIMABLE,
	LIST_PHASE_MINT_NFT,
	LIST_STATUS_TIME_LINE,
	UPCOMING,
} from 'common/constants/constants';
import moment from 'moment';
import {
	IListPhaseMintNft,
	IPhaseStatistic,
} from 'modules/mint-dnft/interfaces';
import {
	MINT_PHASE,
	MINT_PHASE_ID,
	MINT_PHASE_LABEL,
} from 'modules/mint-dnft/constants';

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
		(phase: IListPhaseMintNft) => phase.status === LIST_STATUS_TIME_LINE.RUNNING
	);
	const labelPhaseRunning = LIST_PHASE_MINT_NFT.find(
		(phase: { label: string; value: string }) =>
			phase.value === phaseRunning?.type
	)?.label;

	return {
		timeLineMintNft,
		phaseRunning: {
			startTime: phaseRunning?.start_mint_time,
			endTime: phaseRunning?.end_mint_time,
			phase: labelPhaseRunning,
			id: phaseRunning?.order,
		},
	};
};
