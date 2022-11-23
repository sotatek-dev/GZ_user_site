import { Button as AntButton } from 'antd';
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
	colorIconLoading?: string;
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

	return (
		<AntButton
			type={type}
			className={`common-normal-button ${classCustom}`}
			loading={isLoading}
			disabled={isDisabled}
			onClick={() => {
				if (onClick) onClick();
			}}
			htmlType={htmlType}
			block
			style={styles}
		>
			{label}
		</AntButton>
	);
};

export default Button;
