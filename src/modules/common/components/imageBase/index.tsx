import { convertUrlImage } from 'common/utils/image';
import Image, { ImageProps } from 'next/image';
import React, { useEffect, useState } from 'react';
// import { convertUrlImage } from 'utils/image';

interface Props extends Omit<ImageProps, 'src'> {
	url: string;
	errorImg?: 'NoDNFT';
	type?: 'HtmlImage' | 'NextImage';
	style?: object;
	onFinish?: () => void;
}

const ImageBase = (props: Props) => {
	const { url, errorImg, type, style = {} } = props;
	const [img, setImg] = useState<string>('');

	const newProps = { ...props };
	/**
	 * Handle url props change
	 */
	useEffect(() => {
		const getImageURL = () => {
			const imgUrl = convertUrlImage(url, errorImg);
			setImg(imgUrl);
		};

		getImageURL();
	}, [url, errorImg]);

	const onFinish = () => {
		// console.log(e.target.value);
	};

	/**
	 * Render main
	 */

	if (type === 'HtmlImage') {
		return (
			<Image
				style={style}
				alt='image'
				// src={img?.default?.src || img}
				src={img}
				// onError={() => setImg(convertUrlImage(null, errorImg))}
				onLoad={onFinish}
				className='max-w-full'
				{...newProps}
			/>
		);
	}
	return (
		<Image
			style={style}
			onError={() => setImg(convertUrlImage(null, errorImg))}
			src={img || '/images/galatic-zone.png'}
			alt='image'
			onLoadingComplete={onFinish}
			className='max-w-full'
			{...newProps}
		/>
	);
};
export default React.memo(ImageBase);
