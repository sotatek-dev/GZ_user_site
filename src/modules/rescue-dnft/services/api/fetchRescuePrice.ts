import BigNumber from 'bignumber.js';
import { formatEther } from 'ethers/lib/utils';
import { AbiDnft } from 'web3/abis/types';

export const fetchRescuePriceBUSD = async (dKeyNFTContract: AbiDnft | null) => {
	if (!dKeyNFTContract) {
		return null;
	}

	const busdAmount = await dKeyNFTContract.rescuePrice();
	return new BigNumber(formatEther(busdAmount));
};
