import { Message } from 'modules/mintDnft/constants';

const getMessage = (
	isConnectWallet: boolean,
	haveEnoughGXZBalance: boolean,
	haveEnoughBalance: boolean,
	isRoyalty: boolean
) => {
	if (isConnectWallet && haveEnoughGXZBalance) {
		if (!haveEnoughBalance) {
			return Message.NOT_HAVE_ENOUGH_BALANCE;
		} else if (!isRoyalty) {
			return Message.NOT_ROYALTY;
		} else {
			return Message.ELIGIBLE;
		}
	} else {
		return Message.NOT_ELIGIBLE;
	}
};

export default getMessage;
