import { EllipsisMiddle } from 'common/utils/functions';
import StorageUtils, { STORAGE_KEYS } from 'common/utils/storage';
import { useActiveWeb3React } from 'web3/hooks';

export default function ConnectedWallet() {
	const { account } = useActiveWeb3React();
	const { networkName } = StorageUtils.getItemObject(STORAGE_KEYS.NETWORK);

	return (
		<div className={'flex items-center'}>
			<div className='text-[#ffffff80]'>{networkName}</div>
			<div className='mx-[12px] text-[#ffffff80]'>|</div>
			<div className='text-purple-30 font-semibold leading-[1.5rem] mr-[0.75rem]'>
				{EllipsisMiddle(account)}
			</div>
		</div>
	);
}
