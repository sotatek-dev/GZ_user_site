import BigNumber from 'bignumber.js';
import { day, now } from 'common/constants/constants';

const isPublicSaleEnd = (publicSaleEndTime?: number) => {
	return publicSaleEndTime
		? new BigNumber(7).times(day).plus(publicSaleEndTime).lt(now())
		: false;
};

export default isPublicSaleEnd;
