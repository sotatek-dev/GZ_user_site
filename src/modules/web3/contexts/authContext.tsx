import { useWeb3React } from '@web3-react/core';
import StorageUtils, { STORAGE_KEYS } from 'common/utils/storage';
import React, { useEffect } from 'react';
import { setLogin } from 'stores/user';
import { setAddressWallet } from 'stores/wallet';
// import { useQueryClient } from 'react-query';
// import { Web3Provider } from '@ethersproject/providers';
// import { useLocation } from 'react-router';
// import {
// 	hasStorageJwtToken,
// 	isJwtTokenExpired,
// 	removeStorageJwtToken,
// } from 'common/helpers/jwt';
// import { ConnectorKey } from 'web3/connectors';
import {
	useConnectWallet,
	useEagerConnect,
	// useConnectWallet,
} from 'web3/hooks';
// import { useLogin } from 'common/services/mutations';

// export const authContext = React.createContext<
// 	| {
// 			isAuthChecking: boolean;
// 			isAuth: boolean;
// 			signIn: (connector: ConnectorKey) => Promise<void>;
// 			signOut: VoidFunction;
// 	  }
// 	| undefined
// >(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const triedEagerConnect = useEagerConnect();
	const { account, chainId, library } = useWeb3React();
	const { disconnectWallet } = useConnectWallet();
	// const { disconnectWallet } = useConnectWallet();

	useEffect(() => {
		const accountConnected = StorageUtils.getSectionStorageItem(
			STORAGE_KEYS.ACCOUNT
		);
		const accessToken = StorageUtils.getSectionStorageItem(
			STORAGE_KEYS.ACCESS_TOKEN
		);

		if (
			account &&
			accessToken &&
			accountConnected &&
			account === accountConnected
		) {
			setLogin(true);
			setAddressWallet(account);
		}
	}, [account, chainId]);

	useEffect(() => {
		const { ethereum } = window as any;
		ethereum?._metamask.isUnlocked().then((isUnlocked: any) => {
			if (!isUnlocked) {
				disconnectWallet();
			}
		});

		if (!library && !library?.provider && !account) {
			return;
		}

		const onChangeAccount = () => {
			disconnectWallet();
		};

		const onChangeNetwork = () => {
			disconnectWallet();
		};

		if (library?.provider && library.provider?.on) {
			library.provider &&
				library.provider?.on('accountsChanged', onChangeAccount);
			library.provider && library.provider?.on('chainChanged', onChangeNetwork);
		}
		return () => {
			library?.provider?.removeListener('accountsChanged', onChangeAccount); // need func reference to remove correctly
			library?.provider?.removeListener('chainChanged', onChangeNetwork); // need func reference to remove correctly
		};
	}, [account, library, disconnectWallet]);

	triedEagerConnect;

	return (
		<div
		// value={{ isAuthChecking: !triedEagerConnect, isAuth, signIn, signOut }}
		>
			{children}
		</div>
	);
};
