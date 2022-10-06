import { Form, Input, message } from 'antd';
import { updateMyProfile } from 'apis/my-profile';
import BoxPool from 'common/components/boxPool';
import { useAppDispatch, useAppSelector } from 'stores';
import { getMyProfileRD } from 'stores/my-profile';
import { AbiKeynft } from 'web3/abis/types';
import { useContract } from 'web3/contracts/useContract';
import KeyNftAbi from 'web3/abis/abi-keynft.json';
import { NEXT_PUBLIC_KEYNFT } from 'web3/contracts/instance';
import Image from 'next/image';
import type { Rule } from 'antd/lib/form';
import { isValidEmail } from 'common/helpers/email';
import { useEffect, useState } from 'react';
import myProfileConstants from 'modules/my-profile/constant';

export default function PersonalInfo() {
	const form = Form.useForm()[0];
	const dispatch = useAppDispatch();
	const { userInfo } = useAppSelector((state) => state.myProfile);
	const keynftContract = useContract<AbiKeynft>(KeyNftAbi, NEXT_PUBLIC_KEYNFT);
	const [canSave, setCanSave] = useState(false);

	const { isLogin } = useAppSelector((state) => state.user);

	useEffect(() => {
		if (isLogin) {
			dispatch(getMyProfileRD(keynftContract));
		}
	}, [isLogin, dispatch, keynftContract]);

	const handleUpdateMyProfile = async (email: string) => {
		await updateMyProfile(
			{ email },
			async () => {
				message.success('Update profile successfully');
				dispatch(getMyProfileRD(keynftContract));
			},
			(err) => {
				message.error(JSON.stringify(err));
			}
		);
	};

	const onFinish = (values: { email: string }) => {
		handleUpdateMyProfile(values.email);
	};

	if (!userInfo) {
		return null;
	}

	const onFieldChanged = () => {
		if (
			form.isFieldsTouched(['email']) &&
			!form.getFieldsError(['email']).filter(({ errors }) => errors.length)
				.length
		) {
			setCanSave(true);
			return;
		}
		setCanSave(false);
	};

	return (
		<BoxPool customClass='desktop:w-[50%]'>
			<Form
				name='verify-email'
				layout='vertical'
				onFinish={onFinish}
				autoComplete='off'
				initialValues={userInfo}
				form={form}
				onFieldsChange={onFieldChanged}
			>
				<div className='flex justify-between items-center pb-[12px] border-[#36c1ff1a] border-b-[3px]'>
					<h1 className={`text-[18px] font-semibold text-white`}>My profile</h1>
					<Form.Item shouldUpdate className='submit'>
						<button
							type='submit'
							onClick={() => {
								form.submit();
							}}
							className='rounded-[40px] border-[2px] border-[#D47AF5] font-semibold text-[#D47AF5] px-[25px] py-[8px] disabled:bg-[#2B3A51] disabled:text-[#ffffff4d] disabled:border-[#2B3A51]'
							disabled={!canSave}
						>
							Save
						</button>
					</Form.Item>
				</div>
				<Form.Item
					label='My wallet address:'
					name='wallet_address'
					rules={[]}
					className='mt-[22px]'
				>
					<Input
						suffix={
							<button className='px-[10px]'>
								<Image src='/icons/copy.svg' width='20' height='20' alt='' />
							</button>
						}
						placeholder='My wallet address'
						className='custom-input-wrapper'
						disabled
					/>
				</Form.Item>
				<Form.Item
					label='Email address:'
					name='email'
					rules={[
						requiredValidate(),
						{
							validator: emailValidator,
						},
					]}
				>
					<Input placeholder='Email address' className='custom-input-wrapper' />
				</Form.Item>
				<Form.Item
					label='Number of key(s): '
					name='key_holding_count'
					rules={
						[
							// { required: true, message: 'This field cannot be empty.' },
						]
					}
				>
					<Input
						placeholder='Number of key'
						className='custom-input-wrapper'
						disabled
					/>
				</Form.Item>
			</Form>
		</BoxPool>
	);
}

const emailValidator = (_: unknown, value: string) => {
	if (value && !isValidEmail(value)) {
		return Promise.reject(new Error(myProfileConstants.INVALID_EMAIL));
	}
	return Promise.resolve();
};

export const requiredValidate = (): Rule => ({
	required: true,
	message: myProfileConstants.EMPTY_FIELD,
});
