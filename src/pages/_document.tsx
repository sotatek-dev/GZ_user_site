import Document, {
	Html,
	Head,
	Main,
	NextScript,
	DocumentContext,
} from 'next/document';
export default class AppDocument extends Document {
	static async getInitialProps(ctx: DocumentContext) {
		const initialProps = await Document.getInitialProps(ctx);
		return { ...initialProps };
	}
	render() {
		return (
			<Html lang='en'>
				<Head>
					<link rel='icon' type='image/x-icon' href='/favicon.ico' />
					<link
						rel='canonicalize'
						href='https://galactix-zone-staging.netlify.app/'
					/>
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}
