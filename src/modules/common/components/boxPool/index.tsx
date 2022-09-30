import { FC } from 'react';

interface IBoxPoolProps {
	title?: string;
	children: React.ReactNode;
	customClass?: string;
	hasBorderTitle?: boolean;
}

const BoxPool: FC<IBoxPoolProps> = ({ children, customClass, title }) => {
	return (
		<div className={`box-pool ${customClass}`}>
			{title && (
				<h5 className='text-lg font-medium text-white border-b border-purple-10 pb-4'>
					{title}
				</h5>
			)}
			{children}
		</div>
	);
};

export default BoxPool;
