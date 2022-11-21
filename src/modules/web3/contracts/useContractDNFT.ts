import { convertHexToNumber, fromWei } from 'common/utils/functions';
import { get } from 'lodash';
import { genDNFTContractEther } from './instance';

export const permanentMerge = async (
	listTokenId: number[],
	timesTamp: number,
	sessionId: string,
	signature: string
) => {
	try {
		const contract = await genDNFTContractEther();
		const estimatedGas = await contract.estimateGas.permanentMerge(
			listTokenId,
			timesTamp,
			sessionId,
			signature
		);
		const res = await contract.permanentMerge(
			listTokenId,
			timesTamp,
			sessionId,
			signature,
			{
				gasLimit: estimatedGas.toString(),
			}
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
		const estimatedGas = await contract.estimateGas.temporaryMerge(
			listTokenId,
			timesTamp,
			sessionId,
			signature
		);
		const res = await contract.temporaryMerge(
			listTokenId,
			timesTamp,
			sessionId,
			signature,
			{
				gasLimit: estimatedGas.toString(),
			}
		);
		const result = await res.wait(1);
		return [result, null];
	} catch (error) {
		return [null, error];
	}
};

export const getMergeTax = async () => {
	try {
		const contract = await genDNFTContractEther();
		const res = await contract.getMergeTax();
		const mergeTax = fromWei(convertHexToNumber(get(res, '_hex')));
		return [mergeTax, null];
	} catch (error) {
		return [null, error];
	}
};
