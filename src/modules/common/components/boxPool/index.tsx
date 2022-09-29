import { FC } from 'react';

interface IBoxPoolProps {
	title?: string;
	children: React.ReactNode;
	customClass?: string;
	hasBorderTitle?: boolean;
}

const BoxPool: FC<IBoxPoolProps> = ({ children, customClass }) => {
	return (
		<div className={`box-pool ${customClass}`}>
			<div>{children}</div>
		</div>
	);
};

export default BoxPool;
