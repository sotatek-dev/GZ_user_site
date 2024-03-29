import { HEX_ZERO } from 'common/constants/constants';
import { convertHexToNumber, fromWei } from 'common/utils/functions';
import { get } from 'lodash';
import { genDNFTContractEther } from './instance';
import { Contract } from 'ethers';

export const permanentMerge = async (
	dnftContract: Contract,
	listTokenId: number[],
	timesTamp: number,
	sessionId: string,
	signature: string
) => {
	try {
		const estimatedGas = await dnftContract.estimateGas.permanentMerge(
			listTokenId,
			timesTamp,
			sessionId,
			signature
		);
		const res = await dnftContract.permanentMerge(
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
	dnftContract: Contract,
	listTokenId: number[],
	timesTamp: number,
	sessionId: string,
	signature: string
) => {
	try {
		const estimatedGas = await dnftContract.estimateGas.temporaryMerge(
			listTokenId,
			timesTamp,
			sessionId,
			signature
		);
		const res = await dnftContract.temporaryMerge(
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

export const getMergeTax = async (dnftContract: Contract) => {
	try {
		const res = await dnftContract.getMergeTax();
		const mergeTax = fromWei(convertHexToNumber(get(res, '_hex')));
		return [mergeTax, null];
	} catch (error) {
		return [null, error];
	}
};

export const getNonces = async (address: string) => {
	try {
		const contract = await genDNFTContractEther();
		const res = await contract.nonces(address);
		const nonce = convertHexToNumber(get(res, '_hex', HEX_ZERO));
		return [nonce, null];
	} catch (error) {
		return [null, error];
	}
};
