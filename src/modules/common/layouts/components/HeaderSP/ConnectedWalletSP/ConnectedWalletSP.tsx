import { IconDynamic } from 'common/assets/iconography/iconBundle';
import { EllipsisMiddle } from 'common/utils/functions';
import StorageUtils, { STORAGE_KEYS } from 'common/utils/storage';
import { useAppSelector } from 'stores';
import { useConnectWallet } from 'web3/hooks';
import ConnectButton from '../../ConnectButton';
import { useWeb3React } from '@web3-react/core';

export default function ConnectedWalletSP() {
	const { account } = useWeb3React();
	const { disconnectWallet } = useConnectWallet();
	const isLogin = useAppSelector((state) => state.user.isLogin);
	const { networkName } = StorageUtils.getItemObject(STORAGE_KEYS.NETWORK);

	return (
		<div>
			{isLogin ? (
				<div className={'flex flex-col gap-6'}>
					<div className={'flex items-center'}>
						<div className='text-[#ffffff80]'>{networkName}</div>
						<div className='mx-[12px] text-[#ffffff80]'>|</div>
						<IconDynamic
							image='/icons/wallet-color.svg'
							className='w-6 h-6 mr-3'
						/>
						<div className='text-purple-30 font-semibold leading-[1.5rem] mr-[0.75rem]'>
							{EllipsisMiddle(account)}
						</div>
					</div>

					<div
						onClick={disconnectWallet}
						className='font-medium cursor-pointer text-red-10 text-h7 w-fit'
					>
						<div className='flex items-center justify-center'>
							<IconDynamic
								image='/icons/disconnect.svg'
								className='!w-7 !h-7 !mr-2'
							/>
							Disconnect
						</div>
					</div>
				</div>
			) : (
				<ConnectButton />
			)}
		</div>
	);
}
