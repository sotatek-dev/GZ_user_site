import { ReloadOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import classNames from 'classnames';
import { LIMIT_10 } from 'common/constants/constants';
import { useAppDispatch, useAppSelector } from 'stores';
import { getMyClaimableDNFTsCountRD, getMyDNFTsRD } from 'stores/my-profile';
import LastUpdatedTime from '../LastUpdatedTime';

export default function RefreshDNFTList({
	filter: { page, type, status },
}: {
	filter: { page: number; type: string; status: string };
}) {
	const dispatch = useAppDispatch();
	const { loading, dnfts } = useAppSelector((state) => state.myProfile);

	const handleRefresh = async () => {
		dispatch(
			getMyDNFTsRD({
				page,
				limit: LIMIT_10,
				species: type,
				rarities: status,
			})
		);
		if (dnfts) {
			dispatch(getMyClaimableDNFTsCountRD());
		}
	};

	const clns = classNames('!block', {
		'animate-spin': loading && dnfts != undefined,
	});

	return (
		<div className='flex gap-3'>
			<p className='flex gap-2'>
				<span className='hidden desktop:block'>Last updated:</span>
				<LastUpdatedTime />
			</p>
			<Button
				onClick={handleRefresh}
				type='text'
				className='!text-white p-0 h-fit leading-[1]'
			>
				<ReloadOutlined className={clns} />
			</Button>
		</div>
	);
}
