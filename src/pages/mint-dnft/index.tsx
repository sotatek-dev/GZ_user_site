/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Spin, Tooltip } from 'antd';
import CustomRadio from 'common/components/radio';
import TimelineMintRound from 'modules/mintDnft/TimelineMintRound';
import React, { useEffect, useState } from 'react';
import {
	convertMiliSecondTimestampToDate,
	convertTimelineMintNft,
	formatBigNumber,
	geMintPhaseType,
	getMintPhaseLabel,
	isApproved,
} from 'common/utils/functions';
import NftGroup from 'assets/svg-components/nftGroup';
import { useSelector } from 'react-redux';
import { useBalance } from 'web3/queries';
import { useContract } from 'web3/contracts/useContract';
import DNFTABI from '../../modules/web3/abis/abi-dnft.json';
import BigNumber from 'bignumber.js';
import {
	listPhaseId,
	minBalanceForMint,
	MINT_PHASE,
	MINT_PHASE_ID,
	selectTokensList,
	TOKEN_DECIMAL,
	TOKENS,
} from 'modules/mintDnft/constants';
import {
	IPhaseStatistic,
	ITimelineMintNftState,
} from 'modules/mintDnft/interfaces';
import Countdown from 'common/components/countdown';
import { now, ROUND_TYPE, second } from 'common/constants/constants';
import { useApproval } from 'web3/hooks';
import { AbiDnft } from 'web3/abis/types';
import {
	checkWhitelist,
	getMintDnftSignature,
} from 'modules/mintDnft/services';

const MintDNFT: React.FC = () => {
	const [listPhase, setListPhase] = useState<Array<IPhaseStatistic>>([]);
	const [runningPhaseId, setRunningPhaseId] = useState<MINT_PHASE_ID | number>(
		0
	);
	const runningPhase = listPhase.find((item: IPhaseStatistic) => {
		return (
			item.id === runningPhaseId &&
			item.startTime < now() &&
			item.endTime > now()
		);
	});
	const upcomingPhase = listPhase.find((item) => {
		return item.id === runningPhaseId + 1 && item.startTime > now();
	});
	const publicPhase = listPhase.find((item: IPhaseStatistic) => {
		return item.type === MINT_PHASE.PUBLIC;
	});

	const [timelineMintNft, setTimelineMintNft] = useState<
		Array<ITimelineMintNftState>
	>([]);
	const [token, setToken] = useState<TOKENS>(selectTokensList[0]);
	const balance = useBalance(process.env.NEXT_PUBLIC_TOKEN || '');
	// BUSD
	const { allowanceAmount: allowanceBusdAmount, tryApproval: tryApproveBusd } =
		useApproval(
			process.env.NEXT_PUBLIC_BUSD_ADDRESS || '',
			process.env.NEXT_PUBLIC_DNFT_ADDRESS || ''
		);
	const dnftContract = useContract<AbiDnft>(
		DNFTABI,
		process.env.NEXT_PUBLIC_DNFT_ADDRESS || ''
	);
	const { addressWallet } = useSelector((state) => state.wallet);
	const {
		priceInBUSD: priceInBUSD = 0,
		priceAfter24Hours: priceAfter24Hours = 0,
		maxSaleAmount: maxSaleAmount = 0,
		totalSold: totalSold = 0,
	} = runningPhase || {};
	// BUSD / BNB
	const [rate, setRate] = useState<BigNumber.Value>(1);
	const price =
		token === TOKENS.BUSD ? priceInBUSD : new BigNumber(priceInBUSD).div(rate);
	const priceAfter =
		token === TOKENS.BUSD
			? priceAfter24Hours
			: new BigNumber(priceAfter24Hours).div(rate);
	const [isWhitelisted, setIsWhitelisted] = useState<boolean>(false);
	const [isLoadingMint, setIsLoadingMint] = useState<boolean>(false);

	const isConnectWallet = !!addressWallet;
	const haveEnoughBalance = balance.gte(minBalanceForMint);

	const handleGetListPhaseMintNft = async () => {
		try {
			if (dnftContract) {
				const runningPhaseId = await dnftContract.currentSalePhase();

				const list = await Promise.all(
					listPhaseId.map(async (salephaseid: MINT_PHASE_ID) => {
						// @ts-ignore
						const res = await dnftContract.salePhaseStatistics(salephaseid);
						const {
							endTime,
							maxAmountUserCanBuy,
							maxSaleAmount,
							priceAfter24Hours,
							priceInBUSD,
							startTime,
							totalSold,
						} = res;
						const phase: IPhaseStatistic = {
							id: salephaseid,
							type: geMintPhaseType(salephaseid) || '',
							startTime: new BigNumber(startTime._hex).times(1000).toNumber(),
							endTime: new BigNumber(endTime._hex).times(1000).toNumber(),
							priceAfter24Hours: new BigNumber(priceAfter24Hours._hex)
								.div(TOKEN_DECIMAL)
								.toString(10),
							priceInBUSD: new BigNumber(priceInBUSD._hex)
								.div(TOKEN_DECIMAL)
								.toString(10),
							maxAmountUserCanBuy: new BigNumber(maxAmountUserCanBuy._hex)
								.div(TOKEN_DECIMAL)
								.toString(10),
							maxSaleAmount: new BigNumber(maxSaleAmount._hex)
								.div(TOKEN_DECIMAL)
								.toString(10),
							totalSold: new BigNumber(totalSold._hex)
								.div(TOKEN_DECIMAL)
								.toString(10),
						};
						return phase;
					})
				);
				setRunningPhaseId(runningPhaseId);
				setListPhase(list);
			}
		} catch (e) {
			// handle e
		}
	};

	const fetchRate = async () => {
		try {
			if (dnftContract) {
				// get rate
				const res = await dnftContract.convertBNBToBUSD(
					TOKEN_DECIMAL.toString(10)
				);
				const rate = new BigNumber(res._hex).toString(10);
				setRate(new BigNumber(rate).div(TOKEN_DECIMAL));
			}
		} catch (e) {
			setRate(1);
			// handle e
			// console.log(e);
		}
	};

	const fetchIsWhitelisted = async () => {
		if (runningPhase && runningPhaseId) {
			setIsWhitelisted(
				await checkWhitelist(
					addressWallet,
					ROUND_TYPE.MINT_NFT,
					runningPhase.type
				)
			);
		}
	};

	const reloadData = async () => {
		handleGetListPhaseMintNft();
		fetchRate();
		fetchIsWhitelisted();
	};

	useEffect(() => {
		handleGetListPhaseMintNft();
	}, [dnftContract]);

	useEffect(() => {
		fetchRate();
	}, [runningPhaseId, runningPhase, dnftContract]);

	useEffect(() => {
		fetchIsWhitelisted();
	}, [runningPhaseId, runningPhase]);

	useEffect(() => {
		if (listPhase.length) {
			setTimelineMintNft(convertTimelineMintNft(listPhase));
		}
	}, [listPhase]);

	const mint = async () => {
		try {
			setIsLoadingMint(true);
			if (dnftContract && runningPhase && runningPhaseId) {
				// set up signature
				const signature = await getMintDnftSignature();
				if (!isApproved(allowanceBusdAmount) && token === TOKENS.BUSD) {
					await tryApproveBusd(false);
				}
				const amount =
					token === TOKENS.BNB
						? new BigNumber(price).times(TOKEN_DECIMAL).toString(10)
						: new BigNumber(0).times(TOKEN_DECIMAL).toString(10);
				if (token === TOKENS.BUSD) {
					await dnftContract.buyUsingBUSD(
						`${runningPhaseId}`,
						addressWallet,
						signature
					);
				} else if (token === TOKENS.BNB) {
					await dnftContract.buyUsingBNB(
						`${runningPhaseId}`,
						addressWallet,
						signature,
						{ value: amount }
					);
				}
			}
		} catch (e) {
			// handle e
			// console.log(e);
		} finally {
			setIsLoadingMint(false);
			reloadData();
		}
	};

	return (
		<div className='flex gap-x-3'>
			<div className='w-[300px] h-[587px] rounded-[10px] flex flex-col items-center'>
				<NftGroup className={'w-full h-fit mt-11 mb-20'} />
				{isWhitelisted ? (
					<div
						onClick={mint}
						className={
							'flex justify-center bg-blue-to-pink-102deg text-h7 text-white font-semibold px-5 py-3 w-full rounded-[40px] cursor-pointer'
						}
					>
						{isLoadingMint ? <Spin className={'flex'} /> : 'Mint'}
					</div>
				) : (
					<div
						onClick={mint}
						className={
							'flex justify-center bg-charcoal-purple text-h7 text-white/[.3] font-semibold px-5 py-3 w-full rounded-[40px] cursor-pointer'
						}
					>
						Mint
					</div>
				)}
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
							{formatBigNumber(price)} {token}
						</div>
						{new BigNumber(priceAfter).gt(0) && (
							<Tooltip
								className={'ml-2'}
								placement={'bottom'}
								title={
									<>
										<div>
											First 24h: {formatBigNumber(price)} {token} then{' '}
											{formatBigNumber(priceAfter)} {token}
										</div>
									</>
								}
							>
								<ExclamationCircleOutlined />
							</Tooltip>
						)}
					</div>
					<CustomRadio
						onChange={(e) => {
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
						<div>{formatBigNumber(maxSaleAmount)}</div>
					</div>
					<div className={'border border-white/[.07] h-full min-h-[1.25em]'} />
					<div className='flex justify-between items-center w-[33%]'>
						<div className='flex items-center'>
							<div className='min-w-[10px] min-h-[10px] rounded-sm bg-red-10 mr-2' />
							Remaining
						</div>
						<div>
							{formatBigNumber(new BigNumber(maxSaleAmount).minus(totalSold))}
						</div>
					</div>
					<div className={'border border-white/[.07] h-full min-h-[1.25em]'} />
					<div className='flex justify-between items-center w-[33%]'>
						<div className='flex items-center'>
							<div className='min-w-[10px] min-h-[10px] rounded-sm bg-red-10 mr-2' />
							NFT Minted
						</div>
						<div>{formatBigNumber(totalSold)}</div>
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
											{convertMiliSecondTimestampToDate(
												startMintTime,
												'hh:mm - MM/DD/YYYY'
											)}
										</div>
										<div>
											End in:{' '}
											{convertMiliSecondTimestampToDate(
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
					{runningPhase &&
					runningPhase.endTime > now() &&
					runningPhase.startTime < now() ? (
						<>
							<Countdown
								customClass={'grow'}
								title={`Minting phase for ${getMintPhaseLabel(
									runningPhase.id
								)} end in`}
								millisecondsRemain={
									new BigNumber(runningPhase.endTime)
										.minus(now())
										.div(second)
										.toNumber() || 0
								}
							/>
						</>
					) : upcomingPhase && upcomingPhase.startTime > now() ? (
						<>
							<Countdown
								customClass={'grow'}
								title={'You can mint dNFT in'}
								millisecondsRemain={
									new BigNumber(upcomingPhase.startTime)
										.minus(now())
										.div(second)
										.toNumber() || 0
								}
							/>
						</>
					) : publicPhase && publicPhase.endTime < now() ? (
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
							Notice: to mint this dNFT requires {minBalanceForMint} GXZ Token
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MintDNFT;
