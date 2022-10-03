import Image from 'next/image';

interface IIconDynamicProps {
	className?: string;
	image: string;
	onClick?: () => void;
	alt?: string;
}

export const IconDynamic = (props: IIconDynamicProps) => {
	const { className, image, onClick, alt } = props;
	return (
		<div onClick={onClick} className={`${className}`}>
			<Image
				src={image}
				alt={alt || 'icon'}
				width='100%'
				height='100%'
				layout='responsive'
				className='w-full h-full'
			/>
		</div>
	);
};
