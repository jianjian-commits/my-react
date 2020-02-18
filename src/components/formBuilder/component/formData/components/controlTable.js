import React from "react";
import { Table } from "antd";
class ControlTable extends React.Component {
  handleChange = (pagination, filters, sorter) => {
    this.props.setColumnSort(sorter);
  };
  render() {
    const { columns, data, className, paginationProps } = this.props;
    return (
      <Table
        bordered={true}
        rowKey={record => record.id}
        columns={columns}
        dataSource={data}
        className={className}
        pagination={paginationProps}
        onChange={this.handleChange}
        scroll={{ x: 2000 }}
      />
    );
  }

}

export default ControlTable;
