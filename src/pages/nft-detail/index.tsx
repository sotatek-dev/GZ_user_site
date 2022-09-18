import Dropdown from 'common/components/dropdown';

const NFTDetail = () => {
	return (
		<div>
			<div className='text-[32px] font-medium mb-6'>NFT Detail</div>
			<div className='flex gap-x-16'>
				<div className='text-[32px] font-medium'>
					<div className='mb-6'>Property</div>
					<div className='bg-black-russian rounded-[10px] w-[300px] h-[370px] flex justify-center items-center'>
						NFT IMAGE
					</div>
				</div>
				<div className='text-[32px] font-medium '>
					<div className='mb-6'>Attribute</div>
					<div className='flex flex-col gap-y-2'>
						<Dropdown label='Attribute 1' list={[]} />
						<Dropdown label='Attribute 2' list={[]} />
						<Dropdown label='Attribute 3' list={[]} />
						<Dropdown label='Attribute 4' list={[]} />
						<Dropdown label='Attribute 5' list={[]} />
						<Dropdown label='Attribute 6' list={[]} />
						<Dropdown label='Attribute 7' list={[]} />
						<Dropdown label='Attribute 8' list={[]} />
						<Dropdown label='Attribute 9' list={[]} />
						<Dropdown label='Attribute 10' list={[]} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default NFTDetail;
