import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Dropdown as AntDropdown, Menu } from 'antd';
export type Item = { [key: string]: string | number };
type Props = {
	size?: string;
	type?: string;
	list: Array<Item>;
	label: string;
	customStyle?: string;
	title?: string;
	onClick: MenuProps['onClick'];
};

const Dropdown = (props: Props) => {
	const { list, label, customStyle, title, onClick } = props;

	const menu = (
		<Menu onClick={onClick}>
			{list.map((item: Item) => (
				<Menu.Item key={item.key}>{item.label}</Menu.Item>
			))}
		</Menu>
	);

	return (
		<AntDropdown className={customStyle} overlay={menu} trigger={['click']}>
			<Button className='dropdown-button flex justify-between	items-center'>
				{label ? list.find((item: Item) => item.key === label)?.label : title}{' '}
				<DownOutlined />
			</Button>
		</AntDropdown>
	);
};

export default Dropdown;
