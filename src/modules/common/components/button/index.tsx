import { LoadingOutlined } from '@ant-design/icons';
import { Button as AntButton, Spin } from 'antd';
import { ButtonType } from 'antd/lib/button';
import { ButtonHTMLType } from 'antd/lib/button/button';

type Props = {
	buttonType?: string;
	type?: ButtonType;
	label: string;
	htmlType?: ButtonHTMLType;
	onClick?: () => void;
	isDisabled?: boolean;
	classCustom?: string;
	ghost?: boolean;
	isLoading?: boolean;
	styles?: object;
};

const Button = (props: Props) => {
	const {
		type = 'primary',
		label,
		onClick,
		htmlType = 'button',
		isDisabled = false,
		isLoading = false,
		classCustom,
		styles,
	} = props;

	const antIcon = (
		<LoadingOutlined
			style={{
				fontSize: 18,
				fontWeight: 900,
				color: '#212325',
				marginRight: '5px',
			}}
			spin
		/>
	);

	return (
		<AntButton
			type={type}
			className={`common-normal-button
        ${classCustom}`}
			disabled={isDisabled}
			onClick={() => {
				if (onClick) onClick();
			}}
			htmlType={htmlType}
			block
			style={styles}
		>
			{isLoading && <Spin indicator={antIcon} />}
			{label}
		</AntButton>
	);
};

export default Button;
