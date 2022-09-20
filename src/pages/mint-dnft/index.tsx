import Button from 'common/components/button';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Divider, Tooltip } from 'antd';
import CustomRadio from 'common/components/radio';
import TimelineMintRound from 'modules/mint-dnft/TimelineMintRound';
import Countdown from 'common/components/countdown';
import { selectList } from 'pages/token-presale-rounds/detail/[index]';

const STEP_CREATE_ASSET = ['Whitelist', 'Presale 1', 'Presale 2', 'Public'];

const PoolRemaining = [
	{
		label: 'Total NFT',
		value: 6000,
	},
	{
		label: 'NFT Minted',
		value: 200,
	},
	{
		label: 'Remaining',
		value: 400,
	},
];

const formtest = [
	{
		start_from: '20:20 2021/12',
		end_in: '20:20 2021/12',
	},
	{
		start_from: '20:20 2021/12',
		end_in: '20:20 2021/12',
	},
	{
		start_from: '20:20 2021/12',
		end_in: '20:20 2021/12',
	},
	{
		start_from: '20:20 2021/12',
		end_in: '20:20 2021/12',
	},
];

const MintDNFT = () => {
	return (
		<div className='flex gap-x-3'>
			<div className='bg-black-russian w-[300px] h-[587px] rounded-[10px] flex justify-center items-center'>
				NFT IMAGE
			</div>

			<div className='w-full'>
				<h6 className='text-lg font-medium pb-5'>Mint dNFT</h6>
				<Button label='Mint' classCustom='bg-green mb-5 ' />
				<div className='flex items-center bg-black-russian rounded-[10px] px-6 py-3 text-sm mb-5'>
					<div className='flex items-center mr-10'>
						Price: 175 BUSD
						<Tooltip
							className='ml-2'
							placement='bottom'
							title='First 24h: 175 BUSD then 235 BUSD'
						>
							<ExclamationCircleOutlined />
						</Tooltip>
					</div>
					<CustomRadio
						onChange={() => {}}
						defaultValue='BUSD'
						options={selectList}
					/>
				</div>
				<div className='mb-1 text-lg font-medium'>Pool remaining</div>
				<div className='flex items-center gap-x-6 bg-black-russian rounded-[10px] px-6 py-3 text-sm mb-5 font-medium'>
					{PoolRemaining.map((item: any, index: number) => {
						const { label, value } = item;
						return (
							<div
								key={index}
								className='flex justify-between items-center w-[33%]'
							>
								<div className='flex items-center'>
									<div className='w-[10px] h-[10px] rounded-sm bg-red-10 mr-2' />
									{label}
								</div>
								<div>{value}</div>
							</div>
						);
					})}
				</div>

				<div className='flex flex-col bg-black-russian rounded-[10px] px-6 py-3 text-sm mb-5'>
					<TimelineMintRound steps={STEP_CREATE_ASSET} activeStep='Whitelist' />
					<Divider className='h-[3px] mx-[-24px] bg-green w-[calc(100%+48px)]' />
					<div className='flex justify-between w-full'>
						{formtest.map((form: any, index: number) => {
							const { start_from, end_in } = form;
							return (
								<div className='' key={index}>
									<div className='mb-4'>Start from: {start_from}</div>
									<div>end in: {end_in}</div>
								</div>
							);
						})}
					</div>
					<Countdown
						customClass='mt-6 mr-auto'
						title='Minting phase for Presale 1 end in'
					/>
				</div>

				<div className='flex flex-col bg-black-russian rounded-[10px] px-6 py-3 text-sm mb-5'>
					<Button
						label='You are elegible to mint this dNFT '
						classCustom='bg-green'
					/>
					<div className='font-medium text-sm mt-6'>
						Notice: to mint this dNFT requires 5,000 GXZ Token
					</div>
				</div>
			</div>
		</div>
	);
};

export default MintDNFT;
