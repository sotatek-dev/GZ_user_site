export const IconDynamic = ({ className, image, onClick }: any) => {
	return (
		<div onClick={onClick} className={`${className}`}>
			<img src={image} alt='icon' className='w-full h-full' />
		</div>
	);
};
