import { FC } from 'react';

interface IBoxPoolProps {
	title: string;
	children: React.ReactNode;
	customClass: string;
}

const BoxPool: FC<IBoxPoolProps> = ({ title, children, customClass }) => {
	return (
		<div className={`box-pool ${customClass}`}>
			{title && (
				<h5 className='text-lg font-medium text-white border-b border-purple-10 pb-4'>
					{title}
				</h5>
			)}
			<div>{children}</div>
		</div>
	);
};

export default BoxPool;
