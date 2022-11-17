type IMergeNftRule = {
	[key: string]: { [key: number]: string };
};

export enum ERankLevel {
	Common = 'Common',
	Rare = 'Rare',
	UltraRare = 'UltraRare',
	Legendary = 'Legendary',
	UltraLegendary = 'UltraLegendary',
	APEX = 'APEX',
	MAX = 'MAX',
}

export const MergeNftRule: IMergeNftRule = {
	[ERankLevel.Common]: {
		5: ERankLevel.Rare,
		6: ERankLevel.UltraRare,
		8: ERankLevel.Legendary,
		10: ERankLevel.UltraLegendary,
	},
	[ERankLevel.Rare]: {
		2: ERankLevel.UltraRare,
		3: ERankLevel.Legendary,
		4: ERankLevel.UltraLegendary,
	},
	[ERankLevel.UltraRare]: {
		3: ERankLevel.Legendary,
		4: ERankLevel.UltraLegendary,
	},
	[ERankLevel.Legendary]: {
		3: ERankLevel.UltraLegendary,
	},
	[ERankLevel.UltraLegendary]: {
		2: ERankLevel.APEX,
	},
};

export const PROPERTY = {
	FUR: 'fur',
	GLOVES: 'gloves',
	GLOVESDEFAULT: 'glovesDefault',
};

export const ATTRIBUTES: { [key: string]: string } = {
	strength: 'Strength',
	speed: 'Speed',
	agility: 'Agility',
	durability: 'Durability',
	intelligence: 'Intelligence',
	cosmicPower1: 'Cosmic Power 1',
	cosmicPower2: 'Cosmic Power 2',
	cosmicPower3: 'Cosmic Power 3',
	cosmicPower4: 'Cosmic Power 4',
};
