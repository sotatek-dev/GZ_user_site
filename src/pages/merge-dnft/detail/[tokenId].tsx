import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { CheckCircleOutlined } from '@ant-design/icons';

import { getDetailDNFT } from 'apis/mergeDnft';
import { get } from 'lodash';
import { message } from 'antd';
import Image from 'next/image';
import { ATTRIBUTES } from 'common/constants/mergeDNFT';

interface IAttribute {
	[key: string]: string | number;
}

const MergeDNFTDetail = () => {
	//router
	const router = useRouter();
	const {
		query: { tokenId = '' },
	} = router;
	const [attributes, setAttributes] = useState<IAttribute>({});
	const [imageDNFT, setImageDNFT] = useState<string>('');

	useEffect(() => {
		if (tokenId) {
			handleGetDetailDNFT(tokenId);
		}
	}, [tokenId]);

	const handleGetDetailDNFT = async (tokenId: string | string[]) => {
		const [response, error] = await getDetailDNFT(tokenId);
		if (error) {
			message.error('error');
		}

		if (response) {
			const metadata = get(response, 'data.metadata', {});
			const { image, attribute } = metadata;
			const imageDNFT = image;
			setAttributes(attribute);
			setImageDNFT(imageDNFT);
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
			<div className='flex flex-col desktop:flex-row justify-center gap-x-12 mt-8'>
				<div className='!w-[252px] !h-[252px] desktop:!w-[600px] desktop:!h-[600px]'>
					<Image
						src={imageDNFT}
						width='600px'
						height='600px'
						alt='dnft'
						objectFit='fill'
					/>
				</div>
				<div className='grid grid-cols-1 desktop:grid-cols-2 gap-[20px] h-fit w-full'>
					{Object.keys(attributes).map((attribute: string, index) => {
						const value = attributes[attribute];
						if (value === 0) return null;

						return (
							<div key={index}>
								<div className='text-gray-40 text-base mb-2'>
									{ATTRIBUTES[attribute]}
								</div>
								<div className='px-4 py-2 rounded-md border-2 border-[#ffffff33] w-full desktop:w-[320px]'>
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
