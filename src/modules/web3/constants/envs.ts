// const {
// 	REACT_APP_ETH_CHAIN_ID: ETH_CHAIN_ID = '',
// 	REACT_APP_ETH_CHAIN_ID_HEX: ETH_CHAIN_ID_HEX = '',
// 	REACT_APP_ETH_BLOCK_EXPLORER_URL: ETH_BLOCK_EXPLORER_URL = '',
// 	REACT_APP_ETH_RPC_URL: ETH_RPC_URL = '',
// 	REACT_APP_ETH_NAME: REACT_APP_ETH_NAME = '',
// } = process.env;
const ETH_CHAIN_ID = process.env.NEXT_PUBLIC_ETH_CHAIN_ID;
const ETH_CHAIN_ID_HEX = process.env.NEXT_PUBLIC_ETH_CHAIN_ID_HEX;
const ETH_BLOCK_EXPLORER_URL = process.env.NEXT_PUBLIC_ETH_BLOCK_EXPLORER_URL;
const ETH_RPC_URL = process.env.NEXT_PUBLIC_ETH_RPC_URL;
const REACT_APP_ETH_NAME = process.env.NEXT_PUBLIC_ETH_NAME;

export {
	ETH_CHAIN_ID,
	ETH_CHAIN_ID_HEX,
	ETH_BLOCK_EXPLORER_URL,
	ETH_RPC_URL,
	REACT_APP_ETH_NAME,
};
