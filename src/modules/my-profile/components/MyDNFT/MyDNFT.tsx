import { Pagination } from 'antd';
import BoxPool from 'common/components/boxPool';
import MyTable from 'common/components/table';
import Link from 'next/link';

export default function MyDNFT() {
	return (
		<BoxPool>
			<div className={'flex justify-between items-start mb-3'}>
				<h5 className={`text-h6 font-semibold text-white`}>My dNFT</h5>
				<button
					className={
						'desktop:hidden text-h8 text-white rounded-[40px] px-7 py-2 border-[2px] border-white/[0.3]'
					}
				>
					Claim all
				</button>
			</div>
			<hr className={'border-t border-blue-20/[0.1]'} />
			<div className='mt-6'>
				<div className='flex gap-x-2 mb-6 justify-between'>
					<div
						className={
							'flex items-center justify-between desktop:justify-start grow gap-2.5'
						}
					>
						{/* <Dropdown
          customStyle={'!w-1/2 desktop:!w-[160px]'}
          label='All statuses'
          list={[]}
        />
        <Dropdown
          customStyle={'!w-1/2 desktop:!w-[160px]'}
          label='All types'
          list={[]}
        /> */}
					</div>
					<button
						className={
							'hidden desktop:block text-h8 text-white rounded-[40px] px-7 py-2 border-[2px] border-white/[0.3]'
						}
					>
						Claim all
					</button>
				</div>
				<MyTable
					columns={columns}
					dataSource={datafake}
					className={'hidden desktop:inline-block w-full'}
				/>
				<div className={'desktop:hidden'}>
					{datafake.map((value, item) => {
						return (
							<>
								<div className={'flex flex-col gap-6 mb-6'} key={item}>
									<hr className={'border-t border-white/[0.07]'} />
									<Link className='flex justify-end' href='/nft-detail'>
										<button className='text-[#D47AF5] font-semibold rounded-[40px] px-[27px] py-[7px] border-[2px] border-[#D47AF5] flex ml-auto'>
											Claim
										</button>
									</Link>
									<div className={'flex justify-between items-center'}>
										<div className={'text-h8 text-blue-20 font-medium'}>
											Species
										</div>
										<Link
											className={'text-h8 text-white font-bold'}
											href='/nft-detail'
										>
											{value.Species}
										</Link>
									</div>
									<div className={'flex justify-between items-center'}>
										<div className={'text-h8 text-blue-20 font-medium'}>
											Rarity
										</div>
										<Link
											className={'text-h8 text-white font-bold'}
											href='/nft-detail'
										>
											{value.Rarity}
										</Link>
									</div>
									<div className={'flex justify-between items-center'}>
										<div className={'text-h8 text-blue-20 font-medium'}>
											Claimable data
										</div>
										<Link
											className={'text-h8 text-white font-bold'}
											href='/nft-detail'
										>
											{value.Claimable_date}
										</Link>
									</div>
								</div>
							</>
						);
					})}
				</div>
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
	);
}

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
