import { Skeleton } from 'antd';
import Image from 'next/image';
import { useBalance } from 'web3/queries';
import { BuyStatusConfig } from '../BuyInfo.constants';

interface Props {
	buyStatus: BuyStatusConfig | null;
}

export default function BuyAlert({ buyStatus }: Props) {
	// GXZ balance
	const { isLoading: isFetchGxzBalance } = useBalance(
		process.env.NEXT_PUBLIC_GXZ_TOKEN || ''
	);
	// BUSD balance
	const { isLoading: isFetchBUSDBalance } = useBalance(
		process.env.NEXT_PUBLIC_BUSD_ADDRESS || ''
	);

	if (!buyStatus || isFetchGxzBalance || isFetchBUSDBalance) {
		return <Skeleton.Input active block style={{ height: '46px' }} />;
	}

	return (
		<div className={buyStatus.boxStyle}>
			<Image src={buyStatus.icon} width='20' height='20' alt='' />
			<p className={`${buyStatus.messageStyle} text-[0.875rem]`}>
				{buyStatus.message}
			</p>
		</div>
	);
}
