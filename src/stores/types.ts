import store from '.';

export * from 'react-redux/es/index';

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

declare module 'react-redux' {
	export function useSelector<TSelected = unknown>(
		selector: (state: RootState) => TSelected,
		equalityFn?: (left: TSelected, right: TSelected) => boolean
	): TSelected;
}
