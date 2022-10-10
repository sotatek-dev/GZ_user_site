import { genDNFTContractEther } from './instance';

export const permanentMerge = async (listTokenId: number[] | false) => {
	try {
		const contract = await genDNFTContractEther();
		const res = await contract.permanentMerge(listTokenId);
		const result = await res.wait(1);
		return [result, null];
	} catch (error) {
		return [null, error];
	}
};

export const temporaryMerge = async (
	listTokenId: string[] | string,
	sessionId: string,
	signatureMerge: string
) => {
	try {
		const contract = await genDNFTContractEther();
		const res = await contract.temporaryMerge(
			listTokenId,
			sessionId,
			signatureMerge
		);
		const result = await res.wait(1);
		return [result, null];
	} catch (error) {
		return [null, error];
	}
};
