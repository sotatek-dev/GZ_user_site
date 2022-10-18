import { Radio, RadioChangeEvent } from 'antd';
import { FC } from 'react';

interface ICustomRadioProps {
	onChange: (event: RadioChangeEvent) => void;
	defaultValue: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	options: Array<any>;
}

const CustomRadio: FC<ICustomRadioProps> = ({
	onChange,
	defaultValue,
	options,
}) => {
	return (
		<div className='card-radio'>
			<Radio.Group options={options} onChange={onChange} value={defaultValue} />
		</div>
	);
};

export default CustomRadio;
