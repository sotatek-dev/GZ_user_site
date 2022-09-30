import React from 'react';
import { Message } from 'modules/mint-dnft/constants';

interface Props {
  txHash?: string;
}

const MintSuccessToast = ({ txHash }: Props) => {
  const openTxDetail = () => {
    window.open(`${process.env.NEXT_PUBLIC_ETH_BLOCK_EXPLORER_URL}tx/${txHash}`)
  }

  return (
    <div onClick={openTxDetail}>
      {Message.MINT_SUCCESS}
    </div>
  );
};

export default MintSuccessToast;