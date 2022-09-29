import React, { ChangeEvent, useEffect, useState } from 'react';
import NftGroup from 'assets/svg-components/nftGroup';
import BigNumber from 'bignumber.js';
import {
	DECIMAL,
	minBalanceForMint,
	selectTokensList,
	TOKEN_DECIMAL,
	TOKENS,
} from 'modules/mint-dnft/constants';
import { useSelector } from 'react-redux';
import { useBalance } from 'web3/queries';
import { IPoolStatistic } from 'modules/mint-dnft/interfaces';
import { useContract } from 'web3/contracts/useContract';
import DNFTABI from 'web3/abis/abi-dnft.json';
import CustomRadio from 'common/components/radio';
import { Tooltip } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const RescueDNFT = () => {
	// const [isRescue] = useState<boolean>(false);
	const [token, setToken] = useState<TOKENS>(selectTokensList[0]);
	const dnftContract = useContract(
		DNFTABI,
		process.env.NEXT_PUBLIC_DNFT_ADDRESS || ''
	);
	const balance = useBalance(process.env.NEXT_PUBLIC_TOKEN || '');
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
		// maxSaleAmount,
		// totalSold,
	} = poolStatistic;
	// BUSD / BNB
	const [rate, setRate] = useState<BigNumber.Value>(1);
	const price =
		token === TOKENS.BUSD ? priceInBUSD : new BigNumber(priceInBUSD).div(rate);
	const priceAfter =
		token === TOKENS.BUSD
			? priceAfter24Hours
			: new BigNumber(priceAfter24Hours).div(rate);

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

	useEffect(() => {
		if (dnftContract) {
			fetchPoolStatisticData(1);
			fetchRate();
		}
	}, [dnftContract]);

	return (
		<div className='flex gap-x-3'>
			<div className='w-[300px] h-[587px] rounded-[10px] flex flex-col items-center'>
				<NftGroup className={'w-full h-fit mt-11 mb-20'} />
				<div
					className={
						'flex justify-center bg-charcoal-purple text-h7 text-white/[.3] font-semibold px-5 py-3 w-full rounded-[40px] cursor-pointer'
					}
				>
					Rescue
				</div>
			</div>

			<div className='w-full bg-box p-8 rounded-[10px]'>
				<h6 className='text-h3 font-semibold mb-4'>Mint dNFT</h6>

				{/* divider*/}
				<hr className={'border border-white/[.07] mb-4'} />

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
				<div className='flex items-center gap-x-6 mb-5 font-medium text-h8 h-fit'>
					<div className='flex justify-between items-center w-[33%]'>
						<div className='flex items-center'>
							<div className='min-w-[10px] min-h-[10px] rounded-sm bg-red-10 mr-2' />
							Current NFTs can be rescued
						</div>
						<div>{new BigNumber(600).toFixed(DECIMAL)}</div>
					</div>
				</div>

				{/* divider*/}
				<hr className={'border border-white/[.07] mb-8'} />

				<div className={'flex flex-col items-start rounded-[10px] text-h8'}>
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
						<br />
						User can use 1 key to rescue 1 dNFT. Rescue chances will be reset
						after 30 days
					</div>
				</div>
			</div>
		</div>
	);
};

export default RescueDNFT;
