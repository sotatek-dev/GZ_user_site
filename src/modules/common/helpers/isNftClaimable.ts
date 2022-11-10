// eslint-disable-next-line @typescript-eslint/no-unused-vars
import BigNumber from 'bignumber.js';
import { now } from 'common/constants/constants';

const isNftClaimable = (claimableTime: BigNumber.Value) => {
	return new BigNumber(now()).gt(claimableTime);
};

export default isNftClaimable;
