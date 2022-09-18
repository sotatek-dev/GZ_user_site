export const EllipsisMiddle = (account: string | null | undefined) => {
	return account ? account.slice(0, 6) + '...' + account.slice(-3) : '';
};

export const secondsToTime = (time: number) => {
	const days = Math.floor(time / (3600 * 24));
	const hours = Math.floor((time % (3600 * 24)) / 3600);
	const minutes = Math.floor((time % 3600) / 60);
	const seconds = Math.floor(time % 60);

	return { days, hours, minutes, seconds };
};
