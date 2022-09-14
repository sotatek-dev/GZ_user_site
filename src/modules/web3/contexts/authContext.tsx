import React from 'react';
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
	// useActiveWeb3React,
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
	// const { active } = useActiveWeb3React();
	// const { disconnectWallet } = useConnectWallet();

	triedEagerConnect;

	return (
		<div
		// value={{ isAuthChecking: !triedEagerConnect, isAuth, signIn, signOut }}
		>
			{children}
		</div>
	);
};
