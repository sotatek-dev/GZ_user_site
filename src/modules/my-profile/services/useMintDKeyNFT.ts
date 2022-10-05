import { AbiKeynft } from 'web3/abis/types';
import { useContract } from 'web3/contracts/useContract';
import KeyNFTABI from 'web3/abis/abi-keynft.json';
import { NEXT_PUBLIC_BUSD, NEXT_PUBLIC_KEYNFT } from 'web3/contracts/instance';
import { useActiveWeb3React, useApprovalBusd } from 'web3/hooks';
import { Token2Buy } from 'modules/my-profile/components/BuyInfo/BuyInfo.constants';
import { useAppSelector } from 'stores';

export const useMintDKeyNFT = () => {
	const { account } = useActiveWeb3React();
	const keyNFTContract = useContract<AbiKeynft>(KeyNFTABI, NEXT_PUBLIC_KEYNFT);
	const { tryApproval, allowanceAmount } = useApprovalBusd(
		NEXT_PUBLIC_BUSD,
		NEXT_PUBLIC_KEYNFT
	);
	const { systemSetting, busd2Bnb } = useAppSelector(
		(state) => state.systemSetting
	);

	const bnbPrice =
		busd2Bnb &&
		systemSetting &&
		busd2Bnb.times(systemSetting.key_price).times(1e18).toString();

	const mintDKeyNFT = async ({
		keyPrice,
		token2Buy,
		signature,
	}: {
		token2Buy: Token2Buy;
		keyPrice?: number;
		signature: string;
	}) => {
		if (!keyNFTContract || !keyPrice) return;

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

		// window.open(`${bscscanUrl}/tx/${tx.transactionHash}`, '_blank');
	};

	const busdBuy = async (signature: string) => {
		if (!keyNFTContract || !account) return;
		const tx = await keyNFTContract.buyUsingBUSD(account, signature);
		return await tx.wait();
	};

	const bnbBuy = async (signature: string) => {
		if (!keyNFTContract || !account) return;
		const tx = await keyNFTContract.buyUsingBNB(account, signature, {
			value: bnbPrice,
		});
		return await tx.wait();
	};

	return { mintDKeyNFT };
};
