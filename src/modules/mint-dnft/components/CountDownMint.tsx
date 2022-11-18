import React, { useMemo } from 'react';
import { MINT_PHASE } from 'modules/mint-dnft/constants';
import { now, second } from 'common/constants/constants';
import Countdown from 'common/components/countdown';
import { getMintPhaseLabel } from 'common/utils/functions';
import BigNumber from 'bignumber.js';
import { useAppSelector } from 'stores';

const CountDownMint = () => {
	const { runningPhase, upcomingPhase, publicPhase } = useAppSelector(
		(state) => state.mintDnft
	);

	const data = useMemo(() => {
		if (
			runningPhase &&
			runningPhase.endTime > now() &&
			runningPhase.startTime < now()
		) {
			return {
				title: `Minting phase for ${getMintPhaseLabel(runningPhase.id)} end in`,
				millisecondsRemain:
					new BigNumber(runningPhase.endTime)
						.minus(now())
						.div(second)
						.toNumber() || -1,
			};
		} else if (upcomingPhase && upcomingPhase.startTime > now()) {
			return {
				title: 'You can mint dNFT in',
				millisecondsRemain:
					new BigNumber(upcomingPhase.startTime)
						.minus(now())
						.div(second)
						.toNumber() || -1,
			};
		} else if (publicPhase && publicPhase.endTime < now()) {
			return { title: 'Presale for dNFT is ended', millisecondsRemain: -1 };
		} else {
			return { title: 'Presale for dNFT is ended', millisecondsRemain: -1 };
		}
	}, [runningPhase, upcomingPhase, publicPhase]);

	return (
		<>
			{runningPhase?.type !== MINT_PHASE.PUBLIC && (
				<Countdown
					customClass={'grow flex flex-col items-center desktop:items-start'}
					{...data}
				/>
			)}
		</>
	);
};

export default CountDownMint;
