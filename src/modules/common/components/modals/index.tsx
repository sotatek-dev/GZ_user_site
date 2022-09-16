import { Modal } from 'antd';

interface ModalProps {
	children?: React.ReactNode;
	isShow: boolean;
	title?: string;
	width?: number;
	customClass?: string;
	footer?: React.ReactNode;
	closeIcon?: React.ReactNode;
	onOk?: () => void;
	onCancel?: () => void;
	closable?: boolean;
}

const ModalCustom = (props: ModalProps) => {
	const {
		children,
		isShow,
		title,
		customClass,
		footer,
		width = 520,
		closeIcon,
		onOk,
		closable = true,
		onCancel,
		...rest
	} = props;

	return (
		<Modal
			visible={isShow}
			title={title}
			width={width}
			className={`modal-custom ${customClass}`}
			onOk={onOk}
			onCancel={onCancel}
			footer={[footer]}
			closable={closable}
			closeIcon={closeIcon || <img src='./icons/close.svg' alt='close icon' />}
			destroyOnClose={false}
			maskClosable={false}
			{...rest}
		>
			{children}
		</Modal>
	);
};

export default ModalCustom;