/* eslint-disable @typescript-eslint/no-explicit-any */
import { ethers, providers, utils } from 'ethers';
import BigNumber from 'bignumber.js';
import { Injected, walletConnect } from 'web3/connectors/injected';

export const getProvider = async () => {
	// TODO: find a better to detect what user connect by
	// hint: redux
	const isWc = 'walletconnect' in localStorage;
	const windowObj = window as any;
	const { ethereum } = windowObj;

	const provider = await (isWc ? walletConnect : Injected).getProvider();
	if (provider) {
		return new providers.Web3Provider(provider);
	}
	await window.ethereum.enable();
	return new ethers.providers.Web3Provider(ethereum);
};

export const getContractInstanceEther = async (
	ABIContract: any,
	contractAddress: string
) => {
	const provider = await getProvider();
	const signer = provider.getSigner();

	return new ethers.Contract(contractAddress, ABIContract, signer);
};

export const getSigner = async () => {
	const provider = await getProvider();

	return provider.getSigner();
};

export const convertPriceToBigDecimals = (price: any, decimal: any): string => {
	const res = ethers.utils.parseUnits(price.toString(), decimal);

	return res.toString();
};

export const multiply = (a: any, b: any) => {
	return new BigNumber(a).multipliedBy(new BigNumber(b)).toString();
};

export const convertBigNumberValueToNumber = (
	weiBalance: any,
	decimal: number
) => {
	const res = ethers.utils.formatUnits(weiBalance, decimal).toString();
	return res;
};

/**
 *
 * @param {string} address
 * @param {'wei' | 'kwei' | 'mwei' | 'gwei' | 'szabo' | 'finney' | 'ether'} unit
 * @returns
 */
export const getBalance = async (
	address: string,
	unit = 'ether',
	provider = null
) => {
	if (!provider) {
		provider = (await getProvider()) as any;
	}

	const rawBalance = await (provider as any).getBalance(address);

	return utils.formatUnits(rawBalance, unit);
};
