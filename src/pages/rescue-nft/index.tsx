/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useState } from 'react';
import NftGroup from 'assets/svg-components/nftGroup';
import BigNumber from 'bignumber.js';
import {
	DECIMAL_PLACED,
	listPhaseId,
	minBalanceForMint,
	MINT_PHASE_ID,
	selectTokensList,
	TOKEN_DECIMAL,
	TOKENS,
} from 'modules/mintDnft/constants';
import { useSelector } from 'react-redux';
import { useBalance } from 'web3/queries';
import { IPhaseStatistic } from 'modules/mintDnft/interfaces';
import { useContract } from 'web3/contracts/useContract';
import DNFTABI from 'web3/abis/abi-dnft.json';
import CustomRadio from 'common/components/radio';
import { Tooltip } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { formatBigNumber, geMintPhaseType } from 'common/utils/functions';
import { now, ROUTES } from 'common/constants/constants';
import HelmetCommon from 'common/components/helmet';
import ReactGa from 'react-ga';
import { useRouter } from 'next/router';
const RescueDNFT = () => {
	const [listPhase, setListPhase] = useState<Array<IPhaseStatistic>>([]);
	const [runningPhaseId, setRunningPhaseId] = useState<MINT_PHASE_ID | number>(
		0
	);
	const router = useRouter();
	const runningPhase = listPhase.find((item: IPhaseStatistic) => {
		return (
			item.id === runningPhaseId &&
			item.startTime < now() &&
			item.endTime > now()
		);
	});

	const [token, setToken] = useState<TOKENS>(selectTokensList[0]);
	const dnftContract = useContract(
		DNFTABI,
		process.env.NEXT_PUBLIC_DNFT_ADDRESS || ''
	);
	const gxzBalance = useBalance(process.env.NEXT_PUBLIC_GXZ_TOKEN || '');
	const { addressWallet } = useSelector((state) => state.wallet);
	const {
		priceInBUSD: priceInBUSD = 0,
		priceAfter24Hours: priceAfter24Hours = 0,
		// maxSaleAmount: maxSaleAmount = 0,
		// totalSold: totalSold = 0,
	} = runningPhase || {};
	// BUSD / BNB
	const [rate, setRate] = useState<BigNumber.Value>(1);
	const price =
		token === TOKENS.BUSD ? priceInBUSD : new BigNumber(priceInBUSD).div(rate);
	const priceAfter =
		token === TOKENS.BUSD
			? priceAfter24Hours
			: new BigNumber(priceAfter24Hours).div(rate);

	const isConnectWallet = !!addressWallet;
	const haveEnoughGXZBalance = gxzBalance.gte(minBalanceForMint);

	useEffect(() => {
		const handleGetListPhaseMintNft = async () => {
			try {
				if (dnftContract) {
					// @ts-ignore
					const runningPhaseId = await dnftContract?.currentSalePhase();

					const list = await Promise.all(
						listPhaseId.map(async (salephaseid: MINT_PHASE_ID) => {
							// @ts-ignore
							const res = await dnftContract?.salePhaseStatistics(salephaseid);
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
								startTime: new BigNumber(startTime._hex).toNumber(),
								endTime: new BigNumber(endTime._hex).toNumber(),
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

		handleGetListPhaseMintNft();
	}, [dnftContract]);

	useEffect(() => {
		const fetchRate = async () => {
			try {
				// get rate
				// @ts-ignore
				const res = await dnftContract?.convertBNBToBUSD(
					TOKEN_DECIMAL.toString(10)
				);
				const rate = new BigNumber(res._hex).toString(10);
				setRate(new BigNumber(rate).div(TOKEN_DECIMAL));
			} catch (e) {
				setRate(1);
				// handle e
				// console.log(e);
			}
		};

		if (dnftContract) {
			fetchRate();
		}
	}, [runningPhaseId, runningPhase, dnftContract]);
	useEffect(() => {
		ReactGa.initialize(process?.env?.NEXT_PUBLIC_GA_TRACKING_CODE || '');
		// to report page view Google Analytics
		ReactGa.pageview(router?.pathname || '');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<>
			<HelmetCommon
				title='Rescue NFT'
				description='Description rescue NFT ...'
				href={ROUTES.RESCUE_NFT}
			/>
			<div className='flex flex-col justify-center items-center desktop:flex-row desktop:items-start gap-x-3'>
				<div className='w-[300px] flex flex-col items-center mb-6 desktop:mb-20'>
					<NftGroup className={'w-full h-fit mt-11 mb-20'} />
					<div
						className={
							'flex justify-center bg-blue-to-pink-102deg text-h7 text-white font-semibold px-5 py-3 w-fit desktop:w-full rounded-[40px] cursor-pointer'
						}
					>
						Rescue
					</div>
				</div>

				<div className='w-full bg-black-10 p-8 rounded-[10px]'>
					<h6 className='text-h3 font-semibold mb-4'>Mint dNFT</h6>

					{/* divider*/}
					<hr className={'border border-white/[.07] mb-4'} />

					<div
						className={
							'flex flex-col desktop:items-center desktop:flex-row rounded-[10px] text-h8 gap-4 mb-4'
						}
					>
						<div className='flex items-center mr-10'>
							<div className={'text-white/[.5] mr-[20px]'}>Price:</div>
							<div
								className={
									'text-h6 font-bold desktop:text-h8 desktop:font-normal'
								}
							>
								{formatBigNumber(price)} {token}
							</div>
							{new BigNumber(priceAfter).gt(0) && (
								<Tooltip
									className={'ml-2'}
									placement={'bottom'}
									title={
										<>
											<div>
												First 24h:{' '}
												{new BigNumber(price).toFixed(DECIMAL_PLACED)} {token}{' '}
												then {new BigNumber(priceAfter).toFixed(DECIMAL_PLACED)}{' '}
												{token}
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

					<div className={'text-h8 font-medium mb-6 desktop:mb-4'}>
						Pool remaining
					</div>
					<div className='flex flex-col justify-start desktop:flex-row gap-6 mb-5 font-medium text-h8 h-fit'>
						<div className='flex justify-between items-center desktop:w-[50%]'>
							<div className='flex items-center'>
								<div className='min-w-[10px] min-h-[10px] rounded-sm bg-red-10 mr-2' />
								Current NFTs can be rescued
							</div>
							<div>{new BigNumber(600).toFixed(DECIMAL_PLACED)}</div>
						</div>
					</div>

					{/* divider*/}
					<hr className={'border border-white/[.07] mb-8'} />

					<div
						className={
							'flex flex-col justify-center items-center desktop:items-start rounded-[10px] text-h8'
						}
					>
						<div
							className={
								'bg-blue-to-pink-102deg text-h8 px-4 py-1 rounded-[40px] select-none'
							}
						>
							You are {(isConnectWallet && haveEnoughGXZBalance) || 'not'}{' '}
							eligible to mint this dNFT
						</div>
						<div
							className={
								'flex flex-col text-center desktop:text-start text-h8 mt-4 gap-2'
							}
						>
							<div>Notice: to mint this dNFT requires 5,000 GXZ Token</div>
							<div>
								User can use 1 key to rescue 1 dNFT. Rescue chances will be
								reset after 30 days
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default RescueDNFT;
