export interface IDNFT {
	_id: string;
	wallet_address: string;
	status: string;
	type: string;
	token_id: string;
	random_at: string[];
	email_notice_sent: boolean;
	metadata: IDNFTMetadata;
}
export interface IProperty {
	value: string;
}
export interface IProperties {
	armor: IProperty;
	shoes: IProperty;
	gloves: IProperty;
	fur: IProperty;
	eyes: IProperty;
	hat: IProperty;
}

export interface IAttributes {
	strength: string;
	speed: string;
	agility: string;
	durability: string;
	intelligence: string;
}

export interface IDNFTMetadata {
	species: string;
	rankLevel: string;
	properties: IProperties;
	attribute: IAttributes;
	imageUrl: string;
}

export interface IBuyKeyStatus {
	message: string;
	icon: string;
	boxStyle: string;
	messageStyle: string;
	canBuy: boolean;
}
