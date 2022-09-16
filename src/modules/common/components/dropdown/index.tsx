import { DownOutlined } from '@ant-design/icons';
import { Menu, Dropdown as AntDropdown, Button } from 'antd';

type Props = {
	size?: string;
	type?: string;
	list: Item[];
	label: string;
};

type Item = {
	label: string;
};

const Dropdown = (props: Props) => {
	const { list, label } = props;

	const menu = (
		<Menu onClick={() => {}}>
			{list.map((item: Item, key) => (
				<Menu.Item key={key}>{item.label}</Menu.Item>
			))}
		</Menu>
	);

	return (
		<AntDropdown overlay={menu} trigger={['click']}>
			<Button className='dropdown-button'>
				{label} <DownOutlined />
			</Button>
		</AntDropdown>
	);
};

export default Dropdown;