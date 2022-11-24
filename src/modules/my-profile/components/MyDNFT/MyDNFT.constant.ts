export enum DNFTStatuses {
	WaitToMerge = 'wait-to-merge',
	WaitToClaim = 'wait-to-claim',
	Claimable = 'claimable',
	Claimed = 'normal',
	ClaimTemMerge = 'temmerge-claimable',
}

export const DNFTStatus = {
	[DNFTStatuses.WaitToClaim]: {
		title: 'Claim',
		disabled: true,
	},
	[DNFTStatuses.Claimable]: {
		title: 'Claim',
		disabled: false,
	},
	[DNFTStatuses.Claimed]: {
		title: 'Claimed',
		disabled: true,
	},
	[DNFTStatuses.WaitToMerge]: {
		title: 'Unmerge',
		disabled: false,
	},
	[DNFTStatuses.ClaimTemMerge]: {
		title: 'Claim Temporary',
		disabled: false,
	},
};
