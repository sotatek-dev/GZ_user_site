import { useWeb3React } from '@web3-react/core';
import StorageUtils, { STORAGE_KEYS } from 'common/utils/storage';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { setLogin } from 'stores/user';
import { setAddressWallet } from 'stores/wallet';
import { useConnectWallet, useEagerConnect } from 'web3/hooks';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const triedEagerConnect = useEagerConnect();
	const { account, chainId, library } = useWeb3React();
	const { disconnectWallet } = useConnectWallet();
	const { isLogin } = useSelector((state) => state.user);

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
			account === accountConnected &&
			!isLogin
		) {
			setLogin(true);
			setAddressWallet(account);
		}
	}, [account, chainId, isLogin]);

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
