import { Form, Input } from 'antd';
import { useState } from 'react';
import { useActiveWeb3React } from 'web3/hooks';
import { useConnectWallet } from 'web3/hooks/useConnectWallet';
import Button from '../button';

interface IFormRule {
	email: string;
}
const EMAIL_REGEX = /^[\w]{1,64}@([\w]{1,253}\.)+(com|org|net)$/;

export default function ModalSignin() {
	const { handleLogin } = useConnectWallet();
	const { account } = useActiveWeb3React();
	const [isDisabledConfirm, setDisableConfirm] = useState<boolean>(true);
	const handlerEmailChange = (values: { email: string }) => {
		if (values?.email && !EMAIL_REGEX.test(values?.email)) {
			return setDisableConfirm(true);
		}
		if (!values?.email) return setDisableConfirm(true);
		return setDisableConfirm(false);
	};

	const emailValidator = (_: unknown, value: string) => {
		if (value && !EMAIL_REGEX.test(value)) {
			return Promise.reject(
				new Error('Please enter a correct email, example "abc@mail.com"')
			);
		}
		return Promise.resolve();
	};

	const onFinish = (values: IFormRule) => {
		const { email } = values;
		if (!account) return;
		handleLogin(account, email);
	};

	return (
		<div className={'px-4'}>
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
					onValuesChange={handlerEmailChange}
					autoComplete='off'
					className='flex justify-center flex-col'
				>
					<Form.Item
						label=''
						name='email'
						rules={[
							{ required: true, message: 'This field is required' },
							{
								validator: emailValidator,
							},
						]}
					>
						<Input
							placeholder='Email address'
							className='custom-input-wrapper'
						/>
					</Form.Item>
					<Button
						isDisabled={isDisabledConfirm}
						classCustom='bg-charcoal-purple !rounded-[40px] !mt-[30px] mx-auto !px-[45px] !py-[11px] text-[#777] !font-semibold'
						htmlType='submit'
						label='Confirm'
					/>
				</Form>
			</div>
		</div>
	);
}
