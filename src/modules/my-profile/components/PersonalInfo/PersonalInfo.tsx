import { Form, Input, message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { updateMyProfile } from 'apis/my-profile';
import BoxPool from 'common/components/boxPool';
import { useAppDispatch, useAppSelector } from 'stores';
import { getMyProfileRD } from 'stores/my-profile';

export default function PersonalInfo() {
	const form = useForm()[0];
	const dispatch = useAppDispatch();
	const { userInfo } = useAppSelector((state) => state.myProfile);

	const handleUpdateMyProfile = async (email: string) => {
		await updateMyProfile(
			{ email },
			async () => {
				message.success('Update profile successfully');
				dispatch(getMyProfileRD());
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

	return (
		<BoxPool customClass='desktop:w-[50%]'>
			<div className='flex justify-between items-center pb-[12px] border-[#36c1ff1a] border-b-[3px]'>
				<h5 className={`text-[18px] font-semibold text-white`}>My profile</h5>

				<button
					onClick={() => {
						form.submit();
					}}
					className='rounded-[40px] border-[2px] border-[#D47AF5] font-semibold text-[#D47AF5] px-[25px] py-[8px] disabled:bg-[#2B3A51] disabled:text-[#ffffff4d] disabled:border-[#2B3A51]'
				>
					Save
				</button>
			</div>

			<Form
				name='verify-email'
				className='mt-[22px]'
				layout='vertical'
				onFinish={onFinish}
				autoComplete='off'
				initialValues={userInfo}
				form={form}
			>
				<Form.Item label='My wallet address:' name='wallet_address' rules={[]}>
					<Input
						suffix={
							<button className='px-[10px]'>
								<img src='/icons/copy.svg' alt='' />
							</button>
						}
						placeholder='My wallet address'
						className='custom-input-wrapper'
					/>
				</Form.Item>
				<Form.Item
					label='Email address:'
					name='email'
					rules={
						[
							// { required: true, message: 'This field cannot be empty.' },
						]
					}
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
					<Input placeholder='Number of key' className='custom-input-wrapper' />
				</Form.Item>
			</Form>
		</BoxPool>
	);
}
