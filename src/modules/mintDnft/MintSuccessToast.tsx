import React from 'react';
import { Message } from 'modules/mintDnft/constants';

interface Props {
	txHash?: string;
}

const MintSuccessToast = ({ txHash }: Props) => {
	const openTxDetail = () => {
		window.open(
			`${process.env.NEXT_PUBLIC_BSC_BLOCK_EXPLORER_URL}tx/${txHash}`
		);
	};

	return (
		<div className={'cursor-pointer'} onClick={openTxDetail}>
			{Message.MINT_SUCCESS}
		</div>
	);
};

export default MintSuccessToast;
