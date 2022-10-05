export function isValidEmail(email: string) {
	return email
		.toLowerCase()
		.match(
			/^([\w\\.\\-\\!\\#\\$\\%\\&\\'\\*\\+\\-\\/\\=\\?\\^\\_\\`\\{\\|\\}\\~]+)@([\w\\-]+)((\.(\w){2,}){1,2})$/
		);
}
