import { ExclamationCircleOutlined } from '@ant-design/icons';
import { message, Spin, Tooltip } from 'antd';
import CustomRadio from 'common/components/radio';
import TimelineMintRound from 'modules/mint-dnft/components/TimelineMintRound';
import React, { useEffect, useMemo, useState } from 'react';
import { formatBigNumber, isApproved } from 'common/utils/functions';
import { useBalance } from 'web3/queries';
import { useContract } from 'web3/contracts/useContract';
import DNFTABI from '../../modules/web3/abis/abi-dnft.json';
import PresalePoolAbi from 'web3/abis/abi-presalepool.json';

import BigNumber from 'bignumber.js';
import {
	Message,
	MINT_PHASE,
	selectTokensList,
	TOKEN_DECIMAL,
	TOKENS,
} from 'modules/mint-dnft/constants';
import { ROUTES } from 'common/constants/constants';
import { useActiveWeb3React, useApproval, useNativeBalance } from 'web3/hooks';
import { AbiDnft, AbiPresalepool } from 'web3/abis/types';
import { getMintDnftSignature, getNonces } from 'modules/mint-dnft/services';
import { handleWriteMethodError } from 'common/helpers/handleError';
import MintSuccessToast from 'modules/mint-dnft/components/MintSuccessToast';
import { ContractTransaction } from 'ethers';
import { useRouter } from 'next/router';
import { showError } from 'common/helpers/toast';
import {
	fetchClaimableTime,
	fetchIsWhitelisted,
	fetchListPhase,
	fetchMinimumGXZBalanceRequired,
	fetchRate,
	fetchUserBoughtAmount,
} from 'modules/mint-dnft/helpers/fetch';
import { useAppDispatch, useAppSelector } from 'stores';
import { setIsLoadingMint } from 'stores/mintDnft';
import isNftClaimable from 'common/helpers/isNftClaimable';
import NftGroupImg from 'assets/imgs/nft-group.png';
import Image from 'next/image';
import dayjs from 'dayjs';
import CountDownMint from 'modules/mint-dnft/components/CountDownMint';
import PoolDetailMint from 'modules/mint-dnft/components/PoolDetailMint';

const TIME_APPLY_PRICE_AFTER = 1; // days
// const TIME_APPLY_PRICE_AFTER = 5 / (24 * 60); // days

const MintDNFT: React.FC = () => {
	const { account } = useActiveWeb3React();
	const dispatch = useAppDispatch();
	const router = useRouter();
	const {
		// listPhase,
		runningPhaseId,
		runningPhase,
		timelineMintNft,
		isWhitelisted,
		userBoughtAmount,
		rate,
		minimumGXZBalanceRequired,
		isLoadingMint,
		claimableTime,
	} = useAppSelector((state) => state.mintDnft);

	const [token, setToken] = useState<TOKENS>(selectTokensList[0]);
	const nativeBalance = useNativeBalance();
	// GXZ balance
	const { balance: gxzBalance } = useBalance(
		process.env.NEXT_PUBLIC_GXZ_TOKEN || ''
	);
	// BUSD balance
	const { balance: busdBalance } = useBalance(
		process.env.NEXT_PUBLIC_BUSD_ADDRESS || ''
	);
	// busd approve
	const { allowanceAmount: allowanceBusdAmount, tryApproval: tryApproveBusd } =
		useApproval(
			process.env.NEXT_PUBLIC_BUSD_ADDRESS || '',
			process.env.NEXT_PUBLIC_DNFT_ADDRESS || ''
		);
	const dnftContract = useContract<AbiDnft>(
		DNFTABI,
		process.env.NEXT_PUBLIC_DNFT_ADDRESS || ''
	);
	const presalePoolContract = useContract<AbiPresalepool>(
		PresalePoolAbi,
		process.env.NEXT_PUBLIC_PRESALE_POOL_ADDRESS || ''
	);
	const { addressWallet } = useAppSelector((state) => state.wallet);
	const {
		priceInBUSD: priceInBUSD = 0,
		priceAfter24Hours: priceAfter24Hours = 0,
		maxSaleAmount: maxSaleAmount = 0,
		totalSold: totalSold = 0,
		maxAmountUserCanBuy,
		startTime,
	} = runningPhase || {};
	// price of selected token
	const price =
		token === TOKENS.BUSD ? priceInBUSD : new BigNumber(priceInBUSD).div(rate);

	const priceAfter =
		token === TOKENS.BUSD
			? priceAfter24Hours
			: new BigNumber(priceAfter24Hours).div(rate);

	const currentPrice =
		startTime &&
		dayjs().isAfter(
			dayjs.unix(startTime / 1000).add(TIME_APPLY_PRICE_AFTER, 'day')
		)
			? priceAfter
			: price;

	// CR: claim start after end presale-2 7 days
	const isClaimable = isNftClaimable(claimableTime, runningPhaseId);
	// const isClaimable = isNftClaimable(claimableTime);

	// mint validation
	const isConnectWallet = !!addressWallet;
	// CR: don't check common rule in launch phase (public phase)
	const haveEnoughGXZBalance = useMemo(() => {
		if (runningPhase?.type === MINT_PHASE.PUBLIC) {
			return true;
		}
		return gxzBalance.gte(minimumGXZBalanceRequired);
	}, [minimumGXZBalanceRequired]);
	const haveEnoughBalance = () => {
		if (token === TOKENS.BNB) {
			return nativeBalance.gte(currentPrice);
		} else if (token === TOKENS.BUSD) {
			return busdBalance.gte(currentPrice);
		}
		return false;
	};
	const isRoyalty = () => {
		// Is not royalty when:
		//   + The user is holding lesser than 8% of total price in BUSD when the user pay in BNB
		//   + The user is holding lesser than 108% of total price in BUSD when the user pay in BUSD

		// priceInBUSD in BigNumber
		const p = new BigNumber(priceInBUSD);

		if (token === TOKENS.BNB) {
			return busdBalance.gte(p.times(0.08));
		} else if (token === TOKENS.BUSD) {
			return busdBalance.gte(p.times(1.08));
		}
		return false;
	};

	const reloadData = async () => {
		// dispatch(fetchListPhase({ dnftContract }));
		dispatch(fetchListPhase());
		dispatch(fetchRate({ presalePoolContract }));
		dispatch(
			fetchIsWhitelisted({ runningPhase, walletAddress: addressWallet })
		);
		dispatch(fetchMinimumGXZBalanceRequired({ dnftContract }));
		dispatch(fetchClaimableTime({ dnftContract }));
		dispatch(
			fetchUserBoughtAmount({
				dnftContract,
				runningPhaseId,
				walletAddress: addressWallet,
			})
		);
	};

	useEffect(() => {
		// dispatch(fetchListPhase({ dnftContract }));
		dispatch(fetchListPhase());
		dispatch(fetchMinimumGXZBalanceRequired({ dnftContract }));
		dispatch(fetchClaimableTime({ dnftContract }));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dnftContract]);

	useEffect(() => {
		dispatch(fetchRate({ presalePoolContract }));
		dispatch(
			fetchUserBoughtAmount({
				dnftContract,
				runningPhaseId,
				walletAddress: addressWallet,
			})
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [runningPhaseId, runningPhase, dnftContract]);

	useEffect(() => {
		dispatch(
			fetchIsWhitelisted({ runningPhase, walletAddress: addressWallet })
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [runningPhaseId, runningPhase, addressWallet]);

	const mint = async () => {
		if (!account) return;

		try {
			dispatch(setIsLoadingMint(true));
			if (
				dnftContract &&
				runningPhase &&
				runningPhaseId &&
				maxAmountUserCanBuy
			) {
				// check reach limit
				if (new BigNumber(userBoughtAmount).gte(maxAmountUserCanBuy)) {
					showError(Message.REACH_LIMIT);
					return;
				}

				// set up signature
				const dnftNonces = await getNonces(dnftContract, account);
				const signature = await getMintDnftSignature({ nonce: dnftNonces });
				if (!isApproved(allowanceBusdAmount)) {
					await tryApproveBusd(true);
				}
				const amount =
					token === TOKENS.BNB
						? new BigNumber(currentPrice)
								.times(TOKEN_DECIMAL)
								.dp(0)
								.toString(10)
						: new BigNumber(0).times(TOKEN_DECIMAL).dp(0).toString(10);

				let res: ContractTransaction | null = null;
				if (token === TOKENS.BUSD) {
					res = await dnftContract.buyUsingBUSD(
						`${runningPhaseId}`,
						addressWallet,
						signature
					);
				} else if (token === TOKENS.BNB) {
					res = await dnftContract.buyUsingBNB(
						`${runningPhaseId}`,
						addressWallet,
						signature,
						{ value: amount }
					);
				}
				await res?.wait();
				const hash: string = res ? res.hash : '';
				if (hash) {
					message.success(<MintSuccessToast txHash={hash} />);
				}
			}
		} catch (e) {
			handleWriteMethodError(e);
		} finally {
			dispatch(setIsLoadingMint(false));
			reloadData();
		}
	};

	const getMessage = () => {
		const isMinted = new BigNumber(userBoughtAmount).gt(0);

		if (isConnectWallet && haveEnoughGXZBalance) {
			if (!haveEnoughBalance()) {
				if (token === TOKENS.BNB) {
					return <>{Message.NOT_HAVE_ENOUGH_BNB_BALANCE}</>;
				} else if (token === TOKENS.BUSD) {
					return <>{Message.NOT_HAVE_ENOUGH_BUSD_BALANCE}</>;
				}
			} else if (!isRoyalty()) {
				return <>{Message.NOT_ROYALTY}</>;
			} else {
				if (isClaimable) {
					if (isMinted) {
						return (
							<>
								{Message.ELIGIBLE_TO_CLAIM}. <br className={'desktop:hidden'} />
								Click{' '}
								<span
									className={'underline cursor-pointer'}
									onClick={() => {
										router.push(ROUTES.MY_PROFILE);
									}}
								>
									here
								</span>{' '}
								to claim
							</>
						);
					}
					return <>{Message.ELIGIBLE_TO_MINT}</>;
				}
				return <>{Message.ELIGIBLE_TO_MINT}</>;
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
					{isWhitelisted &&
					isConnectWallet &&
					!isLoadingMint &&
					haveEnoughBalance() &&
					haveEnoughGXZBalance &&
					isRoyalty() ? (
						<div
							onClick={mint}
							className={
								'flex justify-center bg-blue-to-pink-102deg text-h7 text-white font-semibold px-6 py-3 w-fit desktop:w-full rounded-[40px] cursor-pointer'
							}
						>
							Mint
						</div>
					) : (
						<div
							className={
								'flex justify-center items-center bg-charcoal-purple text-h7 text-white/[.3] font-semibold px-6 py-3 w-fit desktop:w-full rounded-[40px]'
							}
						>
							{isLoadingMint ? <Spin className={'flex'} /> : 'Mint'}
						</div>
					)}
				</div>

				<div
					className={
						'w-full desktop:w-auto desktop:grow bg-black-10 p-8 rounded-[10px]'
					}
				>
					<h6 className={'text-h3 font-semibold mb-4'}>Mint sdNFT</h6>

					{/* divider*/}
					<hr className={'border-t border-white/[.07] mb-4'} />

					{/*<Button label={'Mint'} classCustom={'bg-green mb-4'} />*/}
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
								{formatBigNumber(currentPrice)} {token}
							</div>
							{new BigNumber(priceAfter).gt(0) &&
								runningPhase?.type !== MINT_PHASE.PUBLIC && (
									<Tooltip
										className={'ml-2 text-blue-20'}
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
					<PoolDetailMint maxSaleAmount={maxSaleAmount} totalSold={totalSold} />

					{/* divider*/}
					<hr className={'border-t border-white/[.07] mb-8'} />

					<TimelineMintRound timelineMintNft={timelineMintNft} />

					<div
						className={
							'flex flex-col justify-end items-center desktop:flex-row desktop:items-end gap-6 desktop:gap-0'
						}
					>
						<CountDownMint />

						<div
							className={
								'flex flex-col items-center desktop:items-end rounded-[10px] text-h8'
							}
						>
							<div
								className={
									'bg-blue-to-pink-102deg text-center text-h8 px-4 py-1 rounded-[40px] select-none'
								}
							>
								{getMessage()}
							</div>
							{runningPhase?.type !== MINT_PHASE.PUBLIC && (
								<>
									<div className={'text-h8 mt-4'}>
										Notice: to mint this sdNFT requires{' '}
										{formatBigNumber(minimumGXZBalanceRequired)} GXZ Token
									</div>
								</>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default MintDNFT;
