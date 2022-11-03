import ImageBase from 'common/components/imageBase';

export default function LockedMask() {
	return (
		<div className='card-nft-lock absolute inset-0 w-full flex justify-center items-center z-20 text-base font-semibold'>
			<div className='w-full flex justify-center items-center gap-2'>
				<ImageBase url='/icons/locked.svg' width={16} height={20} />
				<span>LOCKED NFT</span>
			</div>
		</div>
	);
}
