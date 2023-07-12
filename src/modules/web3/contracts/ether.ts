import { Contract, ethers, providers, utils } from 'ethers';
import { metaMask } from 'web3/connectors/metamask';
import { walletConnect } from 'web3/connectors/walletConnectV2';

export const getProvider = async () => {
	// TODO: find a better to detect what user connect by
	// hint: redux
	const isWc = 'walletconnect' in localStorage;

	const provider = (isWc ? walletConnect : metaMask).provider;
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
	unit:
		| 'wei'
		| 'kwei'
		| 'mwei'
		| 'gwei'
		| 'szabo'
		| 'finney'
		| 'ether' = 'ether',
	provider = null
) => {
	if (!provider) {
		provider = (await getProvider()) as any;
	}

	const rawBalance = await (provider as any).getBalance(address);

	return utils.formatUnits(rawBalance, unit);
};
