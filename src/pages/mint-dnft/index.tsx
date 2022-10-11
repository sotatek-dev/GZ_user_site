import { ExclamationCircleOutlined } from '@ant-design/icons';
import { message, Spin, Tooltip } from 'antd';
import CustomRadio from 'common/components/radio';
import TimelineMintRound from 'modules/mintDnft/components/TimelineMintRound';
import React, { useEffect, useState } from 'react';
import {
	formatBigNumber,
	getMintPhaseLabel,
	isApproved,
} from 'common/utils/functions';
import NftGroup from 'assets/svg-components/nftGroup';
import { useBalance } from 'web3/queries';
import ReactGa from 'react-ga';
import { useContract } from 'web3/contracts/useContract';
import DNFTABI from '../../modules/web3/abis/abi-dnft.json';
import BigNumber from 'bignumber.js';
import {
	Message,
	selectTokensList,
	TOKEN_DECIMAL,
	TOKENS,
} from 'modules/mintDnft/constants';
import Countdown from 'common/components/countdown';
import { now, ROUTES, second } from 'common/constants/constants';
import { useApproval, useNativeBalance } from 'web3/hooks';
import { AbiDnft } from 'web3/abis/types';
import { getMintDnftSignature } from 'modules/mintDnft/services';
import { handleWriteMethodError } from 'common/helpers/handleError';
import MintSuccessToast from 'modules/mintDnft/components/MintSuccessToast';
import { ContractTransaction } from 'ethers';
import HelmetCommon from 'common/components/helmet';
import { useRouter } from 'next/router';
import { showError } from 'common/helpers/toast';
import {
	fetchIsWhitelisted,
	fetchListPhase,
	fetchMinimumGXZBalanceRequired,
	fetchRate,
} from 'modules/mintDnft/helpers/fetch';
import { useAppDispatch, useAppSelector } from 'stores';
import { setIsLoadingMint } from 'stores/mint-dnft';
import isPublicSaleEnd from 'common/helpers/isPublicSaleEnd';

const MintDNFT: React.FC = () => {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const {
		// listPhase,
		runningPhaseId,
		runningPhase,
		upcomingPhase,
		publicPhase,
		timelineMintNft,
		isWhitelisted,
		userBoughtAmount,
		rate,
		minimumGXZBalanceRequired,
		isLoadingMint,
	} = useAppSelector((state) => state.mintDnft);

	const [token, setToken] = useState<TOKENS>(selectTokensList[0]);
	const nativeBalance = useNativeBalance();
	// GXZ balance
	const gxzBalance = useBalance(process.env.NEXT_PUBLIC_GXZ_TOKEN || '');
	// BUSD balance
	const busdBalance = useBalance(process.env.NEXT_PUBLIC_BUSD_ADDRESS || '');
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
	const { addressWallet } = useAppSelector((state) => state.wallet);
	const {
		priceInBUSD: priceInBUSD = 0,
		priceAfter24Hours: priceAfter24Hours = 0,
		maxSaleAmount: maxSaleAmount = 0,
		totalSold: totalSold = 0,
		maxAmountUserCanBuy,
	} = runningPhase || {};
	// price of selected token
	const price =
		token === TOKENS.BUSD ? priceInBUSD : new BigNumber(priceInBUSD).div(rate);
	const priceAfter =
		token === TOKENS.BUSD
			? priceAfter24Hours
			: new BigNumber(priceAfter24Hours).div(rate);

	// mint validation
	const isConnectWallet = !!addressWallet;
	const haveEnoughGXZBalance = gxzBalance.gte(minimumGXZBalanceRequired);
	const haveEnoughBalance = () => {
		if (token === TOKENS.BNB) {
			return nativeBalance.gte(price);
		} else if (token === TOKENS.BUSD) {
			return busdBalance.gte(price);
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
		dispatch(fetchListPhase({ dnftContract }));
		dispatch(fetchRate({ dnftContract }));
		dispatch(
			fetchIsWhitelisted({ runningPhase, walletAddress: addressWallet })
		);
		dispatch(fetchMinimumGXZBalanceRequired({ dnftContract }));
	};

	useEffect(() => {
		dispatch(fetchListPhase({ dnftContract }));
		dispatch(fetchMinimumGXZBalanceRequired({ dnftContract }));
	}, [dnftContract]);

	useEffect(() => {
		dispatch(fetchRate({ dnftContract }));
	}, [runningPhaseId, runningPhase, dnftContract]);

	useEffect(() => {
		dispatch(
			fetchIsWhitelisted({ runningPhase, walletAddress: addressWallet })
		);
	}, [runningPhaseId, runningPhase, addressWallet]);

	const mint = async () => {
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
				const signature = await getMintDnftSignature();
				if (!isApproved(allowanceBusdAmount) && token === TOKENS.BUSD) {
					await tryApproveBusd(true);
				}
				const amount =
					token === TOKENS.BNB
						? new BigNumber(price).times(TOKEN_DECIMAL).dp(0).toString(10)
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

	useEffect(() => {
		ReactGa.initialize(process?.env?.NEXT_PUBLIC_GA_TRACKING_CODE || '');
		// to report page view Google Analytics
		ReactGa.pageview(router?.pathname || '');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const getMessage = () => {
		const isPublicSaleEndAfter7Days = isPublicSaleEnd(publicPhase?.endTime);
		const isMinted = new BigNumber(userBoughtAmount).gt(0);

		if (isConnectWallet) {
			if (!haveEnoughBalance()) {
				if (token === TOKENS.BNB) {
					return <>{Message.NOT_HAVE_ENOUGH_BNB_BALANCE}</>;
				} else if (token === TOKENS.BUSD) {
					return <>{Message.NOT_HAVE_ENOUGH_BUSD_BALANCE}</>;
				}
			} else if (!isRoyalty()) {
				return <>{Message.NOT_ROYALTY}</>;
			} else {
				if (isPublicSaleEndAfter7Days) {
					if (isMinted) {
						return (
							<>
								{Message.ELIGIBLE_TO_CLAIM}. Click{' '}
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
					return <></>;
				}
				return <>{Message.ELIGIBLE_TO_MINT}</>;
			}
		} else {
			return <>{Message.NOT_ELIGIBLE_TO_MINT}</>;
		}
	};

	return (
		<>
			<HelmetCommon
				title='Mint DNFT'
				description='Description mint DNFT ...'
				href={ROUTES.MINT_DNFT}
			/>
			<div
				className={
					'flex flex-col justify-center items-center desktop:flex-row desktop:items-start gap-x-3'
				}
			>
				<div className={'w-64 flex flex-col items-center mb-6 desktop:mb-20'}>
					<NftGroup className={'w-full h-fit mt-11 mb-6'} />
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

				<div className={'grow bg-black-10 p-8 rounded-[10px]'}>
					<h6 className={'text-h3 font-semibold mb-4'}>Mint dNFT</h6>

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
								{formatBigNumber(price)} {token}
							</div>
							{new BigNumber(priceAfter).gt(0) && (
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
								const item = e.target.value;
								const selectedToken = selectTokensList.find((i) => i == item);
								selectedToken && setToken(selectedToken);
							}}
							defaultValue={token}
							options={selectTokensList}
						/>
					</div>

					{/* divider*/}
					<hr className={'border-t border-white/[.07] mb-4'} />

					<div className={'text-h8 font-medium mb-6 desktop:mb-4'}>
						Pool remaining
					</div>
					<div className='flex flex-col desktop:flex-row desktop:items-center gap-6 mb-5 font-medium text-h8 h-fit'>
						<div className='flex justify-between items-center desktop:w-[33%]'>
							<div className='flex items-center'>
								<div className='min-w-[10px] min-h-[10px] rounded-sm bg-red-10 mr-2' />
								Total NFT
							</div>
							<div>{formatBigNumber(maxSaleAmount)}</div>
						</div>
						<div
							className={
								'hidden desktop:block border border-white/[.07] h-full min-h-[1.25em]'
							}
						/>
						<div className='flex justify-between items-center desktop:w-[33%]'>
							<div className='flex items-center'>
								<div className='min-w-[10px] min-h-[10px] rounded-sm bg-red-10 mr-2' />
								Remaining
							</div>
							<div>
								{formatBigNumber(new BigNumber(maxSaleAmount).minus(totalSold))}
							</div>
						</div>
						<div
							className={
								'hidden desktop:block border border-white/[.07] h-full min-h-[1.25em]'
							}
						/>
						<div className='flex justify-between items-center desktop:w-[33%]'>
							<div className='flex items-center'>
								<div className='min-w-[10px] min-h-[10px] rounded-sm bg-red-10 mr-2' />
								NFT Minted
							</div>
							<div>{formatBigNumber(totalSold)}</div>
						</div>
					</div>

					{/* divider*/}
					<hr className={'border-t border-white/[.07] mb-4'} />

					<TimelineMintRound timelineMintNft={timelineMintNft} />

					<div
						className={
							'flex flex-col items-center desktop:flex-row desktop:items-end gap-6 desktop:gap-0'
						}
					>
						{runningPhase &&
						runningPhase.endTime > now() &&
						runningPhase.startTime < now() ? (
							<>
								<Countdown
									customClass={
										'grow flex flex-col items-center desktop:items-start'
									}
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
									customClass={
										'grow flex flex-col items-center desktop:items-start'
									}
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
								customClass={
									'grow flex flex-col items-center desktop:items-start'
								}
								title={'Presale for dNFT is ended'}
								millisecondsRemain={0}
							/>
						) : (
							<Countdown
								customClass={
									'grow flex flex-col items-center desktop:items-start'
								}
								title={'Presale for dNFT is ended'}
								millisecondsRemain={0}
							/>
						)}

						<div
							className={
								'flex flex-col items-center desktop:items-end rounded-[10px] text-h8'
							}
						>
							<div
								className={
									'bg-blue-to-pink-102deg text-h8 px-4 py-1 rounded-[40px] select-none'
								}
							>
								{getMessage()}
							</div>
							<div className={'text-h8 mt-4'}>
								Notice: to mint this dNFT requires{' '}
								{formatBigNumber(minimumGXZBalanceRequired)} GXZ Token
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default MintDNFT;
