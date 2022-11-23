import { Skeleton } from 'antd';
import Countdown from 'common/components/countdown';
import myProfileConstants from 'modules/my-profile/constant';
import { useAppSelector } from 'stores';
import {
	BuyKeyState,
	getActualStartBuyKeyTime,
	getTimeLeftToBuyKey,
} from '../BuyInfo.helpers';

export default function BuyTimeCountdown() {
	const {
		startBuyKeyTime: startBuyKeyUnixTime,
		loading: isGetStartBuyKeyTime,
	} = useAppSelector((state) => state.keyDnft);
	const { systemSetting } = useAppSelector((state) => state.systemSetting);

	const isFetchStartBuyTime =
		startBuyKeyUnixTime == undefined ||
		(isGetStartBuyKeyTime === 'pending' && startBuyKeyUnixTime == undefined);

	if (isFetchStartBuyTime || systemSetting == undefined) {
		return (
			<>
				<Skeleton title={false} active style={{ marginTop: '1rem' }} />
				<br />
				<br />
				<Skeleton.Input size='large' active />
			</>
		);
	}

	const { actualStartBuyKeyTime, mintKeyDays } = getActualStartBuyKeyTime(
		startBuyKeyUnixTime,
		systemSetting?.mint_days
	);

	const { timeLeft, buyKeyStatus } = getTimeLeftToBuyKey(
		actualStartBuyKeyTime,
		mintKeyDays
	);

	const isOnBuyKeyTime = buyKeyStatus === BuyKeyState.Available;

	return (
		<Countdown
			descriptionStyle='!text-[#ffffff80] !text-[12px] !leading-4 '
			boxStyle='!bg-[#8080801a] !text-[white]'
			titleStyle='!font-normal !text-[#ffffff80]'
			customClass='mt-[20px] '
			title={
				isOnBuyKeyTime
					? myProfileConstants.ON_BUY_KEY_TIME
					: myProfileConstants.NOT_ON_BUY_KEY_TIME
			}
			millisecondsRemain={timeLeft}
		/>
	);
}
