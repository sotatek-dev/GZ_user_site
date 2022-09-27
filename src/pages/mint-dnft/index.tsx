import Button from 'common/components/button';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
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
import NftGroup from 'assets/svg-components/nftGroup';

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
	const { phase, endTime } = phaseRunning || {};
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
			<div className='w-[300px] h-[587px] rounded-[10px] flex flex-col items-center'>
				<NftGroup className={'w-full h-fit mt-11 mb-20'} />
				<div
					className={
						'flex justify-center bg-charcoal-purple text-h7 text-white/[.3] font-semibold px-5 py-3 w-full rounded-[40px] cursor-pointer'
					}
				>
					Mint
				</div>
			</div>

			<div className='w-full bg-box p-8 rounded-[10px]'>
				<h6 className='text-h3 font-semibold mb-4'>Mint dNFT</h6>

				{/* divider*/}
				<hr className={'border border-white/[.07] mb-4'} />

				{/*<Button label={'Mint'} classCustom={'bg-green mb-4'} />*/}
				<div className={'flex items-center rounded-[10px] text-h8 mb-4'}>
					<div className='flex items-center mr-10'>
						<div className={'text-white/[.5] mr-[20px]'}>Price:</div>
						<div>175 BUSD</div>
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

				{/* divider*/}
				<hr className={'border border-white/[.07] mb-4'} />

				<div className={'mb-1 text-h8 font-medium mb-4'}>Pool remaining</div>
				<div className='flex justify-center items-center gap-x-6 mb-5 font-medium text-h8 h-fit'>
					{PoolRemaining.map((item: any, index: number) => {
						const { label, value } = item;
						return (
							<>
								<div
									key={index}
									className='flex justify-between items-center w-[33%]'
								>
									<div className='flex items-center'>
										<div className='min-w-[10px] min-h-[10px] rounded-sm bg-red-10 mr-2' />
										{label}
									</div>
									<div>{value}</div>
								</div>

								{index + 1 < PoolRemaining.length && (
									<div
										className={
											'border border-white/[.07] h-full min-h-[1.25em]'
										}
									/>
								)}
							</>
						);
					})}
				</div>

				{/* divider*/}
				<hr className={'border border-white/[.07] mb-8'} />

				<div className='flex flex-col text-sm mb-8	'>
					<TimelineMintRound timelineMintNft={timelineMintNft} />
					{/* divider*/}
					<hr className={'border border-green my-8'} />
					<div className='flex justify-between w-full'>
						{timelineMintNft.map(
							(phaseInfo: ITimelineMintNftState, index: number) => {
								const { endMintTime, startMintTime } = phaseInfo;
								return (
									<div
										className={
											'flex flex-col justify-center items-center w-[20%] text-h10'
										}
										key={index}
									>
										<div className='mb-4'>
											Start from:{' '}
											{convertTimeStampToDate(
												startMintTime,
												'hh:mm - MM/DD/YYYY'
											)}
										</div>
										<div>
											End in:{' '}
											{convertTimeStampToDate(
												endMintTime,
												'hh:mm - MM/DD/YYYY'
											)}
										</div>
									</div>
								);
							}
						)}
					</div>
				</div>

				{/* divider*/}
				<hr className={'border border-white/[.07] mb-8'} />

				{phase && endTime && (
					<Countdown
						customClass='mt-6 mr-auto'
						title={`Minting phase for ${phase} end in`}
						millisecondsRemain={endTime}
					/>
				)}

				<div className='flex flex-col bg-black-russian rounded-[10px] px-6 py-3 text-sm mb-5'>
					<Button
						label='You are eligible to mint this dNFT '
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
