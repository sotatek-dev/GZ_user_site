// import { getContractInstanceEther } from 'blockchain/ether';

import DNFTABI from '../abis/abi-dnft.json';
import KeyNFTABI from '../abis/abi-keynft.json';
import PreSalePoolABI from '../abis/abi-presalepool.json';

import { getContractInstanceEther } from './ether';

// const NEXT_PUBLIC_BUSD = process.env.NEXT_PUBLIC_BUSD_ADDRESS || '';
const NEXT_PUBLIC_DNFT = process.env.NEXT_PUBLIC_DNFT_ADDRESS || '';
const NEXT_PUBLIC_KEYNFT = process.env.NEXT_PUBLIC_KEYNFT_ADDRESS || '';
const NEXT_PUBLIC_PRESALE_POOL =
	process.env.NEXT_PUBLIC_PRESALE_POOL_ADDRESS || '';

// export const genMainContractEther = () => {
//   return getContractInstanceEther(DNFTABI, NEXT_PUBLIC_BUSD);
// };

export const genDNFTContractEther = () => {
	return getContractInstanceEther(DNFTABI, NEXT_PUBLIC_DNFT);
};

export const genKeyNFTContractEther = () => {
	return getContractInstanceEther(KeyNFTABI, NEXT_PUBLIC_KEYNFT);
};

export const genPresalePoolContractEther = () => {
	return getContractInstanceEther(PreSalePoolABI, NEXT_PUBLIC_PRESALE_POOL);
};
