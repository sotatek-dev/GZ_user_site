/* eslint-disable @typescript-eslint/no-explicit-any */
import { Contract, ethers, providers, utils } from 'ethers';
import BigNumber from 'bignumber.js';
import { Injected, walletConnect } from 'web3/connectors/injected';

export const getProvider = async () => {
	// TODO: find a better to detect what user connect by
	// hint: redux
	const isWc = 'walletconnect' in localStorage;

	const provider = await (isWc ? walletConnect : Injected).getProvider();
	return provider ? new providers.Web3Provider(provider) : null;
};

export const getContractInstanceEther = async (
	ABIContract: any,
	contractAddress: string
) => {
	let signer = new ethers.providers.StaticJsonRpcProvider(
		process.env.NEXT_PUBLIC_BSC_RPC_URL
	);

	const provider = await getProvider();
	if (provider) {
		signer = provider.getSigner() as any;
	}
	return new Contract(contractAddress, ABIContract, signer);
};

export const getSigner = async () => {
	const provider = await getProvider();
	return provider && provider.getSigner();
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
