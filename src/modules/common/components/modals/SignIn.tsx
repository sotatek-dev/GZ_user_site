import { Form, Input } from 'antd';
import { IPramsLogin, login } from 'apis/login';
import { SIGN_MESSAGE } from 'web3/constants/envs';
import { useActiveWeb3React } from 'web3/hooks';
import get from 'lodash/get';
import { setLogin, setUserInfo } from 'stores/user';
import {
	setStatusModalConnectWallet,
	setStepModalConnectWallet,
} from 'stores/modal';
import { STEP_MODAL_CONNECTWALLET } from 'common/constants/constants';
import { removeStorageWallet } from 'web3/hooks/useConnectWallet';
import { STORAGE_KEYS } from 'common/utils/storage';
import Button from '../button';
import { setAddressWallet } from 'stores/wallet';

interface IFormRule {
	email: string;
}

export default function ModalSignin() {
	const { library, account } = useActiveWeb3React();

	const onFinish = (values: IFormRule) => {
		const { email } = values;
		handleLogin(email);
	};

	const handleLogin = async (email: string) => {
		if (library && account) {
			try {
				const signer = (library as any).getSigner();
				const signature = await signer.signMessage(`${SIGN_MESSAGE}`, account);
				if (signature) {
					const params = {
						wallet_address: account,
						signature,
						sign_message: SIGN_MESSAGE,
						email: email,
					} as IPramsLogin;
					await login(
						params,
						(res: any) => {
							const { auth, wallet_address } = get(res, 'data.data', {});
							const { expire_in, token } = auth;
							sessionStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
							sessionStorage.setItem(STORAGE_KEYS.EXPIRE_IN, expire_in);
							sessionStorage.setItem(STORAGE_KEYS.ACCOUNT, wallet_address);
							const userInfo = {
								walletAddress: wallet_address,
							};
							setUserInfo(userInfo);
							setLogin(true);
							setAddressWallet(wallet_address);
							setStatusModalConnectWallet(false);
							setStepModalConnectWallet(
								STEP_MODAL_CONNECTWALLET.SELECT_NETWORK_AND_WALLET
							);
						},
						() => {}
					);
				}
			} catch (error) {
				removeStorageWallet();
			}
		}
	};

	return (
		<div>
			<h5 className='font-bold text-white text-center pb-8 text-[32px] leading-10 font-semibold'>
				Enter your email
			</h5>
			<div className='pt-6'>
				<p className='font-normal text-sm pb-3 text-center text-[#ffffffb3]'>
					Please enter your email to be notified of account updates
				</p>
				<Form
					name='verify-email'
					layout='vertical'
					onFinish={onFinish}
					onFinishFailed={() => {}}
					autoComplete='off'
					initialValues={{}}
					className='flex justify-center flex-col'
				>
					<Form.Item
						label=''
						name='email'
						rules={[{ required: true, message: 'This field cannot be empty.' }]}
					>
						<Input
							placeholder='Email address'
							className='custom-input-wrapper'
						/>
					</Form.Item>
					<Button
						classCustom='bg-charcoal-purple !rounded-[40px] mx-auto'
						htmlType='submit'
						label='Confirm'
					/>
				</Form>
			</div>
		</div>
	);
}
