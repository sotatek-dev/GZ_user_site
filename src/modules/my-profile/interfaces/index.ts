export interface IDNFT {
	_id: string;
	wallet_address: string;
	status: string;
	metadata: IDNFTMetadata;
	type: string;
	token_id: string;
	species: string;
	rank_level: string;
	deleted_at: number;
	random_at: string[];
	email_notice_sent: boolean;
	created_at: Date;
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
	image: string;
}

export interface IBuyKeyStatus {
	message: string;
	icon: string;
	boxStyle: string;
	messageStyle: string;
	canBuy: boolean;
}
