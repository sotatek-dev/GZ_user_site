import Head from 'next/head';
const HeadCommon = ({ title }: { title: string }) => {
	return (
		<Head>
			<title>{title}</title>
			<meta
				key='og:title'
				property='og:title'
				content='Galactix Zone: NFT Marketplace'
			/>
			<meta
				key='og:image'
				property='og:image'
				content='https://i.ibb.co/QmvkjKB/thumbnail-head.png'
			/>
			<meta
				name='description'
				content='Turn your products, arts or services into publicly tradable items'
				data-rh='true'
			/>
			<meta key='og:image:width' property='og:image:width' content='1200' />
			<meta key='og:image:height' property='og:image:height' content='627' />
			<meta
				key='og:description'
				property='og:description'
				content='Turn your products, arts or services into publicly tradable items'
			/>
			<meta
				key='og:url'
				property='og:url'
				content='https://galactix-zone-staging.netlify.app/'
			/>
			<meta httpEquiv='Content-Type' content='text/html; charset=utf-8' />
			<meta httpEquiv='X-UA-Compatible' content='IE=edge' />
			<meta name='robots' content='index, follow' />
			<meta key='googlebot' name='googlebot' content='index,follow' />
			<meta name='google' content='notranslate' />
			<meta name='mobile-web-app-capable' content='yes' />
			<meta name='apple-mobile-web-app-capable' content='yes' />
			<meta name='keywords' content='nextjs, realworld' />
			<meta name='title' content={title} />
			<meta property='fb:app_id' content={title} />
			<meta property='og:type' content={title} />
			<meta property='og:site_name' content='next-realworld' />
			<meta property='og:locale' content='en_US' />
			<meta property='og:image:secure' content={title} />
			<meta property='twitter:card' content='next-realworld' />
			<meta property='twitter:url' content='https://next-realworld.now.sh/' />
			<meta property='twitter:title' content='Next.js realworld example app' />
			<meta
				property='twitter:description'
				content='Next.js + SWR codebase containing realworld examples'
			/>
			<meta
				property='twitter:image'
				content='https://machimban.com/images/talk-link.jpg'
			/>
			<meta name='msapplication-TileColor' content='#000' />
			<meta
				name='msapplication-TileImage'
				content='/images/ms-icon-144x144.png'
			/>
			<meta name='theme-color' content='#000' />
			<link rel='icon' href='/favicon.ico' />
		</Head>
	);
};
export default HeadCommon;
