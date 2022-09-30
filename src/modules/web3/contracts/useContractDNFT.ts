import { genPresalePoolContractEther } from './instance';
// const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

export const getSalePhaseInfo = async (saleRoundId: number) => {
	try {
		const contract = await genPresalePoolContractEther();
		const res = await contract.salePhaseStatistics(saleRoundId);
		return [res, null];
	} catch (error) {
		return [null, error];
	}
};
