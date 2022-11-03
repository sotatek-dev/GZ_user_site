/* eslint-disable react-hooks/exhaustive-deps */
import { useWeb3React } from '@web3-react/core';
import StorageUtils, { STORAGE_KEYS } from 'common/utils/storage';
import React, { useEffect } from 'react';
import { ROUTES } from 'common/constants/constants';
import { useRouter } from 'next/router';
import { setAccessToken, setLogin } from 'stores/user';
import { setAddressWallet, setNetworkConnected } from 'stores/wallet';
import { BSC_CHAIN_ID_HEX } from 'web3/constants/envs';
import { useConnectWallet, useEagerConnect } from 'web3/hooks';
import { useUpdateBalance } from 'web3/hooks/useUpdateBalance';
import { useAppSelector } from 'stores';
import { useInactiveListener } from 'web3/hooks/useEagerConnect';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const router = useRouter();
	const triedEagerConnect = useEagerConnect();
	const { account, chainId, library } = useWeb3React();

	const { disconnectWallet } = useConnectWallet();
	const { updateBalance } = useUpdateBalance();
	const { isLogin, accessToken } = useAppSelector((state) => state.user);

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
			setNetworkConnected(networkConnected);
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

		const onChangeAccount = ([accountConnected]: Array<string>) => {
			if (
				!accountConnected ||
				accountConnected?.toLowerCase() !== account?.toLowerCase()
			) {
				disconnectWallet();
			}
		};

		const onChangeNetwork = (chainId: string | number) => {
			router.push(ROUTES.TOKEN_PRESALE_ROUNDS);
			if (chainId !== BSC_CHAIN_ID_HEX) return disconnectWallet();
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
		if (accessToken && account) {
			updateBalance();
		}
	}, [accessToken, account]);

	useInactiveListener(!triedEagerConnect);

	return (
		<div
		// value={{ isAuthChecking: !triedEagerConnect, isAuth, signIn, signOut }}
		>
			{children}
		</div>
	);
};
