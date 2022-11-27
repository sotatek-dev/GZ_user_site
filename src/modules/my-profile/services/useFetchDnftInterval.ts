import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useAppDispatch } from 'stores';
import { getDNFTDetailRD } from 'stores/dnft/dnft-detail';

export const useFetchDnftInterval = (
	dnftId: string,
	clearInterval: () => boolean
) => {
	const dispatch = useAppDispatch();
	const [isFetchInterval] = useState(!!dnftId);

	const delay = clearInterval() ? null : 3000;
	useInterval(() => dispatch(getDNFTDetailRD(dnftId)), delay);

	return { isFetchInterval };
};

const useIsomorphicLayoutEffect =
	typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function useInterval(callback: () => void, delay: number | null) {
	const savedCallback = useRef(callback);

	// Remember the latest callback if it changes.
	useIsomorphicLayoutEffect(() => {
		savedCallback.current = callback;
	}, [callback]);

	// Set up the interval.
	useEffect(() => {
		// Don't schedule if no delay is specified.
		// Note: 0 is a valid value for delay.
		if (!delay && delay !== 0) {
			return;
		}

		const id = setInterval(() => savedCallback.current(), delay);

		return () => clearInterval(id);
	}, [delay]);
}

export default useInterval;
