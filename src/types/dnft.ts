export interface IDFNT {
	created_at: Date;
	email_notice_sent: boolean;
	random_at: Array<string>;
	rank_level: string;
	species: string;
	status: string;
	token_id: string;
	type: string;
	updated_at: Date;
	wallet_address: string;
	_id: string;
	isChecked: boolean;
	is_locked: boolean;
	metadata?: unknown;
}
