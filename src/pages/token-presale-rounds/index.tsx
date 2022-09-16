import { Divider, Progress } from 'antd';
import BoxPool from 'common/components/boxPool';
import Button from 'common/components/button';
import Countdown from 'common/components/countdown';
import CustomRadio from 'common/components/radio';
import Stepper from 'common/components/steps';
// import { useState } from 'react';

const STEP_CREATE_ASSET = ['Upcoming', 'Buy', 'Claimable', 'End'];

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

const TokenPresaleRound = () => {
	// const [step, setStep] = useState('Buy');
	return (
		<div className='flex flex-col gap-y-8'>
			<div className='flex gap-x-8 justify-between'>
				<BoxPool title='Pool Timeline' customClass='w-[50%]'>
					<div className='py-6'>
						<Stepper steps={STEP_CREATE_ASSET} activeStep='Buy' />
					</div>
					<Countdown title='You can buy tokens in' />
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
							<div className='font-medium'>TBA</div>
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

export default TokenPresaleRound;