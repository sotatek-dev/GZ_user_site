import { Form, Input, Pagination } from 'antd';
import BoxPool from 'common/components/boxPool';
import Countdown from 'common/components/countdown';
import Dropdown from 'common/components/dropdown';
import CustomRadio from 'common/components/radio';
import MyTable from 'common/components/table';
import Link from 'next/link';
import { selectList } from 'pages/token-presale-rounds/detail/[index]';
import { useState } from 'react';

const columns = [
	{
		title: 'Species',
		dataIndex: 'Species',
		render: (Species: string) => {
			return <Link href='/nft-detail'>{Species}</Link>;
		},
		width: '30%',
	},
	{
		title: 'Rarity',
		dataIndex: 'Rarity',
		render: (Rarity: string) => {
			return <Link href='/nft-detail'>{Rarity}</Link>;
		},
		width: '30%',
	},
	{
		title: 'Claimable date',
		dataIndex: 'Claimable_date',
		render: (Claimable_date: string) => {
			return <Link href='/nft-detail'>{Claimable_date}</Link>;
		},
		width: '30%',
	},
	{
		render: () => {
			return (
				<Link className='flex justify-end' href='/nft-detail'>
					<button className='text-[#D47AF5] font-semibold rounded-[40px] px-[27px] py-[7px] border-[2px] border-[#D47AF5] flex ml-auto'>
						Claim
					</button>
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
	const price = 1000;
	const [tokenCode, setTokenCode] = useState('BUSD');

	const canBuyKey = true;

	const onFinish = () => {};
	return (
		<div className='flex flex-col gap-y-6'>
			<div className='flex gap-x-6'>
				<BoxPool customClass='w-[50%]'>
					<div className='flex justify-between items-center pb-[12px] border-[#36c1ff1a] border-b-[3px]'>
						<h5 className={`text-[18px] font-semibold text-white`}>
							My profile
						</h5>

						<button className='rounded-[40px] border-[2px] border-[#D47AF5] font-semibold text-[#D47AF5] px-[25px] py-[8px]'>
							Save
						</button>
					</div>
					<Form
						name='verify-email'
						className='mt-[22px]'
						layout='vertical'
						onFinish={onFinish}
						onFinishFailed={() => {}}
						autoComplete='off'
						initialValues={{}}
					>
						<Form.Item
							label='My wallet address:'
							name='my-wallet-address'
							rules={[]}
						>
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
					</Form>
				</BoxPool>
				<BoxPool customClass='w-[50%]'>
					<h5 className={`text-[18px] font-semibold text-white  pb-[27px] `}>
						Buy Info
					</h5>
					{canBuyKey ? (
						<div className='flex items-center rounded-[5px] bg-[#00d26133] px-[15px] py-[13px] w-[100%] mb-2 leading-[20px]'>
							<img src='/icons/check-circle.svg' className='mr-[10px]' />
							<p className='text-[#00D261]  text-[14px]'>
								Great, You are eligible to buy this key
							</p>
						</div>
					) : (
						<div className='flex items-center rounded-[5px] bg-[#f0272733] px-[15px] py-[13px] w-[100%] mb-2 leading-[20px]'>
							<img src='/icons/info-circle.svg' className='mr-[10px]' />
							<p className='text-[#F02727]  text-[14px]'>
								You are not elegible to buy this key
							</p>
						</div>
					)}
					<div className='flex items-center  justify-between  mt-6 text-[#ffffff80] pb-[24px] border-b-[2px] border-[#ffffff12]'>
						<div className='flex items-center'>
							<div className='text-[14px] mr-[10px]'>Price:</div>
							<CustomRadio
								onChange={(e) => setTokenCode(e.target.value)}
								options={selectList}
								defaultValue={tokenCode}
							/>
						</div>

						<div className='text-[16px] text-[white] font-semibold'>
							{price} {tokenCode}
						</div>
					</div>
					<Countdown
						descriptionStyle='!text-[#ffffff80] !text-[12px] !leading-4 '
						boxStyle='!bg-[#8080801a] !text-[white]'
						titleStyle='!font-normal !text-[#ffffff80]'
						customClass='mt-[20px] '
						title='You can buy key in '
					/>
					{canBuyKey && (
						<button
							className={`w-[100%] rounded-[40px] font-semibold py-[9px] mt-[36px] btn-gradient`}
						>
							Buy
						</button>
					)}
				</BoxPool>
			</div>
			<div>
				<BoxPool>
					<h5
						className={`text-[18px] font-semibold text-white  pb-[12px] border-[#36c1ff1a] border-b-[3px]`}
					>
						My dNFT
					</h5>
					<div className='mt-6'>
						<div className='flex gap-x-2 mb-6 justify-between'>
							<div>
								<Dropdown
									customStyle='mr-[10px]'
									label='All statuses'
									list={[]}
								/>
								<Dropdown label='All types' list={[]} />
							</div>
							<button className='text-[white] rounded-[40px] px-[27px] py-[7px] border-[2px] border-[#ffffff4d]'>
								Claim all
							</button>
						</div>
						<MyTable columns={columns} dataSource={datafake} />
						<div className='mt-[30px] w-[100%] flex justify-end'>
							<Pagination
								defaultCurrent={1}
								total={200}
								showLessItems
								showSizeChanger={false}
								className='flex items-center'
							/>
						</div>
					</div>
				</BoxPool>
			</div>
		</div>
	);
};

export default MyProfile;
