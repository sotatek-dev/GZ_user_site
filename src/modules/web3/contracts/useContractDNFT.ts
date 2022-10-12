import { genDNFTContractEther } from './instance';

export const permanentMerge = async (
	listTokenId: number[],
	timesTamp: number,
	sessionId: string,
	signature: string
) => {
	try {
		const contract = await genDNFTContractEther();
		const res = await contract.permanentMerge(
			listTokenId,
			timesTamp,
			sessionId,
			signature
		);
		const result = await res.wait(1);
		return [result, null];
	} catch (error) {
		return [null, error];
	}
};

export const temporaryMerge = async (
	listTokenId: number[],
	timesTamp: number,
	sessionId: string,
	signature: string
) => {
	try {
		const contract = await genDNFTContractEther();
		const res = await contract.temporaryMerge(
			listTokenId,
			timesTamp,
			sessionId,
			signature
		);
		const result = await res.wait(1);
		return [result, null];
	} catch (error) {
		return [null, error];
	}
};
