import { Form, Input } from 'antd';
import { useActiveWeb3React } from 'web3/hooks';
import { useConnectWallet } from 'web3/hooks/useConnectWallet';
import Button from '../button';

interface IFormRule {
	email: string;
}

export default function ModalSignin() {
	const { handleLogin } = useConnectWallet();
	const { account } = useActiveWeb3React();

	const onFinish = (values: IFormRule) => {
		const { email } = values;
		if (!account) return;
		handleLogin(account, email);
	};

	return (
		<div>
			<h5 className='font-bold text-white text-center  text-[32px] leading-10 font-semibold'>
				Enter your email
			</h5>
			<div className='pt-[35px]'>
				<p className='font-normal text-[16px] pb-3 text-center text-[#ffffffb3] leading-[24px]'>
					Please enter your email to be notified of account updates
				</p>
				<Form
					name='verify-email'
					layout='vertical'
					onFinish={onFinish}
					onFinishFailed={() => { }}
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
						classCustom='bg-charcoal-purple !rounded-[40px] !mt-[30px] mx-auto !px-[45px] !py-[11px] text-[#777] !font-semibold'
						htmlType='submit'
						label='Confirm'
					/>
				</Form>
			</div>
		</div>
	);
}
