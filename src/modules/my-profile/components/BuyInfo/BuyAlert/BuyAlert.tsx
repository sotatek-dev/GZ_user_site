import { Skeleton } from 'antd';
import Image from 'next/image';
import { BuyStatusConfig } from '../BuyInfo.constants';

interface Props {
	buyStatus: BuyStatusConfig | null;
}

export default function BuyAlert({ buyStatus }: Props) {
	if (!buyStatus) {
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
