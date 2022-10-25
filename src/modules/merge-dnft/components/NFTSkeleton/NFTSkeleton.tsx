import { Skeleton } from 'antd';
import type { SkeletonProps } from 'antd';

export default function NFTSkeleton(props: SkeletonProps) {
	return <Skeleton className='dnft-skeleton' {...props} />;
}
