import { useWeb3React } from '@web3-react/core';
import StorageUtils, { STORAGE_KEYS } from 'common/utils/storage';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { setAccessToken, setLogin } from 'stores/user';
import { setAddressWallet, setNetwork } from 'stores/wallet';
import { BSC_CHAIN_ID_HEX } from 'web3/constants/envs';
import { useConnectWallet, useEagerConnect } from 'web3/hooks';
import { useUpdateBalance } from 'web3/hooks/useUpdateBalance';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const triedEagerConnect = useEagerConnect();
	const { account, chainId, library } = useWeb3React();
	const { disconnectWallet } = useConnectWallet();
	const { updateBalance } = useUpdateBalance();
	const { isLogin, accessToken } = useSelector((state) => state.user);

	useEffect(() => {
		const accountConnected = StorageUtils.getSectionStorageItem(
			STORAGE_KEYS.ACCOUNT
		);
		const accessToken = StorageUtils.getSectionStorageItem(
			STORAGE_KEYS.ACCESS_TOKEN
		);
		const networkConnected = StorageUtils.getItemObject(STORAGE_KEYS.NETWORK);
		if (!accountConnected && !accessToken) return;
		if (
			account &&
			accessToken &&
			accountConnected &&
			account === accountConnected &&
			!isLogin
		) {
			setLogin(true);
			setAccessToken(accessToken);
			setAddressWallet(account);
			setNetwork(networkConnected);
		}
	}, [account, chainId, isLogin]);

	useEffect(() => {
		const { ethereum } = window;
		ethereum?._metamask?.isUnlocked()?.then((isUnlocked: boolean) => {
			if (!isUnlocked) {
				disconnectWallet();
				return;
			}
		});

		if (!library && !library?.provider && !account) return;

		const onChangeAccount = () => {
			disconnectWallet();
		};

		const onChangeNetwork = (chainId: string | number) => {
			if (chainId !== BSC_CHAIN_ID_HEX) return;
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
	}, [account, library]);

	useEffect(() => {
		if (accessToken) {
			updateBalance();
		}
	}, [accessToken]);

	triedEagerConnect;

	return (
		<div
		// value={{ isAuthChecking: !triedEagerConnect, isAuth, signIn, signOut }}
		>
			{children}
		</div>
	);
};
