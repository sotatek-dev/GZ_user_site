import Head from 'next/head';
const HeadCommon = ({ title }: { title: string }) => {
	return (
		<Head>
			<title>{title}</title>
			{/* <!-- For Google --> */}
			<meta
				name='description'
				content='Turn your products, arts or services into publicly tradable items'
				data-rh='true'
			/>
			<meta property='google:app_id' content={title} />
			<meta name='keywords' content='nextjs, realworld' />
			<meta name='author' content={title} />
			<meta name='copyright' content={title} />
			<meta name='application-name' content={title} />
			{/* <!-- For Facebook --> */}
			<meta
				key='og:title'
				property='og:title'
				content='Galactix Zone: NFT Marketplace'
			/>
			<meta property='fb:admins' content='MANAGER_ID' />
			<meta property='fb:app_id' content={title} />
			<meta property='og:type' content={title} />
			<meta
				key='og:image'
				property='og:image'
				content='https://i.ibb.co/QmvkjKB/thumbnail-head.png'
			/>
			<meta
				key='og:url'
				property='og:url'
				content='https://galactix-zone-staging.netlify.app/'
			/>
			<meta
				key='og:description'
				property='og:description'
				content='Turn your products, arts or services into publicly tradable items'
			/>
			{/* <!-- For Twitter --> */}
			<meta property='twitter:card' content='next-realworld' />
			<meta name='twitter:creator' content='@author_handle' />
			<meta property='twitter:title' content='Next.js realworld example app' />
			<meta
				property='twitter:description'
				content='Next.js + SWR codebase containing realworld examples'
			/>
			<meta name='twitter:image:src' content='https://example.com/image.html' />
			<meta
				property='twitter:site'
				content='https://machimban.com/images/talk-link.jpg'
			/>
			<meta name='twitter:data1' content='$3' />
			<meta name='twitter:label1' content='Giá' />
			<meta name='twitter:data2' content='Đen' />
			<meta name='twitter:label2' content='Màu sắc' />
			<meta
				property='twitter:image'
				content='https://machimban.com/images/talk-link.jpg'
			/>
			<meta name='twitter:image:alt' content='Alt text for image' />
			<meta property='twitter:url' content='https://next-realworld.now.sh/' />
			<meta property='twitter:app_id' content={title} />
			{/* another */}
			<meta key='og:image:width' property='og:image:width' content='1200' />
			<meta key='og:image:height' property='og:image:height' content='627' />
			<meta httpEquiv='Content-Type' content='text/html; charset=utf-8' />
			<meta httpEquiv='X-UA-Compatible' content='IE=edge' />
			<meta name='robots' content='index, follow' />
			<meta key='googlebot' name='googlebot' content='index,follow' />
			<meta name='google' content='notranslate' />
			<meta name='mobile-web-app-capable' content='yes' />
			<meta name='apple-mobile-web-app-capable' content='yes' />
			<meta name='title' content={title} />
			<meta property='og:site_name' content='next-realworld' />
			<meta property='og:price:amount' content='Giá sản phẩm. Ví dụ: 15.00' />
			<meta property='og:price:currency' content='VNĐ' />
			<meta property='og:locale' content='en_US' />
			<meta property='og:publishdt' content='Oct 5 , 2018' />
			<meta property='og:uploadedby' content='' />
			<meta property='og:image:secure' content={title} />
			<meta name='msapplication-TileColor' content='#000' />
			<meta
				name='msapplication-TileImage'
				content='/images/ms-icon-144x144.png'
			/>
			<meta
				property='article:published_time'
				content='Ngày xuất bản. Ví dụ: 2021-16-17T05:59:00+01:00'
			/>
			<meta
				property='article:modified_time'
				content='Ngày chỉnh sửa. Ví dụ: 2021-016T19:08:47+01:00'
			/>
			<meta property='article:section' content='Phần nội dung' />
			<meta property='article:tag' content='Thẻ tag hoặc từ khóa' />
			<meta property='og:contenttype' content='article_listing' />
			<meta property='og:contentnid' content='214' />
			<meta name='theme-color' content='#000' />
			<link rel='icon' type='image/x-icon' href='/favicon.ico' />
			<link
				rel='canonicalize'
				href='https://galactix-zone-staging.netlify.app/'
			/>
		</Head>
	);
};
export default HeadCommon;
