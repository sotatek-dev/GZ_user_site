export const DNFTStatusMap = {
	claimable: {
		title: 'Claim',
		disabled: false,
	},
	'wait-to-merge': {
		title: 'Unmerge',
		disabled: false,
	},
	normal: {
		title: 'Claimed',
		disabled: true,
	},
	'wait-to-claim': {
		title: 'Claim',
		disabled: true,
	},
	'wait-to-confirm': {
		title: 'Merging',
		disabled: true,
	},
};
