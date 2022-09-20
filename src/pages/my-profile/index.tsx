import { Form, Input } from 'antd';
import { ColumnType } from 'antd/lib/table';
import BoxPool from 'common/components/boxPool';
import Button from 'common/components/button';
import Countdown from 'common/components/countdown';
import Dropdown from 'common/components/dropdown';
import CustomRadio from 'common/components/radio';
import MyTable from 'common/components/table';
import Link from 'next/link';
import { selectList } from 'pages/token-presale-rounds/detail/[index]';

const columns: ColumnType<any>[] = [
	{
		title: 'Species',
		dataIndex: 'Species',
		render: (Species: string) => {
			return <Link href='/nft-detail'>{Species}</Link>;
		},
	},
	{
		title: 'Rarity',
		dataIndex: 'Rarity',
		render: (Rarity: string) => {
			return <Link href='/nft-detail'>{Rarity}</Link>;
		},
	},
	{
		title: 'Claimable date',
		dataIndex: 'Claimable_date',
		render: (Claimable_date: string) => {
			return <Link href='/nft-detail'>{Claimable_date}</Link>;
		},
	},
	{
		render: () => {
			return (
				<Link href='/nft-detail'>
					<Button label='claim' classCustom='bg-green' />
				</Link>
			);
		},
	},
];

const datafake = [
	{
		Species: 'Kinga',
		Rarity: 'Common',
		Claimable_date: '30-Apr-2022 16:00',
	},
	{
		Species: 'Kinga',
		Rarity: 'Common',
		Claimable_date: '30-Apr-2022 16:00',
	},
	{
		Species: 'Kinga',
		Rarity: 'Common',
		Claimable_date: '30-Apr-2022 16:00',
	},
];

const MyProfile = () => {
	const onFinish = () => {};
	return (
		<div className='flex flex-col gap-y-6'>
			<div className='flex gap-x-6'>
				<BoxPool title='My profile' customClass='w-[50%]'>
					<Form
						name='verify-email'
						className='mt-2'
						layout='vertical'
						onFinish={onFinish}
						onFinishFailed={() => {}}
						autoComplete='off'
						initialValues={{}}
					>
						<Form.Item
							label='My wallet address:'
							name='my-wallet-address'
							rules={
								[
									// { required: true, message: 'This field cannot be empty.' },
								]
							}
						>
							<Input
								placeholder='My wallet address'
								className='custom-input-wrapper'
							/>
						</Form.Item>
						<Form.Item
							label='Email address:'
							name='email-address'
							rules={
								[
									// { required: true, message: 'This field cannot be empty.' },
								]
							}
						>
							<Input
								placeholder='Email address'
								className='custom-input-wrapper'
							/>
						</Form.Item>
						<Form.Item
							label='Number of key(s): '
							name='number-of-key'
							rules={
								[
									// { required: true, message: 'This field cannot be empty.' },
								]
							}
						>
							<Input
								placeholder='Number of key'
								className='custom-input-wrapper'
							/>
						</Form.Item>
						<Button
							htmlType='submit'
							label='Save'
							classCustom='bg-green ml-auto'
						/>
					</Form>
				</BoxPool>
				<BoxPool customClass='w-[50%]'>
					<div className='rounded-lg bg-green px-3 py-2 w-fit text-sm font-normal mb-2'>
						Great, You are eligible to buy this key
					</div>
					<Countdown title='You can buy key in ' />
					<Button label='Buy' classCustom='bg-green mt-6' />
					<div className='flex items-center text-3xl mt-6'>
						<div className='mr-6'>Price: 1 BUSD</div>
						<CustomRadio
							onChange={() => {}}
							defaultValue='BUSD'
							options={selectList}
						/>
					</div>
				</BoxPool>
			</div>
			<div>
				<BoxPool title='My dNFT'>
					<div className='mt-6'>
						<div className='flex gap-x-2 mb-6'>
							<Dropdown label='All statuses' list={[]} />
							<Dropdown label='All types' list={[]} />
							<Button label='Claim all' classCustom='bg-green ml-auto' />
						</div>
						<MyTable columns={columns} dataSource={datafake} />
					</div>
				</BoxPool>
			</div>
		</div>
	);
};

export default MyProfile;
