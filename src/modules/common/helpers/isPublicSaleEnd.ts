// import BigNumber from 'bignumber.js';
// import { day, now } from 'common/constants/constants';

// TODO: public sale end is true (temporary)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const isPublicSaleEnd = (publicSaleEndTime?: number) => {
	return true;

	// return publicSaleEndTime
	// 	? new BigNumber(7).times(day).plus(publicSaleEndTime).lt(now())
	// 	: //   new BigNumber(10).times(minute).plus(publicSaleEndTime).lt(now())
	// 	  false;
};

export default isPublicSaleEnd;
