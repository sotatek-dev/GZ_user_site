import { useAppSelector } from 'stores';
import ConnectButton from '../../ConnectButton';
import ConnectedWallet from '../ConnectedWallet';

export default function Wallet() {
	const isLogin = useAppSelector((state) => state.user.isLogin);

	return isLogin ? <ConnectedWallet /> : <ConnectButton />;
}
