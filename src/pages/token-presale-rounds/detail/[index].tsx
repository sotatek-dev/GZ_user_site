import { Divider, Progress } from 'antd';
import { getDetailTokenSaleRound } from 'apis/tokenSaleRounds';
import BoxPool from 'common/components/boxPool';
import Button from 'common/components/button';
import Countdown from 'common/components/countdown';
import CustomRadio from 'common/components/radio';
import Stepper from 'common/components/steps';
import { TIME_LINE_SALE_ROUND, UPCOMING } from 'common/constants/constants';
import {
	convertTimeLine,
	convertTimeStampToDate,
} from 'common/utils/functions';
import { get, isEmpty } from 'lodash';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export const selectList = [
	{
		label: (
			<div className='select-card-wrapper'>
				{/* <img src={images.UsdtCoinIcon} alt='usdt' /> */}
				BUSD
			</div>
		),
		value: 'BUSD',
	},
	{
		label: (
			<div className='select-card-wrapper'>
				{/* <img src={images.usdtIcon} alt='usdt' /> */}
				BNB
			</div>
		),
		value: 'BNB',
	},
];

const TokenSaleRoundDetail = () => {
	const router = useRouter();
	const {
		query: { index = '' },
	} = router;

	const [detailSaleRound, setDetailSaleRound] = useState({});
	// console.log('detailSaleRound', detailSaleRound);
	const [statusTimeLine, setStatusTimeLine] = useState<string>(UPCOMING);
	const [timeCountDow, setTimeCountDow] = useState<number>(0);
	// console.log('timeCountDow', timeCountDow);
	const { start_time = 0, end_time = 0 } = get(detailSaleRound, 'buy_time', {});
	// const { buy_time: {start_time, end_time} } = detailSaleRound;

	useEffect(() => {
		const getDetailSaleRound = async () => {
			const [data] = await getDetailTokenSaleRound(index as string);
			const detailSaleRound = get(data, 'data', {});
			const { start_time, end_time } = get(detailSaleRound, 'buy_time', {});
			const timestampNow = moment().unix();
			const { status, timeCountDow } = convertTimeLine(
				start_time,
				end_time,
				timestampNow
			);
			setStatusTimeLine(status);
			setTimeCountDow(timeCountDow);
			setDetailSaleRound(detailSaleRound);
		};

		if (index && isEmpty(detailSaleRound)) {
			getDetailSaleRound();
		}
	}, [index, detailSaleRound]);

	const renderTokenBuyTime = (startTime: number, endTime: number) => {
		return `${convertTimeStampToDate(startTime)} - ${convertTimeStampToDate(
			endTime
		)}`;
	};

	return (
		<div className='flex flex-col gap-y-8'>
			<div className='flex gap-x-8 justify-between'>
				<BoxPool title='Pool Timeline' customClass='w-[50%]'>
					<div className='py-6'>
						<Stepper steps={TIME_LINE_SALE_ROUND} activeStep={statusTimeLine} />
					</div>
					<Countdown
						millisecondsRemain={timeCountDow}
						title='You can buy tokens in'
					/>
				</BoxPool>
				<BoxPool title='Buy Info' customClass='w-[50%]'>
					<div className='pt-6 flex'>
						<CustomRadio
							onChange={() => {}}
							defaultValue='BUSD'
							options={selectList}
						/>
						<Button label='Buy' classCustom='bg-butterfly-bush' />
					</div>
					<Divider className='bg-black-velvet my-5' />
					<div>
						<div className='text-sm text font-normal'>Buy Progress:</div>
						<Progress
							strokeColor={{
								'0%': '#9E90F3',
								'100%': '#9E90F3',
							}}
							percent={100}
							showInfo={false}
						/>
						<div className='flex justify-between'>
							<div>100%</div>
							<div>1000/1000</div>
						</div>
					</div>
				</BoxPool>
			</div>
			<BoxPool title='Pool Details' customClass='w-full'>
				<div className='py-9 flex gap-x-6 text-sm'>
					<div className='w-[50%]'>
						<div className='flex gap-x-2 mb-4'>
							<div className='text-dim-gray font-normal'>Token Buy Time:</div>
							<div className='font-medium'>
								{start_time && end_time
									? renderTokenBuyTime(start_time, end_time)
									: 'TBA'}
							</div>
						</div>
						<div className='flex gap-x-2'>
							<div className='text-dim-gray font-normal'>Token Claim Time:</div>
							<div className='font-medium'>TBA</div>
						</div>
					</div>
					<div className='w-[50%]'>
						<div className='flex gap-x-2 mb-4'>
							<div className='text-dim-gray font-normal'>Total Raise:</div>
							<div className='font-medium'>TBA</div>
						</div>
						<div className='flex gap-x-2'>
							<div className='text-dim-gray font-normal'>Token Max Buy:</div>
							<div className='font-medium'>TBA</div>
						</div>
					</div>
				</div>
				<Divider className='bg-black-velvet mt-0' />
				<div className='text-sm text-dim-gray font-medium'>
					Round Information:
				</div>
			</BoxPool>
		</div>
	);
};

export default TokenSaleRoundDetail;
