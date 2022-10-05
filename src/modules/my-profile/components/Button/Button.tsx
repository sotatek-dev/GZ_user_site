import styles from './Button.module.scss';
import type { ButtonProps } from 'antd';
import { Button as AntButton } from 'antd';
import classnames from 'classnames';

type Props = ButtonProps;

export default function Button({ className, ...props }: Props) {
	const cln = classnames(
		'w-[100%] rounded-[40px] h-fit font-semibold !py-[9px] mt-[36px] border-none !text-white',
		styles['btn-gradient'],
		className
	);

	return <AntButton className={cln} {...props} />;
}
