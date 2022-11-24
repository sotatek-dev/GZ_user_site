import { BSC_CHAIN_ID } from './envs';

const bsc_chain_id = Number(BSC_CHAIN_ID);

const RPC = {
	[bsc_chain_id]: process.env.NEXT_PUBLIC_BSC_RPC_URL as string,
};

export default RPC;
