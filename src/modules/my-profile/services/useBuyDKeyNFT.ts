import { handleBuyInfoError } from 'modules/my-profile/helpers/handleError';
import { useState } from 'react';
import { getSignature } from '.';
import { Token2Buy } from '../components/BuyInfo/BuyInfo.constants';
import { useMintDKeyNFT } from './useMintDKeyNFT';

export const useBuyDKeyNFT = () => {
	const [isBuyDNFT, setIsBuyDNFT] = useState(false);
	const { mintDKeyNFT } = useMintDKeyNFT();

	const buyDKeyNFT = async ({
		keyPrice,
		token2Buy,
	}: {
		keyPrice?: number;
		token2Buy: Token2Buy;
	}) => {
		let results = [null, null];
		try {
			setIsBuyDNFT(true);
			const [signature] = await getSignature();
			await mintDKeyNFT({ keyPrice, token2Buy, signature })
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				.then((data: any) => {
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
