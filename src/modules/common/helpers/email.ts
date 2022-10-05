export function isValidEmail(email: string) {
	return /^([\w\\.\\-\\!\\#\\$\\%\\&\\'\\*\\+\\-\\/\\=\\?\\^\\_\\`\\{\\|\\}\\~]+)@([\w\\-]+)((\.(\w){2,}){1,2})$/.test(
		email.toLowerCase()
	);
}
