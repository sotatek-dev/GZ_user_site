import { MINT_PHASE_ID, TOKEN_DECIMAL } from 'modules/mintDnft/constants';
import { IPhaseStatistic } from 'modules/mintDnft/interfaces';
import BigNumber from 'bignumber.js';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AbiDnft } from 'web3/abis/types';
import { ROUND_TYPE } from 'common/constants/constants';
import axiosInstance from 'apis/config';
import { getListPhase } from 'modules/mintDnft/services';

// interface ParamsFetchListPhase {
// 	dnftContract?: AbiDnft | null;
// }
// export const fetchListPhase = createAsyncThunk(
// 	'mintDnft/fetchListPhase',
// 	async (params: ParamsFetchListPhase, { rejectWithValue }) => {
// 		const { dnftContract } = params;
//
// 		try {
// 			if (dnftContract) {
// 				const runningPhaseId = await dnftContract.currentSalePhase();
// 				const listPhase = await Promise.all(
// 					listPhaseId.map(async (salephaseid: MINT_PHASE_ID) => {
// 						const res = await dnftContract.salePhaseStatistics(salephaseid);
// 						const {
// 							endTime,
// 							maxAmountUserCanBuy,
// 							maxSaleAmount,
// 							priceAfter24Hours,
// 							priceInBUSD,
// 							startTime,
// 							totalSold,
// 						} = res;
// 						const phase: IPhaseStatistic = {
// 							id: salephaseid,
// 							type: geMintPhaseType(salephaseid) || '',
// 							startTime: new BigNumber(startTime._hex).times(1000).toNumber(),
// 							endTime: new BigNumber(endTime._hex).times(1000).toNumber(),
// 							priceAfter24Hours: new BigNumber(priceAfter24Hours._hex)
// 								.div(TOKEN_DECIMAL)
// 								.toString(10),
// 							priceInBUSD: new BigNumber(priceInBUSD._hex)
// 								.div(TOKEN_DECIMAL)
// 								.toString(10),
// 							maxAmountUserCanBuy: new BigNumber(
// 								maxAmountUserCanBuy._hex
// 							).toString(10),
// 							maxSaleAmount: new BigNumber(maxSaleAmount._hex).toString(10),
// 							totalSold: new BigNumber(totalSold._hex).toString(10),
// 						};
// 						return phase;
// 					})
// 				);
// 				return {
// 					runningPhaseId,
// 					listPhase,
// 				};
// 			}
// 		} catch (e) {
// 			return rejectWithValue(e);
// 		}
//
// 		// return default value
// 		return {
// 			runningPhaseId: 0,
// 			listPhase: [],
// 		};
// 	}
// );

export const fetchListPhase = createAsyncThunk(
	'mintDnft/fetchListPhase',
	async (params, { rejectWithValue }) => {
		try {
			const res = await getListPhase();
			const runningPhaseId: number =
				res.find((value) => {
					return value.is_current_phase;
				})?.order || 0;
			const listPhase = res.map((value) => {
				const {
					order,
					type,
					start_mint_time,
					end_mint_time,
					price_after_24h,
					price,
					nft_mint_limit,
					sale_amount,
					total_sold,
					status,
				} = value;
				const phase: IPhaseStatistic = {
					id: order,
					type: type,
					startTime: new BigNumber(start_mint_time || 0).times(1000).toNumber(),
					endTime: new BigNumber(end_mint_time || 0).times(1000).toNumber(),
					priceAfter24Hours: new BigNumber(price_after_24h)
						.div(TOKEN_DECIMAL)
						.toString(10),
					priceInBUSD: new BigNumber(price).div(TOKEN_DECIMAL).toString(10),
					maxAmountUserCanBuy: new BigNumber(nft_mint_limit).toString(10),
					maxSaleAmount: new BigNumber(sale_amount).toString(10),
					totalSold: new BigNumber(total_sold).toString(10),
					status,
				};
				return phase;
			});

			return {
				runningPhaseId,
				listPhase,
			};
		} catch (e) {
			rejectWithValue(e);
		}

		return {
			runningPhaseId: 0,
			listPhase: [],
		};
	}
);

interface FetchRateParams {
	dnftContract?: AbiDnft | null;
}
export const fetchRate = createAsyncThunk(
	'mintDnft/fetchRate',
	async (params: FetchRateParams, { rejectWithValue }) => {
		const { dnftContract } = params;

		try {
			if (dnftContract) {
				// get rate
				const res = await dnftContract.convertBNBToBUSD(
					TOKEN_DECIMAL.toString(10)
				);
				const rate = new BigNumber(res._hex).toString(10);
				return new BigNumber(rate).div(TOKEN_DECIMAL);
			}
			return new BigNumber(1);
		} catch (e) {
			return rejectWithValue(e);
		}
	}
);

interface FetchIsWhitelistedParams {
	runningPhase?: IPhaseStatistic;
	walletAddress: string;
}
export const fetchIsWhitelisted = createAsyncThunk(
	'mintDnft/fetchIsWhitelisted',
	async (params: FetchIsWhitelistedParams, { rejectWithValue }) => {
		const { runningPhase, walletAddress } = params;

		try {
			if (runningPhase && walletAddress) {
				const params = {
					address: walletAddress,
					type: ROUND_TYPE.MINT_NFT,
					id: runningPhase.type,
				};
				const res = await axiosInstance().get('/whitelisted-user/check', {
					params,
				});
				return res.data.data.isInWhiteList || false;
			}
		} catch (e) {
			return rejectWithValue(e);
		}
	}
);

interface FetchMinimumGXZBalanceRequiredParams {
	dnftContract?: AbiDnft | null;
}
export const fetchMinimumGXZBalanceRequired = createAsyncThunk(
	'mintDnft/fetchMinimumGXZBalanceRequired',
	async (params: FetchMinimumGXZBalanceRequiredParams, { rejectWithValue }) => {
		const { dnftContract } = params;

		try {
			if (dnftContract) {
				const minRequired = await dnftContract.minimumGalactixTokenRequire();
				return new BigNumber(minRequired._hex).div(TOKEN_DECIMAL);
			}
			return new BigNumber(0);
		} catch (e) {
			return rejectWithValue(e);
		}
	}
);

interface FetchUserBoughtAmountParams {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	dnftContract?: AbiDnft | null | any;
	runningPhaseId: MINT_PHASE_ID | number;
	walletAddress: string;
}
export const fetchUserBoughtAmount = createAsyncThunk(
	'mintDnft/fetchUserBoughtAmount',
	async (params: FetchUserBoughtAmountParams, { rejectWithValue }) => {
		const { dnftContract, runningPhaseId, walletAddress } = params;

		try {
			if (dnftContract && runningPhaseId && walletAddress) {
				const boughtAmount = await dnftContract.getUserBuyAmount(
					runningPhaseId,
					walletAddress
				);

				return new BigNumber(boughtAmount._hex);
			}
			return new BigNumber(0);
		} catch (e) {
			return rejectWithValue(e);
		}
	}
);

interface FetchClaimableTimeParams {
	dnftContract?: AbiDnft | null;
}
export const fetchClaimableTime = createAsyncThunk(
	'mintDnft/fetchClaimableTime',
	async (params: FetchClaimableTimeParams, { rejectWithValue }) => {
		const { dnftContract } = params;

		try {
			if (dnftContract) {
				const claimableTime = await dnftContract.claimableTime();

				return new BigNumber(claimableTime._hex);
			}
			return Number.MAX_SAFE_INTEGER;
		} catch (e) {
			return rejectWithValue(e);
		}
	}
);
