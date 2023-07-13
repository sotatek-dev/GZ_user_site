import ImageBase from 'common/components/imageBase';

export default function LockedMask() {
	return (
		<div className='absolute inset-0 flex items-center justify-center w-full text-base font-semibold card-nft-lock z-[5]'>
			<div className='flex items-center justify-center w-full gap-2'>
				<ImageBase url='/icons/locked.svg' width={16} height={20} />
				<span>LOCKED NFT</span>
			</div>
		</div>
	);
}
