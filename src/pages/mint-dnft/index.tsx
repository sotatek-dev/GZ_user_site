import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import CustomRadio from 'common/components/radio';
import TimelineMintRound from 'modules/mint-dnft/TimelineMintRound';
import Countdown from 'common/components/countdown';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { getListPhaseMintNft } from 'apis/mintDNFt';
import { get } from 'lodash';
import {
	convertTimelineMintNft,
	convertTimeStampToDate,
} from 'common/utils/functions';
import NftGroup from 'assets/svg-components/nftGroup';
import { useSelector } from 'react-redux';
import { useBalance } from 'web3/queries';
import { useContract } from 'web3/contracts/useContract';
import DNFTABI from '../../modules/web3/abis/abi-dnft.json';
import BigNumber from 'bignumber.js';
import {
	DECIMAL,
	minBalanceForMint,
	selectTokensList,
	TOKEN_DECIMAL,
	TOKENS,
} from 'modules/mint-dnft/constants';

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

export interface IPoolStatistic {
	startTime: BigNumber.Value;
	endTime: BigNumber.Value;
	priceInBUSD: BigNumber.Value;
	priceAfter24Hours: BigNumber.Value;
	maxAmountUserCanBuy: BigNumber.Value;
	maxSaleAmount: BigNumber.Value;
	totalSold: BigNumber.Value;
}

const MintDNFT: React.FC = () => {
	const [timelineMintNft, setTimelineMintNft] = useState<
		Array<ITimelineMintNftState>
	>([]);
	const [phaseRunning, setPhaseRunning] = useState<any>();
	const [upcomingPhase, setUpcomingPhase] = useState<any>();
	const [publicPhase, setPublicPhase] = useState<any>();
	const [token, setToken] = useState<TOKENS>(selectTokensList[0]);
	const balance = useBalance(process.env.NEXT_PUBLIC_TOKEN || '');
	const dnftContract = useContract(
		DNFTABI,
		process.env.NEXT_PUBLIC_DNFT_ADDRESS || ''
	);
	const { addressWallet } = useSelector((state) => state.wallet);
	const [poolStatistic, setPoolStatistic] = useState<IPoolStatistic>({
		startTime: 0,
		endTime: 0,
		priceInBUSD: 0,
		priceAfter24Hours: 0,
		maxAmountUserCanBuy: 0,
		maxSaleAmount: 0,
		totalSold: 0,
	});
	const {
		priceInBUSD: priceInBUSD,
		priceAfter24Hours,
		maxSaleAmount,
		totalSold,
	} = poolStatistic;
	// BUSD / BNB
	const [rate, setRate] = useState<BigNumber.Value>(1);
	const price =
		token === TOKENS.BUSD ? priceInBUSD : new BigNumber(priceInBUSD).div(rate);
	const priceAfter =
		token === TOKENS.BUSD
			? priceAfter24Hours
			: new BigNumber(priceAfter24Hours).div(rate);

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { startTime: upcomingPhaseStartTime } = upcomingPhase || {};
	const { endPubLicPhaseTime: pubLicPhaseEndTime } = publicPhase || {};
	const {
		runningPhaseLabel,
		endTime: runningPhaseEndTime,
		startTime: runningPhaseStartTime,
		id: runningPhaseId,
	} = phaseRunning || {};

	const isConnectWallet = !!addressWallet;
	const haveEnoughBalance = balance.gte(minBalanceForMint);

	const fetchPoolStatisticData = async (id: number) => {
		try {
			// get statistic
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			const res = await dnftContract?.salePhaseStatistics(id);
			const {
				startTime,
				endTime,
				priceInBUSD,
				priceAfter24Hours,
				maxAmountUserCanBuy,
				maxSaleAmount,
				totalSold,
			} = res;
			setPoolStatistic({
				startTime: startTime._hex,
				endTime: endTime._hex,
				priceInBUSD: new BigNumber(priceInBUSD._hex).div(TOKEN_DECIMAL),
				priceAfter24Hours: new BigNumber(priceAfter24Hours._hex).div(
					TOKEN_DECIMAL
				),
				maxAmountUserCanBuy: new BigNumber(maxAmountUserCanBuy._hex).div(
					TOKEN_DECIMAL
				),
				maxSaleAmount: new BigNumber(maxSaleAmount._hex).div(TOKEN_DECIMAL),
				totalSold: new BigNumber(totalSold._hex).div(TOKEN_DECIMAL),
			});
		} catch (e) {
			// console.log(e)
		}
	};
	const fetchRate = async () => {
		try {
			// get rate
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			const res = await dnftContract?.convertBNBToBUSD(
				TOKEN_DECIMAL.toString(10)
			);
			const rate = new BigNumber(res._hex).toString(10);
			setRate(new BigNumber(rate).div(TOKEN_DECIMAL));
		} catch (e) {
			setRate(1);
			// console.log(e);
		}
	};

	// // eslint-disable-next-line @typescript-eslint/no-unused-vars
	// const mint = async () => {
	//   // set up signature
	//   const signature = '';
	//   const amount = new BigNumber(1).times(TOKEN_DECIMAL).toString(10);
	//   // axiosInstant.post  POST api/setting-mint/signature
	//   if (token === TOKENS.BUSD) {
	//     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
	//     // @ts-ignore
	//     const res = await dnftContract?.buyUsingBUSD(amount, runningPhaseId, addressWallet, signature);
	//     console.log(res);
	//   } else if (token === TOKENS.BNB) {
	//     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
	//     // @ts-ignore
	//     const res = await dnftContract?.buyUsingBNB(amount, runningPhaseId, addressWallet, signature);
	//     console.log(res);
	//   }
	// }

	useEffect(() => {
		const handleGetListPhaseMintNft = async () => {
			const [data] = await getListPhaseMintNft();
			const listPhaseMintNft = get(data, 'data', []);
			const { timeLineMintNft, upcomingPhase, phaseRunning, publicPhase } =
				convertTimelineMintNft(listPhaseMintNft);
			setTimelineMintNft(timeLineMintNft);
			setPhaseRunning(phaseRunning);
			setUpcomingPhase(upcomingPhase);
			setPublicPhase(publicPhase);
		};

		handleGetListPhaseMintNft();
	}, []);

	useEffect(() => {
		if (
			phaseRunning &&
			runningPhaseEndTime > new Date().getTime() &&
			new Date().getTime() > runningPhaseStartTime &&
			dnftContract
		) {
			fetchPoolStatisticData(runningPhaseId);
			fetchRate();
		}
		// if (dnftContract) {
		//   fetchPoolStatisticData(1);
		//   fetchRate();
		// }
	}, [phaseRunning, dnftContract]);

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
						<div>
							{new BigNumber(price).toFixed(DECIMAL)} {token}
						</div>
						{new BigNumber(priceAfter).gt(0) && (
							<Tooltip
								className={'ml-2'}
								placement={'bottom'}
								title={
									<>
										<div>
											First 24h: {new BigNumber(price).toFixed(DECIMAL)} {token}{' '}
											then {new BigNumber(priceAfter).toFixed(DECIMAL)} {token}
										</div>
									</>
								}
							>
								<ExclamationCircleOutlined />
							</Tooltip>
						)}
					</div>
					<CustomRadio
						onChange={(e: ChangeEvent<HTMLInputElement>) => {
							const item = e.target.value;
							const selectedToken = selectTokensList.find((i) => i == item);
							selectedToken && setToken(selectedToken);
						}}
						defaultValue={token}
						options={selectTokensList}
					/>
				</div>

				{/* divider*/}
				<hr className={'border border-white/[.07] mb-4'} />

				<div className={'mb-1 text-h8 font-medium mb-4'}>Pool remaining</div>
				<div className='flex justify-center items-center gap-x-6 mb-5 font-medium text-h8 h-fit'>
					<div className='flex justify-between items-center w-[33%]'>
						<div className='flex items-center'>
							<div className='min-w-[10px] min-h-[10px] rounded-sm bg-red-10 mr-2' />
							Total NFT
						</div>
						<div>{new BigNumber(maxSaleAmount).toFixed(DECIMAL)}</div>
					</div>
					<div className={'border border-white/[.07] h-full min-h-[1.25em]'} />
					<div className='flex justify-between items-center w-[33%]'>
						<div className='flex items-center'>
							<div className='min-w-[10px] min-h-[10px] rounded-sm bg-red-10 mr-2' />
							Remaining
						</div>
						<div>
							{new BigNumber(maxSaleAmount).minus(totalSold).toFixed(DECIMAL)}
						</div>
					</div>
					<div className={'border border-white/[.07] h-full min-h-[1.25em]'} />
					<div className='flex justify-between items-center w-[33%]'>
						<div className='flex items-center'>
							<div className='min-w-[10px] min-h-[10px] rounded-sm bg-red-10 mr-2' />
							NFT Minted
						</div>
						<div>{new BigNumber(totalSold).toFixed(DECIMAL)}</div>
					</div>
				</div>

				{/* divider*/}
				<hr className={'border border-white/[.07] mb-8'} />

				<div className='flex flex-col text-sm mb-8	'>
					<TimelineMintRound timelineMintNft={timelineMintNft} />
					{/* divider*/}
					<hr className={'border border-green mx-3 my-8'} />
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

				<div className={'flex items-end'}>
					{phaseRunning &&
					runningPhaseEndTime > new Date().getTime() &&
					new Date().getTime() > runningPhaseStartTime ? (
						<>
							<Countdown
								customClass={'grow'}
								title={`Minting phase for ${runningPhaseLabel} end in`}
								millisecondsRemain={runningPhaseEndTime || 0}
							/>
						</>
					) : upcomingPhase && new Date().getTime() < upcomingPhaseStartTime ? (
						<>
							<Countdown
								customClass={'grow'}
								title={'You can mint dNFT in'}
								millisecondsRemain={upcomingPhaseStartTime || 0}
							/>
						</>
					) : pubLicPhaseEndTime < new Date().getTime() ? (
						<Countdown
							customClass={'grow'}
							title={'Presale for dNFT is ended'}
							millisecondsRemain={0}
						/>
					) : (
						<Countdown
							customClass={'grow'}
							title={'Presale for dNFT is ended'}
							millisecondsRemain={0}
						/>
					)}

					<div className={'flex flex-col items-end rounded-[10px] text-h8'}>
						<div
							className={
								'bg-blue-to-pink-102deg text-h8 px-4 py-1 rounded-[40px] select-none'
							}
						>
							You are {(isConnectWallet && haveEnoughBalance) || 'not'} eligible
							to mint this dNFT
						</div>
						<div className={'text-h8 mt-4'}>
							Notice: to mint this dNFT requires 5,000 GXZ Token
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MintDNFT;
