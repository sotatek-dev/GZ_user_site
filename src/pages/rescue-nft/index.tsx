import React, { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import { Message, selectTokensList, TOKENS } from 'modules/mint-dnft/constants';
import { useBalance } from 'web3/queries';
import { useContract } from 'web3/contracts/useContract';
import DNFTABI from 'web3/abis/abi-dnft.json';
import DKEYNFTABI from 'web3/abis/abi-keynft.json';
import PresalePoolAbi from 'web3/abis/abi-presalepool.json';

import CustomRadio from 'common/components/radio';
import { formatBigNumber } from 'common/utils/functions';
import { ROUTES } from 'common/constants/constants';
import { useRouter } from 'next/router';
import { AbiDnft, AbiKeynft, AbiPresalepool } from 'web3/abis/types';
import { useNativeBalance } from 'web3/hooks';
import { Spin } from 'antd';
import { useAppDispatch, useAppSelector } from 'stores';
import {
	fetchClaimableTime,
	fetchListPhase,
	fetchRate,
} from 'modules/mint-dnft/helpers/fetch';

import isNftClaimable from 'common/helpers/isNftClaimable';
import Image from 'next/image';
import NftGroupImg from 'assets/imgs/nft-group.png';
import { useRescueMutation } from 'modules/rescue-dnft/services/useRescueMutation';
import {
	fetchLaunchPriceInBUSD,
	fetchListKey,
	fetchPoolRemaining,
	fetchPriceInBUSD,
} from 'modules/rescue-dnft/services/apis';

const RescueDNFT = () => {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const { runningPhaseId, claimableTime, rate } = useAppSelector(
		(state) => state.mintDnft
	);
	const { listKey, poolRemaining, priceInBUSD, launchPriceInBUSD } =
		useAppSelector((state) => state.rescueDnft);
	const { tryRescue, isDoingRescue } = useRescueMutation();

	const dnftContract = useContract<AbiDnft>(
		DNFTABI,
		process.env.NEXT_PUBLIC_DNFT_ADDRESS || ''
	);
	const keyNftContract = useContract<AbiKeynft>(
		DKEYNFTABI,
		process.env.NEXT_PUBLIC_KEYNFT_ADDRESS || ''
	);
	const presalePoolContract = useContract<AbiPresalepool>(
		PresalePoolAbi,
		process.env.NEXT_PUBLIC_PRESALE_POOL_ADDRESS || ''
	);
	const [token, setToken] = useState<TOKENS>(selectTokensList[0]);
	const nativeBalance = useNativeBalance();
	// BUSD balance
	const { balance: busdBalance } = useBalance(
		process.env.NEXT_PUBLIC_BUSD_ADDRESS || ''
	);

	const { addressWallet } = useAppSelector((state) => state.wallet);
	const price =
		token === TOKENS.BUSD ? priceInBUSD : new BigNumber(priceInBUSD).div(rate);
	// const launchPrice =
	// 	token === TOKENS.BUSD
	// 		? launchPriceInBUSD
	// 		: new BigNumber(launchPriceInBUSD).div(rate);

	const isConnectWallet = !!addressWallet;
	const haveEnoughNft = new BigNumber(poolRemaining).gt(0);
	const haveEnoughKey = listKey.length > 0;
	// CR: claim start after end presale-2 7 days
	const isClaimable = isNftClaimable(claimableTime, runningPhaseId);
	// const isClaimable = isNftClaimable(claimableTime);

	const haveEnoughBalance = () => {
		// If the user have lesser BNB/BUSD than total price or launch price (In case the Rescue is free)

		if (new BigNumber(price).gt(0)) {
			if (token === TOKENS.BNB) {
				return nativeBalance.gte(price);
			} else if (token === TOKENS.BUSD) {
				return busdBalance.gte(price);
			}
		} else if (new BigNumber(price).eq(0)) {
			return true;
		}

		return false;
	};
	const isRoyalty = () => {
		// priceInBUSD in BigNumber
		const p = new BigNumber(priceInBUSD);
		// launchPriceInBUSD in BigNumber
		const lp = new BigNumber(launchPriceInBUSD);

		if (new BigNumber(price).gt(0)) {
			if (token === TOKENS.BNB) {
				return busdBalance.gte(p.times(0.12));
			} else if (token === TOKENS.BUSD) {
				return busdBalance.gte(p.times(1.12));
			}
		} else if (new BigNumber(price).eq(0)) {
			return busdBalance.gte(lp.times(0.12));
		}
		return false;

		// return busdBalance.gte(lp.times(0.12));
	};

	useEffect(() => {
		// dispatch(fetchListPhase({ dnftContract }));
		dispatch(fetchListPhase());
		dispatch(fetchClaimableTime({ dnftContract }));

		dispatch(fetchPriceInBUSD({ dnftContract }));
		dispatch(fetchLaunchPriceInBUSD({ dnftContract }));
		dispatch(fetchPoolRemaining({ dnftContract }));
		dispatch(fetchRate({ presalePoolContract }));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dnftContract]);

	useEffect(() => {
		dispatch(
			fetchListKey({
				dnftContract,
				keyNftContract,
				walletAddress: addressWallet,
			})
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dnftContract, keyNftContract, addressWallet]);

	const getMessage = () => {
		if (isConnectWallet && isClaimable) {
			if (!haveEnoughBalance()) {
				if (token === TOKENS.BNB) {
					return <>{Message.NOT_HAVE_ENOUGH_BNB_BALANCE}</>;
				} else if (token === TOKENS.BUSD) {
					return <>{Message.NOT_HAVE_ENOUGH_BUSD_BALANCE}</>;
				}
			} else if (!haveEnoughNft) {
				return <>{Message.NO_NFT_LEFT}</>;
			} else if (!isRoyalty()) {
				return <>{Message.NOT_ROYALTY}</>;
			} else {
				if (haveEnoughKey) {
					return <>{Message.ELIGIBLE_TO_RESCUE}</>;
				} else {
					return (
						<>
							{Message.NOT_ELIGIBLE_TO_MINT}.{' '}
							<br className={'desktop:hidden'} />
							Click{' '}
							<span
								className={'underline cursor-pointer'}
								onClick={() => {
									router.push(ROUTES.MY_PROFILE);
								}}
							>
								here
							</span>{' '}
							to mint key
						</>
					);
				}
			}
		} else {
			return <>{Message.NOT_ELIGIBLE_TO_MINT}</>;
		}
	};

	return (
		<>
			<div
				className={
					'flex flex-col justify-center items-center desktop:flex-row desktop:items-start gap-x-3'
				}
			>
				<div className={'w-64 flex flex-col items-center mb-6 desktop:mb-20'}>
					<div
						className={
							'mt-11 mb-20 flex items-center justify-center overflow-hidden'
						}
					>
						<Image
							className={'desktop:hidden'}
							src={NftGroupImg.src}
							alt={NftGroupImg.src}
							width={353}
							height={308}
						/>
					</div>
					{isConnectWallet &&
					!isDoingRescue &&
					haveEnoughBalance() &&
					isRoyalty() &&
					haveEnoughNft &&
					haveEnoughKey &&
					isClaimable ? (
						<div
							onClick={() => {
								if (!listKey.length) return;
								tryRescue(listKey[0], token);
							}}
							className={
								'flex justify-center bg-blue-to-pink-102deg text-h7 text-white font-semibold px-6 py-3 w-fit desktop:w-full rounded-[40px] cursor-pointer'
							}
						>
							Rescue
						</div>
					) : (
						<div
							className={
								'flex justify-center items-center bg-charcoal-purple text-h7 text-white/[.3] font-semibold px-6 py-3 w-fit desktop:w-full rounded-[40px]'
							}
						>
							{isDoingRescue ? <Spin className={'flex'} /> : 'Rescue'}
						</div>
					)}
				</div>

				<div
					className={
						'w-full desktop:w-auto desktop:grow bg-black-10 p-8 rounded-[10px]'
					}
				>
					<h6 className={'text-h3 font-semibold mb-4'}>Cosmic Void Rescue</h6>

					{/* divider*/}
					<hr className={'border-t border-white/[.07] mb-4'} />

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
						</div>
						<CustomRadio
							onChange={(e) => {
								setToken(e.target.value);
							}}
							defaultValue={token}
							options={selectTokensList.map((el) => ({
								value: el,
								label: el,
							}))}
						/>
					</div>

					{/* divider*/}
					<hr className={'border-t border-white/[.07] mb-4'} />

					<div className={'text-h8 font-medium mb-6 desktop:mb-4'}>
						Pool remaining
					</div>
					<div
						className={
							'flex flex-col justify-start desktop:flex-row gap-6 mb-5 font-medium text-[13px] h-fit'
						}
					>
						<div
							className={'flex justify-between items-center desktop:w-[50%]'}
						>
							<div className={'flex items-center'}>
								<div className='min-w-[10px] min-h-[10px] rounded-sm bg-red-10 mr-2' />
								Current sdNFTs can be rescued
							</div>
							<div>{formatBigNumber(poolRemaining)}</div>
						</div>
					</div>

					{/* divider*/}
					<hr className={'border-t border-white/[.07] mb-4'} />

					<div
						className={
							'flex flex-col justify-center items-center desktop:items-start rounded-[10px] text-h8'
						}
					>
						<div
							className={
								'bg-blue-to-pink-102deg text-center text-h8 px-4 py-1 rounded-[40px] select-none'
							}
						>
							{getMessage()}
						</div>
						<div
							className={
								'flex flex-col text-center desktop:text-start text-h8 mt-4 gap-2'
							}
						>
							<div>
								Notice: You can only rescue {listKey.length} sdNFT this month
								<br />
								User can use 1 key to rescue 1 sdNFT. Rescue chances will be
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
