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
		try {
			setIsBuyDNFT(true);
			const [signature] = await getSignature();
			await mintDKeyNFT({ keyPrice, token2Buy, signature });
		} finally {
			setIsBuyDNFT(false);
		}
	};

	return { buyDKeyNFT, isBuyDNFT };
};
