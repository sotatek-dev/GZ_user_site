import {
	LazyLoadImageProps,
	LazyLoadImage as LazyLoadImageCommon,
} from 'react-lazy-load-image-component';
const LazyLoadImageComp = (props: LazyLoadImageProps) => {
	return (
		<LazyLoadImageCommon
			threshold={100}
			useIntersectionObserver={true}
			{...props}
		/>
	);
};
export default LazyLoadImageComp;
