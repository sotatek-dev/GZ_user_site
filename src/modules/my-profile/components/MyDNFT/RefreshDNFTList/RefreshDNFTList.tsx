import { ReloadOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import classNames from 'classnames';
import { useAppSelector } from 'stores';
import LastUpdatedTime from '../LastUpdatedTime';

export default function RefreshDNFTList({
	handleGetDNFTs,
}: {
	handleGetDNFTs: VoidFunction;
}) {
	const { loading, dnfts } = useAppSelector((state) => state.myProfile);

	const handleRefresh = async () => {
		handleGetDNFTs();
	};

	const clns = classNames('!block', {
		'animate-spin': loading && dnfts != undefined,
	});

	return (
		<div className='flex gap-3'>
			<p>
				Last updated: <LastUpdatedTime />
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
