import React from 'react';
import { Table, TableProps } from 'antd';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface MyTableProps extends TableProps<any> {
	isHaveBorderTop?: boolean;
	customClass?: string;
}

const MyTable: React.FC<MyTableProps> = (props: MyTableProps) => {
	const {
		columns,
		dataSource,
		pagination,
		isHaveBorderTop = false,
		customClass,
	} = props;

	return (
		<Table
			className={`${isHaveBorderTop ? 'table-border-top' : ''} ${customClass}`}
			columns={columns}
			rowKey={(record) => record.id}
			dataSource={dataSource}
			pagination={pagination ? pagination : false}
			{...props}
		/>
	);
};

export default MyTable;
