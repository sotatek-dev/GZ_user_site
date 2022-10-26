import { Button } from 'antd';
import { IconDynamic } from 'common/assets/iconography/iconBundle';
import { STEP_MODAL_CONNECTWALLET } from 'common/constants/constants';
import {
	setStatusModalConnectWallet,
	setStepModalConnectWallet,
} from 'stores/modal';

export default function ConnectButton() {
	return (
		<Button
			className='connect-wallet w-fit'
			onClick={() => {
				setStatusModalConnectWallet(true);
				setStepModalConnectWallet(
					STEP_MODAL_CONNECTWALLET.SELECT_NETWORK_AND_WALLET
				);
			}}
		>
			Connect wallet
			<IconDynamic
				image='/icons/uwallet.svg'
				className='h-[1.375rem] w-[1.375rem] ml-2'
				alt='wallet_icon'
			/>
		</Button>
	);
}
