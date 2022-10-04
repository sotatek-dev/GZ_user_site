/**
 * check error img and add domain
 * @param src string
 * @param errorImg enum NoData | default
 */
export const convertUrlImage = (
	url?: string | null | undefined,
	errorImg?: string
) => {
	if (!url) {
		switch (errorImg) {
			case 'NoDNFT':
				return '/images/galatic-zone.png';
			// case 'Avatar':
			//   return require('../../public/images/avatar-default.png');
			// case 'Banner':
			//   return require('../assets/images/banner-empty.png');
			default:
				return '/images/galatic-zone.png';
		}
	} else if (url?.includes('http')) {
		return url;
	} else {
		//temporary
		return url;
		//
	}
};
