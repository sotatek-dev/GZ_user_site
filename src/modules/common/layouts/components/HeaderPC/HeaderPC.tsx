import { Dropdown, Menu } from 'antd';
import { IconDynamic } from 'common/assets/iconography/iconBundle';
import { EllipsisMiddle } from 'common/utils/functions';
import StorageUtils, { STORAGE_KEYS } from 'common/utils/storage';
import Image from 'next/image';
import { useAppSelector } from 'stores';
import { useWeb3React } from '@web3-react/core';
import ConnectButton from '../ConnectButton';
import { useConnectWallet } from 'web3/hooks';

export default function HeaderPC() {
	const { disconnectWallet } = useConnectWallet();
	const { account } = useWeb3React();
	const isLogin = useAppSelector((state) => state.user.isLogin);
	const { networkName } = StorageUtils.getItemObject(STORAGE_KEYS.NETWORK);

	return (
		<div className='justify-end hidden w-full desktop:flex'>
			{isLogin ? (
				<Dropdown
					overlay={
						<Menu className='remove-ant-menu'>
							<Menu.Item
								key='disconnect'
								onClick={disconnectWallet}
								className='rounded-[20px] !bg-black-russian text-white py-2 px-5 !h-[40px] font-medium text-base cursor-pointer'
							>
								<div className='flex items-center justify-center'>
									<IconDynamic
										image='/icons/disconnect.svg'
										className='!w-7 !h-7 !mr-2'
									/>
									Disconnect
								</div>
							</Menu.Item>
						</Menu>
					}
					trigger={['click']}
					className='w-fit'
				>
					<div className='rounded-[40px] bg-black-russian flex justify-center items-center px-5 !h-[42px] cursor-pointer border-[2px] border-[#ffffff1a]'>
						<div className='text-[#ffffff80]'>{networkName}</div>
						<div className='mx-[12px] text-[#ffffff80]'>|</div>
						<IconDynamic
							image='/icons/wallet-color.svg'
							className='w-6 h-6 mr-3'
						/>
						<div className='text-[#D47AF5] font-semibold leading-[1.5rem] mr-[0.75rem]'>
							{EllipsisMiddle(account)}
						</div>
						<Image
							layout='intrinsic'
							width='10px'
							height='10px'
							src='/icons/arrow-down.svg'
							alt='icon'
							objectFit='contain'
						/>
					</div>
				</Dropdown>
			) : (
				<div className='w-fit'>
					<ConnectButton />
				</div>
			)}
		</div>
	);
}
