import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

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
			<div className='bg-[#00d26133] px-4 py-3 flex items-center rounded-[5px]'>
				<Image
					src='/icons/CheckCircleOutlined.svg'
					width={20}
					height={20}
					layout='fixed'
					alt='CheckCircleOutlined'
				/>
				<div className='rounded-[5px] text-sm font-normal text-[#00D261] ml-3'>
					Congratulation, you got a new sdNFT
				</div>
			</div>
			<div className='flex flex-col desktop:flex-row desktop:justify-center justify-center gap-x-12 mt-8'>
				<div className='mb-6 !w-full !h-[312px] desktop:!w-[345px] desktop:!h-[345px] desktop:mb-0 flex !justify-center !items-center'>
					<Image
						src={imageDNFT}
						width='252px'
						height='252px'
						alt='dnft'
						objectFit='fill'
					/>
				</div>
				<div className='grid grid-cols-1 desktop:grid-cols-2 desktop:gap-x-[50px] gap-[20px] h-fit desktop:w-[690px]'>
					{attributes &&
						Object.keys(attributes).map((attribute: string, index) => {
							const value = attributes[attribute];
							if (value === 0) return null;

							return (
								<div key={index}>
									<div className='text-gray-40 text-base mb-2'>
										{ATTRIBUTES[attribute]}
									</div>
									<div className='flex justify-start items-center	px-4 py-2 rounded-md border-2 border-[#ffffff33] w-full h-[47px] desktop:max-w-[320px]'>
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
