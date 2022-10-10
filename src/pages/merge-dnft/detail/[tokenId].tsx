import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { CheckCircleOutlined } from '@ant-design/icons';

import { getDetailDNFT } from 'apis/mergeDnft';
import { get } from 'lodash';
import { message } from 'antd';
import Image from 'next/image';

interface IProperties {
	[key: string]: {
		type: string;
		value: string;
	};
}

const MergeDNFTDetail = () => {
	//router
	const router = useRouter();
	const {
		query: { tokenId = '' },
	} = router;
	const [properties, setProperties] = useState<IProperties>({});
	const [imageDNFT, setImageDNFT] = useState<string>('');

	useEffect(() => {
		if (tokenId) {
			handleGetDetailDNFT(tokenId);
		}
	}, [tokenId]);

	const handleGetDetailDNFT = async (tokenId: string | string[]) => {
		const [response, error] = await getDetailDNFT(tokenId);
		if (response) {
			const metadata = get(response, 'data.metadata', {});
			const { image, properties } = metadata;
			// tạm thời repalace domain do BE chưa đẩy ảnh lên s3 được
			const imageDNFT = image;
			setProperties(properties);
			setImageDNFT(imageDNFT);
		}
		if (error) {
			message.error('error');
		}
	};
	return (
		<div>
			<div className='bg-[#00d26133] px-4 py-3 flex items-center'>
				<CheckCircleOutlined twoToneColor='#00D261' className='mr-3' />
				<div className='text-sm font-normal text-[#00D261]'>
					Congratulation, you got a new NFT
				</div>
			</div>
			<div className='flex gap-x-12 mt-8'>
				<div className='!w-[600px] !h-[600px]'>
					<Image
						src={imageDNFT}
						width='600px'
						height='600px'
						alt='dnft'
						objectFit='fill'
					/>
				</div>
				<div className='grid grid-cols-2 gap-[20px] h-fit'>
					{Object.keys(properties).map((propertyName: string, index) => {
						const { type, value } = properties[propertyName];
						return (
							<div key={index}>
								<div className='text-gray-40 text-base mb-2'>{type}</div>
								<div className='px-4 py-2 rounded-md border-2 border-[#ffffff33] w-[320px]'>
									{value}
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default MergeDNFTDetail;
