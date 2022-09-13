import Image from 'next/image';

export const IconDynamic = ({ className, image, onClick }: any) => {
	return (
		<figure onClick={onClick} className={`${className}`}>
			<Image src={image} alt='icon' className='w-full h-full' />
		</figure>
	);
};
