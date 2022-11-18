const getMessage = (
	isConnectWallet: boolean,
	haveEnoughGXZBalance: boolean,
	haveEnoughBalance: boolean,
	isRoyalty: boolean
) => {
	if (isConnectWallet && haveEnoughGXZBalance) {
		if (!haveEnoughBalance) {
			return "You don't have enough BNB/BUSD";
		} else if (!isRoyalty) {
			return "You don't have enough BUSD for royalty";
		} else {
			return 'You are eligible to mint this dNFT';
		}
	} else {
		return 'You are not eligible to mint this dNFT';
	}
};

export default getMessage;
