import { Radio, RadioChangeEvent, Space } from 'antd';
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
			<Radio.Group onChange={onChange} value={defaultValue}>
				<Space direction='horizontal'>
					{options.map((el) => (
						<Radio key={el.value} value={el.value}>
							{el.label}
						</Radio>
					))}
				</Space>
			</Radio.Group>
		</div>
	);
};

export default CustomRadio;
