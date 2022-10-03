import { IDNFTMetadata } from 'modules/my-profile/interfaces';
import Link from 'next/link';
import React from 'react';
import { Item } from 'common/components/dropdown';

export const columns = [
	{
		title: 'Species',
		dataIndex: 'metadata',
		render: (metadata: IDNFTMetadata) => {
			return <Link href='/nft-detail'>{metadata.species}</Link>;
		},
		width: '30%',
	},
	{
		title: 'Rarity',
		dataIndex: 'metadata',
		render: (metadata: IDNFTMetadata) => {
			return <Link href='/nft-detail'>{metadata.rankLevel}</Link>;
		},
		width: '30%',
	},
	{
		title: 'Claimable date',
		dataIndex: 'Claimable_date',
		render: (Claimable_date: string) => {
			return <Link href='/nft-detail'>{Claimable_date}</Link>;
		},
		width: '30%',
	},
	{
		render: (data: any) => {
			return (
				<div className='flex justify-end'>
					<button
						disabled={!data.canClaim}
						className='text-[#D47AF5] font-semibold rounded-[40px] px-[27px] py-[7px] border-[2px] border-[#D47AF5] flex ml-auto disabled:bg-[#2B3A51] disabled:border-[#2B3A51] disabled:text-white/[.3]'
					>
						Claim
					</button>
				</div>
			);
		},
	},
];

export const statusMap = {
	unavailable: null,
	upcoming: {
		message: 'Key can be mint when the dNFT sale round start',
		icon: '/icons/info-circle.svg',
		boxStyle:
			'flex items-center rounded-[5px] bg-[#f0272733] px-[15px] py-[13px] w-[100%] mb-2 leading-[20px]',
		messageStyle: 'text-[#F02727]  text-[0.875rem]',
		canBuy: false,
	},
	need_nft: {
		message: 'You are not elegible to buy this key',
		icon: '/icons/info-circle.svg',
		boxStyle:
			'flex items-center rounded-[0.3125rem] bg-[#f0272733] px-[0.9375rem] py-[0.8125rem] w-[100%] mb-2 leading-[1.25rem]',
		messageStyle: 'text-[#F02727]  text-[0.875rem]',
		canBuy: false,
	},
	available: {
		message: 'Great! You are eligible to buy the key',
		icon: '/icons/check-circle.svg',
		boxStyle:
			'flex items-center rounded-[0.3125rem] bg-[#00d26133] px-[0.9375rem] py-[0.8125rem] w-[100%] mb-2 leading-[1.25rem]',
		messageStyle: 'text-[#00D261]  text-[0.875rem]',
		canBuy: true,
	},
};

export const statusItems: Item[] = [
	{ key: 'common', label: 'Common' },
	{ key: 'rare', label: 'Rare' },
	{ key: 'ultra rare', label: 'Ultra Rare' },
	{ key: 'legendary', label: 'Legendary' },
	{ key: 'ultra legendary', label: 'Ultra Legendary' },
	{ key: 'apex', label: 'Apex' },
];

export const typesItems: Item[] = [
	{ key: 'adelio', label: 'Adelio' },
	{ key: 'kinga', label: 'Kinga' },
	{ key: 'empa', label: 'Empa' },
];
