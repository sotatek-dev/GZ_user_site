import LazyLoad from 'react-lazyload';
const LazyLoadCommon = ({ children }: { children: JSX.Element }) => {
	return (
		<LazyLoad once={true} offset={100}>
			{children}
		</LazyLoad>
	);
};
export default LazyLoadCommon;
