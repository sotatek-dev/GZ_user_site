// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function removeEmpty(obj: { [key: string]: any }): {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any;
} {
	return Object.fromEntries(Object.entries(obj).filter(([, v]) => v));
}
