import React from 'react';
import { Table, TableProps } from 'antd';

interface MyTableProps<RecordType> extends TableProps<RecordType> {
	isHaveBorderTop?: boolean;
	customClass?: string;
}

const MyTable = <RecordType extends { _id: string }>(
	props: MyTableProps<RecordType>
) => {
	const {
		columns,
		dataSource,
		pagination,
		isHaveBorderTop = false,
		customClass,
		onRow,
	} = props;

	return (
		<Table
			onRow={onRow}
			className={`app-table ${
				isHaveBorderTop ? 'table-border-top' : ''
			} ${customClass}`}
			columns={columns}
			rowKey={(record) => record._id}
			dataSource={dataSource}
			pagination={pagination ? pagination : false}
			{...props}
		/>
	);
};

export default MyTable;
