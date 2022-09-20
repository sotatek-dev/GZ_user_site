import Button from 'common/components/button';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import CustomRadio from 'common/components/radio';
import Countdown from 'common/components/countdown';
import { useState } from 'react';
import { selectList } from 'pages/token-presale-rounds/detail/[index]';

const RescueDNFT = () => {
	const [isRescue] = useState<boolean>(false);

	return (
		<div className='flex gap-x-3'>
			<div className='bg-black-russian w-[300px] h-[587px] rounded-[10px] flex justify-center items-center'>
				Rescue dNFT
			</div>

			<div className='w-full'>
				<h6 className='text-lg font-medium pb-5'>Rescue</h6>
				<Button
					isDisabled={!isRescue}
					label='Rescue'
					classCustom='bg-green mb-5 '
				/>
				<div className='flex items-center bg-black-russian rounded-[10px] px-6 py-3 text-sm mb-5'>
					<div className='flex items-center mr-10'>
						Price: 175 BUSD
						<Tooltip
							className='ml-2'
							placement='bottom'
							title='First 24h: 175 BUSD then 235 BUSD'
						>
							<ExclamationCircleOutlined />
						</Tooltip>
					</div>
					<CustomRadio
						onChange={() => {}}
						defaultValue='BUSD'
						options={selectList}
					/>
				</div>
				{/* <div className='mb-1 text-lg font-medium'>Pool remaining</div> */}
				<div className='flex items-center gap-x-6 bg-black-russian rounded-[10px] px-6 py-3 text-sm mb-5 font-medium'>
					<div className='flex justify-between items-center w-[33%]'>
						<div className='flex items-center'>
							<div className='w-[10px] h-[10px] rounded-sm bg-red-10 mr-2' />
							Current NFTs can be rescued
						</div>
						<div>{600}</div>
					</div>
				</div>

				<div className='flex flex-col bg-black-russian rounded-[10px] px-6 py-3 text-sm mb-5'>
					{isRescue ? (
						<>
							<Button
								label='You are elegible to mint this dNFT '
								classCustom='bg-green'
							/>
							<div className='font-medium text-sm mt-6'>
								Notice: to mint this dNFT requires 5,000 GXZ Token
							</div>
							<Countdown
								customClass='mt-6 mr-auto'
								title='Minting phase for Presale 1 end in'
							/>
						</>
					) : (
						<Button
							label='You are not elegible to rescue this dNFT. Click here to mint key'
							classCustom='bg-red-10'
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default RescueDNFT;
