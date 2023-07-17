import { useEffect } from 'react';
import { Form, Input, Skeleton, Typography } from 'antd';
import type { Rule } from 'antd/lib/form';
import BoxPool from 'common/components/boxPool';
import { useAppDispatch, useAppSelector } from 'stores';
import { getMyProfileRD } from 'stores/my-profile';
import { AbiKeynft, AbiPresalepool } from 'web3/abis/types';
import { useContract } from 'web3/contracts/useContract';
import KeyNftAbi from 'web3/abis/abi-keynft.json';
import PresalePoolAbi from 'web3/abis/abi-presalepool.json';
import {
	NEXT_PUBLIC_KEYNFT,
	NEXT_PUBLIC_PRESALE_POOL,
} from 'web3/contracts/instance';
import myProfileConstants from 'modules/my-profile/constant';
import { fetchKeyBalance } from 'stores/key-dnft/key-dnft.thunks';
import { useWeb3React } from '@web3-react/core';

const { Paragraph } = Typography;

export default function PersonalInfo() {
	const { account } = useWeb3React();
	const form = Form.useForm()[0];
	const dispatch = useAppDispatch();
	const { userInfo } = useAppSelector((state) => state.myProfile);
	const { keyBalance, isLoadKeyBalance } = useAppSelector(
		(state) => state.keyDnft
	);
	const keyNftContract = useContract<AbiKeynft>(KeyNftAbi, NEXT_PUBLIC_KEYNFT);
	const presalePoolContract = useContract<AbiPresalepool>(
		PresalePoolAbi,
		NEXT_PUBLIC_PRESALE_POOL
	);
	// const [canSave, setCanSave] = useState(false);

	useEffect(() => {
		if (!keyNftContract || !account) return;

		dispatch(getMyProfileRD({ keyNftContract, presalePoolContract }));
		dispatch(fetchKeyBalance({ keyNftContract, account }));
	}, [keyNftContract, presalePoolContract, dispatch, account]);

	useEffect(() => {
		form.setFieldValue('key_holding_count', keyBalance);
	}, [form, keyBalance]);

	// const handleUpdateMyProfile = async (email: string) => {
	// 	await updateMyProfile(
	// 		{ email },
	// 		() => {
	// 			message.success('Update profile successfully');
	// 			setCanSave(false);
	// 			dispatch(getMyProfileRD({ keyNftContract, presalePoolContract }));
	// 		},
	// 		(err) => {
	// 			message.error(JSON.stringify(err));
	// 		}
	// 	);
	// };

	// const onFinish = async (values: { email: string }) => {
	// 	if (canSave) {
	// 		await handleUpdateMyProfile(values.email);
	// 	}
	// };

	// const onFieldChanged = () => {
	// 	if (
	// 		form.isFieldsTouched(['email']) &&
	// 		!form.getFieldsError(['email']).filter(({ errors }) => errors.length)
	// 			.length
	// 	) {
	// 		setCanSave(true);
	// 		return;
	// 	}
	// 	setCanSave(false);
	// };

	if (userInfo == undefined || (keyBalance == undefined && isLoadKeyBalance)) {
		return (
			<BoxPool customClass='desktop:w-[50%]'>
				<div className='flex justify-between items-center pb-[12px] border-[#36c1ff1a] border-b-[3px]'>
					<h5 className={`text-[18px] font-semibold text-white`}>My profile</h5>
					{/* <Form.Item shouldUpdate className='submit'>
						<button
							className='rounded-[40px] border-[2px] border-[#D47AF5] font-semibold text-[#D47AF5] px-[25px] py-[8px] disabled:bg-[#2B3A51] disabled:text-[#ffffff4d] disabled:border-[#2B3A51]'
							disabled={!canSave}
						>
							Save
						</button>
					</Form.Item> */}
				</div>
				<Skeleton
					title={true}
					paragraph={false}
					active
					style={{ marginTop: '2rem' }}
				/>
				<br />
				<Skeleton.Input active block />

				<Skeleton
					title={true}
					paragraph={false}
					active
					style={{ marginTop: '2rem' }}
				/>
				<br />
				<Skeleton.Input active block />

				<Skeleton
					title={true}
					paragraph={false}
					active
					style={{ marginTop: '2rem' }}
				/>
				<br />
				<Skeleton.Input active block />
			</BoxPool>
		);
	}

	return (
		<BoxPool customClass='desktop:w-[50%]'>
			<Form
				name='verify-email'
				layout='vertical'
				autoComplete='off'
				initialValues={{ ...userInfo, key_holding_count: keyBalance }}
				form={form}
				// onFieldsChange={onFieldChanged}
			>
				<div className='flex justify-between items-center pb-[12px] border-[#36c1ff1a] border-b-[3px]'>
					<h5 className={`text-[18px] font-semibold text-white`}>My profile</h5>
					{/* <Form.Item shouldUpdate className='submit'>
						<button
							className='rounded-[40px] border-[2px] border-[#D47AF5] font-semibold text-[#D47AF5] px-[25px] py-[8px] disabled:bg-[#2B3A51] disabled:text-[#ffffff4d] disabled:border-[#2B3A51]'
							disabled={!canSave}
						>
							Save
						</button>
					</Form.Item> */}
				</div>
				<Form.Item
					label='My wallet address:'
					name='wallet_address'
					rules={[]}
					className='mt-[22px]'
				>
					<Input
						suffix={<Paragraph copyable={{ text: userInfo?.wallet_address }} />}
						placeholder='My wallet address'
						className='custom-input-wrapper'
						disabled
					/>
				</Form.Item>
				<Form.Item label='Number of key(s): ' name='key_holding_count'>
					<Input
						value={keyBalance}
						placeholder='Number of key'
						className='custom-input-wrapper'
						disabled
					/>
				</Form.Item>
			</Form>
		</BoxPool>
	);
}

export const requiredValidate = (): Rule => ({
	required: true,
	message: myProfileConstants.EMPTY_FIELD,
});
