// eslint-disable-next-line @typescript-eslint/no-unused-vars
import BigNumber from 'bignumber.js';
import { now } from 'common/constants/constants';
// import { MINT_PHASE_ID } from 'modules/mint-dnft/constants';

const isNftClaimable = (
	claimableTime: BigNumber.Value
	// runningPhaseId: number
) => {
	return new BigNumber(now()).gt(claimableTime);

	// return (
	// 	new BigNumber(now()).gt(claimableTime) &&
	// 	runningPhaseId >= MINT_PHASE_ID.PRESALE_2
	// );
};

export default isNftClaimable;
