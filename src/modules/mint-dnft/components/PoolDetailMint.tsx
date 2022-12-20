import React from 'react';
import { formatBigNumber } from 'common/utils/functions';
import BigNumber from 'bignumber.js';

interface Props {
	maxSaleAmount: BigNumber.Value;
	totalSold: BigNumber.Value;
}

const PoolDetailMint: React.FC<Props> = (props) => {
	const { maxSaleAmount, totalSold } = props;

	return (
		<>
			<div
				className={
					'flex flex-col desktop:flex-row desktop:items-center gap-6 mb-5 font-medium text-[13px] h-fit'
				}
			>
				<div className={'flex justify-between items-center desktop:w-[33%]'}>
					<div className={'flex items-center'}>
						<div
							className={'min-w-[10px] min-h-[10px] rounded-sm bg-red-10 mr-2'}
						/>
						Total sdNFT
					</div>
					<div>{formatBigNumber(maxSaleAmount)}</div>
				</div>
				<div
					className={
						'hidden desktop:block border border-white/[.07] h-full min-h-[1.25em]'
					}
				/>
				<div className={'flex justify-between items-center desktop:w-[33%]'}>
					<div className={'flex items-center'}>
						<div
							className={'min-w-[10px] min-h-[10px] rounded-sm bg-red-10 mr-2'}
						/>
						Remaining
					</div>
					<div>
						{formatBigNumber(new BigNumber(maxSaleAmount).minus(totalSold))}
					</div>
				</div>
				<div
					className={
						'hidden desktop:block border border-white/[.07] h-full min-h-[1.25em]'
					}
				/>
				<div className={'flex justify-between items-center desktop:w-[33%]'}>
					<div className={'flex items-center'}>
						<div
							className={'min-w-[10px] min-h-[10px] rounded-sm bg-red-10 mr-2'}
						/>
						sdNFT Minted
					</div>
					<div>{formatBigNumber(totalSold)}</div>
				</div>
			</div>
		</>
	);
};

export default PoolDetailMint;
