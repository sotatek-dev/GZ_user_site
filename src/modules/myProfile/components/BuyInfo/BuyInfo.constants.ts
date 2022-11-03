import myProfileConstants from 'modules/myProfile/constant';

export enum BuyStatus {
	Unavailable,
	Upcomming,
	NFTRequired,
	Available,
	NotEnoughBalance,
	NotEnoughRoyalty,
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
		message: myProfileConstants.BUYINFO_MESSAGE_UPCOMMING,
		icon: '/icons/info-circle.svg',
		boxStyle:
			'flex items-center gap-3 rounded-[5px] bg-[#f0272733] px-[15px] py-[13px] w-[100%] mb-2 leading-[20px]',
		messageStyle: 'text-[#F02727]',
		canBuy: false,
	},
	[BuyStatus.NFTRequired]: {
		message: myProfileConstants.BUYINFO_MESSAGE_NFT_REQUIRED,
		icon: '/icons/info-circle.svg',
		boxStyle:
			'flex items-center gap-3 rounded-[0.3125rem] bg-[#f0272733] px-[0.9375rem] py-[0.8125rem] w-[100%] mb-2 leading-[1.25rem]',
		messageStyle: 'text-[#F02727]',
		canBuy: false,
	},
	[BuyStatus.NotEnoughBalance]: {
		message: myProfileConstants.BUYINFO_MESSAGE_NOT_ENOUGH_BALANCE,
		icon: '/icons/info-circle.svg',
		boxStyle:
			'flex items-center gap-3 rounded-[0.3125rem] bg-[#f0272733] px-[0.9375rem] py-[0.8125rem] w-[100%] mb-2 leading-[1.25rem]',
		messageStyle: 'text-[#F02727]',
		canBuy: false,
	},
	[BuyStatus.NotEnoughRoyalty]: {
		message: myProfileConstants.BUYINFO_MESSAGE_NOT_ENOUGH_ROYALTY,
		icon: '/icons/info-circle.svg',
		boxStyle:
			'flex items-center gap-3 rounded-[0.3125rem] bg-[#f0272733] px-[0.9375rem] py-[0.8125rem] w-[100%] mb-2 leading-[1.25rem]',
		messageStyle: 'text-[#F02727]',
		canBuy: false,
	},
	[BuyStatus.Available]: {
		message: myProfileConstants.BUYINFO_MESSAGE_AVAILABLE,
		icon: '/icons/check-circle.svg',
		boxStyle:
			'flex items-center gap-3 rounded-[0.3125rem] bg-[#00d26133] px-[0.9375rem] py-[0.8125rem] w-[100%] mb-2 leading-[1.25rem]',
		messageStyle: 'text-[#00D261]',
		canBuy: true,
	},
};

export enum Token2Buy {
	BUSD = 'BUSD',
	BNB = 'BNB',
}
