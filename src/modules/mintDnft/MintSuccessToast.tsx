import React from 'react';
import { Message } from 'modules/mintDnft/constants';

interface Props {
	txHash?: string;
}

const MintSuccessToast = ({ txHash }: Props) => {
	const openTxDetail = () => {
		window.open(`${process.env.NEXT_PUBLIC_BSC_CHAIN_ID}tx/${txHash}`);
	};

	return <div onClick={openTxDetail}>{Message.MINT_SUCCESS}</div>;
};

export default MintSuccessToast;
