import React, { FC } from 'react';
import { Loading3QuartersOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

interface IPropsLoading {
	customClass?: string;
	icon?: React.ReactElement;
}

const Loading: FC<IPropsLoading> = ({ customClass, icon }) => {
	const antIcon = (
		<Loading3QuartersOutlined
			style={{ fontSize: '100px', color: '#08c' }}
			className={customClass}
			spin
		/>
	);

	return (
		<Spin
			className='flex justify-center items-center my-12'
			indicator={icon ? icon : antIcon}
		/>
	);
};
export default Loading;
