import React from 'react';
import { Table, TableProps } from 'antd';

interface MyTableProps extends TableProps<any> {
	isHaveBorderTop?: boolean;
}

const MyTable: React.FC<MyTableProps> = (props: MyTableProps) => {
	const { columns, dataSource, pagination, isHaveBorderTop = false } = props;

	return (
		<Table
			className={isHaveBorderTop ? 'table-border-top' : ''}
			columns={columns}
			rowKey={(record) => record.id}
			dataSource={dataSource}
			pagination={pagination ? pagination : false}
			{...props}
		/>
	);
};

export default MyTable;
