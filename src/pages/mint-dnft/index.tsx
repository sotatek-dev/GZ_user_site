import Button from 'common/components/button';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Divider, Tooltip } from 'antd';
import CustomRadio from 'common/components/radio';
import TimelineMintRound from 'modules/mint-dnft/TimelineMintRound';
import Countdown from 'common/components/countdown';
import { selectList } from 'pages/token-presale-rounds/detail/[index]';
import { useEffect, useState } from 'react';
import { getListPhaseMintNft } from 'apis/mintDNFt';
import { get } from 'lodash';
import {
	convertTimelineMintNft,
	convertTimeStampToDate,
} from 'common/utils/functions';

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

export interface ITimelineMintNftState {
	label: string | undefined;
	status: string;
	endMintTime: number;
	startMintTime: number;
}

export interface IListPhaseMintNft {
	created_at: Date;
	end_mint_time: number;
	nft_mint_limit: number;
	order: number;
	price: number;
	price_after_24h: number;
	start_mint_time: number;
	status: string;
	tax: number;
	type: string;
	updated_at: Date;
	_id: string;
}

const MintDNFT = () => {
	const [timelineMintNft, setTimelineMintNft] = useState<
		Array<ITimelineMintNftState>
	>([]);
	const [phaseRunning, setPhaseRunning] = useState<any>();
	const { phase, endTime } = phaseRunning;
	useEffect(() => {
		const handleGetListPhaseMintNft = async () => {
			const [data] = await getListPhaseMintNft();
			const listPhaseMintNft = get(data, 'data', []);
			const { timeLineMintNft, phaseRunning } =
				convertTimelineMintNft(listPhaseMintNft);
			setTimelineMintNft(timeLineMintNft);
			setPhaseRunning(phaseRunning);
		};

		handleGetListPhaseMintNft();
	}, []);
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
					<TimelineMintRound timelineMintNft={timelineMintNft} />
					<Divider className='h-[3px] mx-[-24px] bg-green w-[calc(100%+48px)]' />
					<div className='flex justify-between w-full'>
						{timelineMintNft.map(
							(phaseInfo: ITimelineMintNftState, index: number) => {
								const { endMintTime, startMintTime } = phaseInfo;
								return (
									<div className='w-[20%]' key={index}>
										<div className='mb-4'>
											Start from: {convertTimeStampToDate(startMintTime)}
										</div>
										<div>End in: {convertTimeStampToDate(endMintTime)}</div>
									</div>
								);
							}
						)}
					</div>
					<Countdown
						customClass='mt-6 mr-auto'
						title={`Minting phase for ${phase} end in`}
						millisecondsRemain={endTime}
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
