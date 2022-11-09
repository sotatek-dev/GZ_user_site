import BigNumber from 'bignumber.js';
import {
	MINT_PHASE,
	MINT_PHASE_LABEL,
	MINT_PHASE_STATUS,
} from 'modules/mintDnft/constants';

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
}
