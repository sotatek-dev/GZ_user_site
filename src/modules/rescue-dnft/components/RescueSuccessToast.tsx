import React from 'react';
import { Message } from 'modules/mint-dnft/constants';

interface Props {
	txHash?: string;
}

const RescueSuccessToast = ({ txHash }: Props) => {
	const openTxDetail = () => {
		window.open(
			`${process.env.NEXT_PUBLIC_BSC_BLOCK_EXPLORER_URL}tx/${txHash}`
		);
	};

	return (
		<div className={'cursor-pointer'} onClick={openTxDetail}>
			{Message.RESCUE_SUCCESS}
		</div>
	);
};

export default RescueSuccessToast;
