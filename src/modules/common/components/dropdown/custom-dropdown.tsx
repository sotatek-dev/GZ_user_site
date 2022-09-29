import { DownOutlined } from '@ant-design/icons';
import { Menu, Dropdown as AntDropdown, Button } from 'antd';

type Props = {
	size?: string;
	type?: string;
	list: Item[];
	label: string;
	customStyle?: string;
	placeholder?: string;
};

type Item = {
	label: string;
};

const CustomDropdown = (props: Props) => {
	const { list, label, customStyle, placeholder } = props;

	const menu = (
		<Menu onClick={() => {}}>
			{list.map((item: Item, key) => (
				<Menu.Item key={key}>{item.label}</Menu.Item>
			))}
		</Menu>
	);

	return (
		<div className={`flex flex-col ${customStyle && customStyle} w-[100%]`}>
			<div className='mb-[8px] leading-[24px] text-[#ffffff80]'>{label}</div>
			<AntDropdown
				className='flex justify-between items-center !w-[100%]'
				overlay={menu}
				trigger={['click']}
			>
				<Button className='dropdown-button !border-[#ffffff33] !h-[47px]'>
					<div className='text-[#ffffff1a]'>
						{placeholder ? placeholder : '000000'}{' '}
					</div>{' '}
					<DownOutlined className='!text-[#ffffff80]' />
				</Button>
			</AntDropdown>
		</div>
	);
};

export default CustomDropdown;
