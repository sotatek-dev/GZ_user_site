import { message } from 'antd';
import myProfileConstants from 'modules/my-profile/constant';
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
		try {
			setIsBuyDNFT(true);
			const [signature] = await getSignature();
			await mintDKeyNFT({ keyPrice, token2Buy, signature })
				.then(() => {
					message.success(myProfileConstants.TRANSACTION_COMPLETED);
				})
				.catch((err) => {
					console.log({ err });

					handleBuyInfoError(err);
				});
		} finally {
			setIsBuyDNFT(false);
		}
	};

	return { buyDKeyNFT, isBuyDNFT };
};
