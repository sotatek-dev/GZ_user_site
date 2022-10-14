import { Modal } from 'antd';
import Image from 'next/image';
import { ReactNode } from 'react';

interface ModalProps {
	children?: React.ReactNode;
	isShow: boolean;
	title?: string | ReactNode;
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
			open={isShow}
			title={title}
			width={width}
			className={`modal-custom ${customClass}`}
			onOk={onOk}
			onCancel={onCancel}
			footer={[footer]}
			closable={closable}
			closeIcon={
				closeIcon || (
					<Image
						src='/icons/close.svg'
						width='100%'
						height='100%'
						layout='intrinsic'
						alt='close icon'
						objectFit='contain'
					/>
				)
			}
			destroyOnClose={false}
			maskClosable={true}
			{...rest}
		>
			{children}
		</Modal>
	);
};

export default ModalCustom;
