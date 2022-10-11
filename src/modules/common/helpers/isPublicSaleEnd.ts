import BigNumber from 'bignumber.js';
import { minute, now } from 'common/constants/constants';

// todo: change to 10min for testing version
const isPublicSaleEnd = (publicSaleEndTime?: number) => {
	return publicSaleEndTime
		? // ? new BigNumber(7).times(day).plus(publicSaleEndTime).lt(now())
		  new BigNumber(10).times(minute).plus(publicSaleEndTime).lt(now())
		: false;
};

export default isPublicSaleEnd;
