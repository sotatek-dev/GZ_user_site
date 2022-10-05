export function removeEmpty(obj: { [key: string]: any }): {
	[key: string]: any;
} {
	return Object.fromEntries(Object.entries(obj).filter(([, v]) => v));
}
