import { Helmet } from 'react-helmet-async';
const HelmetCommon = ({
	title,
	description,
	href,
}: {
	title: string;
	description: string;
	href: string;
}) => {
	return (
		<Helmet>
			<title>{title}</title>
			<meta name='description' content={description} />
			<link rel='canonical' href={href} />
		</Helmet>
	);
};
export default HelmetCommon;
