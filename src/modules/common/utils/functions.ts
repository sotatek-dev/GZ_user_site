import {
	BUY,
	CLAIMABLE,
	LIST_PHASE_MINT_NFT,
	LIST_STATUS_TIME_LINE,
	UPCOMING,
} from 'common/constants/constants';
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
		(phase: IListPhaseMintNft) => phase.status === LIST_STATUS_TIME_LINE.RUNNING
	);
	const labelPhaseRunning = LIST_PHASE_MINT_NFT.find(
		(phase: { label: string; value: string }) =>
			phase.value === phaseRunning?.type
	)?.label;

	const upcomingPhase = listPhaseMintNft.find(
		(phase: IListPhaseMintNft) => phase.status === LIST_STATUS_TIME_LINE.PENDING
	);
	const upcomingPhaseLabel = LIST_PHASE_MINT_NFT.find(
		(phase: { label: string; value: string }) =>
			phase.value === upcomingPhase?.type
	)?.label;

	const publicPhase = listPhaseMintNft.find(
		(phase: IListPhaseMintNft) => phase.status === LIST_STATUS_TIME_LINE.PENDING && phase.type === 'PUBLIC'
	);

	return {
		timeLineMintNft,
		phaseRunning: {
			startTime: phaseRunning?.start_mint_time,
			endTime: phaseRunning?.end_mint_time,
			phase: labelPhaseRunning,
			id: phaseRunning?.order,
		},
		upcomingPhase: {
			startTime: upcomingPhase?.start_mint_time,
			phase: upcomingPhaseLabel,
		},
		publicPhase: {
			endTime: publicPhase?.end_mint_time,
		},
	};
};
