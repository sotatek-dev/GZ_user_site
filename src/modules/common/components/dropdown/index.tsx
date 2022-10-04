import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu, Dropdown as AntDropdown, Button } from 'antd';

type Props = {
	size?: string;
	type?: string;
	list: Array<{ [key: string]: string | number }>;
	label: string;
	customStyle?: string;
	title?: string;
	onClick: MenuProps['onClick'];
};

const Dropdown = (props: Props) => {
	const { list, label, customStyle, title, onClick } = props;

	const menu = (
		<Menu onClick={onClick}>
			{list.map((item: { [key: string]: string | number }) => (
				<Menu.Item key={item.key}>{item.label}</Menu.Item>
			))}
		</Menu>
	);

	return (
		<AntDropdown className={customStyle} overlay={menu} trigger={['click']}>
			<Button className='dropdown-button flex justify-between	items-center'>
				{label
					? list.find(
							(item: { [key: string]: string | number }) => item.key === label
					  )?.label
					: title}{' '}
				<DownOutlined />
			</Button>
		</AntDropdown>
	);
};

export default Dropdown;
