import React from 'react';
import { Table, TableProps } from 'antd';

interface MyTableProps<RecordType> extends TableProps<RecordType> {
	isHaveBorderTop?: boolean;
	customClass?: string;
}

const MyTable = <RecordType extends { _id: string }>(
	props: MyTableProps<RecordType>
) => {
	const { pagination, isHaveBorderTop = false, customClass } = props;

	return (
		<Table
			className={`app-table ${
				isHaveBorderTop ? 'table-border-top' : ''
			} ${customClass}`}
			rowKey={(record) => record._id}
			pagination={pagination ? pagination : false}
			{...props}
		/>
	);
};

export default MyTable;
