import { handleBuyInfoError } from 'modules/my-profile/helpers/handleError';
import { useState } from 'react';
import { getSignature } from './apis';
import { Token2Buy } from '../components/BuyInfo/BuyInfo.constants';
import { useMintDKeyNFT } from './useMintDKeyNFT';
import { getNonces } from 'modules/mint-dnft/services';
import { useContract } from 'web3/contracts/useContract';
import { AbiKeynft } from 'web3/abis/types';
import KeyNftAbi from 'web3/abis/abi-keynft.json';
import { NEXT_PUBLIC_KEYNFT } from 'web3/contracts/instance';
import { useActiveWeb3React } from 'web3/hooks';

export const useBuyDKeyNFT = () => {
	const { account } = useActiveWeb3React();
	const keyNftContract = useContract<AbiKeynft>(KeyNftAbi, NEXT_PUBLIC_KEYNFT);
	const [isBuyDNFT, setIsBuyDNFT] = useState(false);
	const { mintDKeyNFT } = useMintDKeyNFT();

	const buyDKeyNFT = async ({
		keyPrice,
		token2Buy,
	}: {
		keyPrice?: number;
		token2Buy: Token2Buy;
	}) => {
		let results = [null, null] as [unknown | null, null | Error];
		if (!keyNftContract || !account) return [null, new Error()];

		try {
			setIsBuyDNFT(true);
			const keyNftNonces = await getNonces(keyNftContract, account);

			const [signature] = await getSignature({ nonce: keyNftNonces });
			await mintDKeyNFT({ keyPrice, token2Buy, signature })
				.then((data) => {
					results = [data, null];
				})
				.catch((err) => {
					results = [null, err];
					handleBuyInfoError(err);
				});
		} finally {
			setIsBuyDNFT(false);
		}
		return results;
	};

	return { buyDKeyNFT, isBuyDNFT };
};
