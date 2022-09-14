import { Radio } from 'antd';
import { FC } from 'react';

interface ICustomRadioProps {
	onChange: () => void;
	defaultValue: string;
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
