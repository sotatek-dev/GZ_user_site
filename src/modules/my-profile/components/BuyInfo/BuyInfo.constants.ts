export enum BuyStatus {
	Unavailable,
	Upcomming,
	NFTRequired,
	Available,
}

interface BuyStatusConfig {
	message: string;
	icon: string;
	boxStyle: string;
	messageStyle: string;
	canBuy: boolean;
}

export const buyStatusConfigs: {
	[key in BuyStatus]: BuyStatusConfig | null;
} = {
	[BuyStatus.Unavailable]: null,
	[BuyStatus.Upcomming]: {
		message: 'Key can be mint when the dNFT sale round start',
		icon: '/icons/info-circle.svg',
		boxStyle:
			'flex items-center rounded-[5px] bg-[#f0272733] px-[15px] py-[13px] w-[100%] mb-2 leading-[20px]',
		messageStyle: 'text-[#F02727]  text-[0.875rem]',
		canBuy: false,
	},
	[BuyStatus.NFTRequired]: {
		message: 'You are not elegible to buy this key',
		icon: '/icons/info-circle.svg',
		boxStyle:
			'flex items-center rounded-[0.3125rem] bg-[#f0272733] px-[0.9375rem] py-[0.8125rem] w-[100%] mb-2 leading-[1.25rem]',
		messageStyle: 'text-[#F02727]  text-[0.875rem]',
		canBuy: false,
	},
	[BuyStatus.Available]: {
		message: 'Great! You are eligible to buy the key',
		icon: '/icons/check-circle.svg',
		boxStyle:
			'flex items-center rounded-[0.3125rem] bg-[#00d26133] px-[0.9375rem] py-[0.8125rem] w-[100%] mb-2 leading-[1.25rem]',
		messageStyle: 'text-[#00D261]  text-[0.875rem]',
		canBuy: true,
	},
};

export enum Token2Buy {
	BUSD = 'BUSD',
	BNB = 'BNB',
}
