import { AbiKeynft, AbiPresalepool } from 'web3/abis/types';
import { useContract } from 'web3/contracts/useContract';
import KeyNFTAbi from 'web3/abis/abi-keynft.json';
import PresalePoolAbi from 'web3/abis/abi-presalepool.json';
import {
	NEXT_PUBLIC_BUSD,
	NEXT_PUBLIC_KEYNFT,
	NEXT_PUBLIC_PRESALE_POOL,
} from 'web3/contracts/instance';
import { useActiveWeb3React, useApproval } from 'web3/hooks';
import { Token2Buy } from 'modules/my-profile/components/BuyInfo/BuyInfo.constants';
import { getBusb2Bnb, getKeyPriceBusd } from './apis';

export const useMintDKeyNFT = () => {
	const { account } = useActiveWeb3React();
	const keyNFTContract = useContract<AbiKeynft>(KeyNFTAbi, NEXT_PUBLIC_KEYNFT);
	const presalePoolContract = useContract<AbiPresalepool>(
		PresalePoolAbi,
		NEXT_PUBLIC_PRESALE_POOL
	);
	const { tryApproval, allowanceAmount } = useApproval(
		NEXT_PUBLIC_BUSD,
		NEXT_PUBLIC_KEYNFT
	);

	const mintDKeyNFT = async ({
		keyPrice,
		token2Buy,
		signature,
	}: {
		token2Buy: Token2Buy;
		keyPrice?: number;
		signature: string;
	}) => {
		if (!keyNFTContract || keyPrice == undefined) return;

		let tx;
		if (token2Buy === Token2Buy.BUSD) {
			if (allowanceAmount && allowanceAmount.lt(keyPrice)) {
				await tryApproval(true);
			}
			tx = await busdBuy(signature);
		} else {
			tx = await bnbBuy(signature);
		}

		return tx;
	};

	const busdBuy = async (signature: string) => {
		if (!keyNFTContract || !account) return;

		const tx = await keyNFTContract.buyUsingBUSD(account, signature);
		return await tx.wait();
	};

	const bnbBuy = async (signature: string) => {
		if (!keyNFTContract || !account) return;

		const keyPriceBusd = await getKeyPriceBusd(keyNFTContract);

		if (!keyPriceBusd) return;
		const keyPriceBnb = await getBusb2Bnb(
			presalePoolContract,
			keyPriceBusd.times(1e18)
		);

		if (!keyPriceBnb) return;

		const tx = await keyNFTContract.buyUsingBNB(account, signature, {
			value: keyPriceBnb.toString(),
		});
		return await tx.wait();
	};

	return { mintDKeyNFT };
};
