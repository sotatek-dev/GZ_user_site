import BigNumber from 'bignumber.js';
import {
	MINT_PHASE,
	MINT_PHASE_LABEL,
	MINT_PHASE_STATUS,
} from 'modules/mint-dnft/constants';

export interface ITimelineMintNftState {
	label: MINT_PHASE_LABEL | string;
	status: MINT_PHASE_STATUS;
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

export interface IPhaseStatistic {
	id: number;
	type: MINT_PHASE | string;
	startTime: number;
	endTime: number;
	priceInBUSD: BigNumber.Value;
	priceAfter24Hours: BigNumber.Value;
	maxAmountUserCanBuy: BigNumber.Value;
	maxSaleAmount: BigNumber.Value;
	totalSold: BigNumber.Value;
	status?: MINT_PHASE_STATUS;
}

export interface SettingMint {
	price: string;
	tax: number;
	network: string;
	order: number;
	price_after_24h: string;
	is_current_phase: boolean;
	is_deploy: boolean;
	nft_mint_limit: number;
	total_sold: number;
	sale_amount: number;
	start_mint_time: number;
	end_mint_time: number;
	type: MINT_PHASE;
	status?: MINT_PHASE_STATUS;
}
