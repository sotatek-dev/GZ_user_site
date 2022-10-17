import { DownOutlined } from '@ant-design/icons';
import { Menu, Dropdown as AntDropdown, Button, MenuProps } from 'antd';

type Props = {
	size?: string;
	type?: string;
	list: Item[];
	label?: string;
	customStyle?: string;
	placeholder?: string;
	onClick?: MenuProps['onClick'];
	value?: string;
};

type Item = {
	label: string;
};

const DropdownMegeDnft = (props: Props) => {
	const {
		list,
		label,
		customStyle,
		placeholder = '000000',
		onClick,
		value,
	} = props;

	const menu = (
		<Menu onClick={onClick} className='max-h-[300px] overflow-auto	'>
			{list.map((item: Item) => (
				<Menu.Item key={item.label}>{item.label}</Menu.Item>
			))}
		</Menu>
	);

	return (
		<div className={`flex flex-col ${customStyle && customStyle} w-[100%]`}>
			<div className='mb-[8px] leading-[24px] text-[#ffffff80] overflow-hidden text-ellipsis whitespace-nowrap'>
				{label}
			</div>
			<AntDropdown
				className='flex justify-between items-center !w-[100%]'
				overlay={menu}
				trigger={['click']}
			>
				<Button className='dropdown-button !border-[#ffffff33] !h-[47px] '>
					{value ? (
						<div className='text-white  overflow-hidden text-ellipsis '>
							{value}
						</div>
					) : (
						<div className='text-[#ffffff1a]  overflow-hidden text-ellipsis  '>
							{placeholder}
						</div>
					)}
					<DownOutlined className='!text-[#ffffff80]' />
				</Button>
			</AntDropdown>
		</div>
	);
};

export default DropdownMegeDnft;
