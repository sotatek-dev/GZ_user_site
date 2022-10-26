import { Menu } from 'antd';
import { IconDynamic } from 'common/assets/iconography/iconBundle';
import { useConnectWallet } from 'web3/hooks';

export default function DisconnectButton() {
	const { disconnectWallet } = useConnectWallet();

	return (
		<Menu className='remove-ant-menu'>
			<Menu.Item
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
	);
}
