import { genPresalePoolContractEther } from './instance';
const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

export const getSalePhaseInfo = async (userAddress: string) => {
	try {
		const contract = await genPresalePoolContractEther();
		const res = await contract.getSalePhaseInfo(userAddress);
		if (res !== NULL_ADDRESS) {
			return res;
		}
		return;
	} catch (error) {
		return error;
	}
};
