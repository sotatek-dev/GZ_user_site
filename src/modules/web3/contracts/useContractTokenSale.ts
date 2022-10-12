import { HEX_ZERO } from 'common/constants/constants';
import { convertHexToNumber, fromWei, toWei } from 'common/utils/functions';
import { get } from 'lodash';
import { genPresalePoolContractEther } from './instance';
// const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

export const getSalePhaseInfo = async (saleRoundId: number) => {
	try {
		const contract = await genPresalePoolContractEther();
		const res = await contract.salePhaseStatistics(saleRoundId);
		return [res, null];
	} catch (error) {
		return [null, error];
	}
};

export const convertBNBtoBUSD = async (price: number) => {
	try {
		const contract = await genPresalePoolContractEther();
		const res = await contract.convertBNBToBUSD(toWei(price));
		const priceBUSD = fromWei(convertHexToNumber(get(res, '_hex', HEX_ZERO)));
		return [JSON.parse(priceBUSD), null];
	} catch (error) {
		return [null, error];
	}
};

export const convertBUSDtoBNB = async (price: number | string) => {
	try {
		const contract = await genPresalePoolContractEther();
		const res = await contract.convertBUSDToBNB(toWei(price));
		const priceBNBBignumber = convertHexToNumber(get(res, '_hex', HEX_ZERO));
		const priceBNB = fromWei(priceBNBBignumber);
		return [JSON.parse(priceBNB), null];
	} catch (error) {
		return [null, error];
	}
};

export const getUserPurchasedAmount = async (
	address: string,
	saleRoundId: number
) => {
	try {
		const contract = await genPresalePoolContractEther();
		const res = await contract.getUserPurchasedAmount(address, saleRoundId);
		const amount = fromWei(convertHexToNumber(get(res, '_hex', HEX_ZERO)));
		return [JSON.parse(amount), null];
	} catch (error) {
		return [null, error];
	}
};

export const getRemainingClaimableAmount = async (
	address: string,
	saleRoundId: number
) => {
	try {
		const contract = await genPresalePoolContractEther();
		const res = await contract.getRemainingClaimableAmount(
			address,
			saleRoundId
		);
		const amount = fromWei(convertHexToNumber(get(res, '_hex', HEX_ZERO)));
		return [JSON.parse(amount), null];
	} catch (error) {
		return [null, error];
	}
};

export const getUserClaimedAmount = async (
	address: string,
	saleRoundId: number
) => {
	try {
		const contract = await genPresalePoolContractEther();
		const res = await contract.getUserClaimedAmount(address, saleRoundId);
		const youBought = fromWei(convertHexToNumber(get(res, '_hex', HEX_ZERO)));
		return [youBought, null];
	} catch (error) {
		return [null, error];
	}
};

export const getTokenAmountFromBUSD = async (
	BUSDAmount: number,
	tokenPriceInBUSD: number
) => {
	try {
		const contract = await genPresalePoolContractEther();
		const res = await contract.getTokenAmountFromBUSD(
			toWei(BUSDAmount),
			toWei(tokenPriceInBUSD)
		);
		const amountGXC = fromWei(convertHexToNumber(get(res, '_hex', HEX_ZERO)));
		return [JSON.parse(amountGXC), null];
	} catch (error) {
		return [null, error];
	}
};

export const buyTokenWithExactlyBUSD = async (
	saleRoundId: number,
	address: string,
	BUSDAmount: number,
	signature: string
) => {
	try {
		const contract = await genPresalePoolContractEther();
		const res = await contract.buyTokenWithExactlyBUSD(
			saleRoundId,
			address,
			toWei(BUSDAmount),
			signature
		);
		const result = await res.wait(1);
		return [result, null];
	} catch (error) {
		return [null, error];
	}
};

export const buyTokenWithExactlyBNB = async (
	saleRoundId: number,
	address: string,
	signature: string,
	amount: number
) => {
	try {
		const contract = await genPresalePoolContractEther();
		const res = await contract.buyTokenWithExactlyBNB(
			saleRoundId,
			address,
			signature,
			{ value: toWei(amount) }
		);
		const result = await res.wait(1);
		return [result, null];
	} catch (error) {
		return [null, error];
	}
};

export const claimPurchasedToken = async (saleRoundId: number | undefined) => {
	try {
		const contract = await genPresalePoolContractEther();
		const res = await contract.claimPurchasedToken(saleRoundId);
		const result = await res.wait(1);
		return [result, null];
	} catch (error) {
		return [null, error];
	}
};
