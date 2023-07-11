import { Dropdown } from 'antd';
import { IconDynamic } from 'common/assets/iconography/iconBundle';
import { EllipsisMiddle } from 'common/utils/functions';
import StorageUtils, { STORAGE_KEYS } from 'common/utils/storage';
import Image from 'next/image';
import { useAppSelector } from 'stores';
import { useWeb3React } from '@web3-react/core';
import ConnectButton from '../ConnectButton';
import DisconnectButton from './DisconnectButton';

export default function HeaderPC() {
	const { account } = useWeb3React();
	const isLogin = useAppSelector((state) => state.user.isLogin);
	const { networkName } = StorageUtils.getItemObject(STORAGE_KEYS.NETWORK);

	return (
		<div className='justify-end hidden w-full desktop:flex'>
			{isLogin ? (
				<Dropdown
					overlay={<DisconnectButton />}
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
