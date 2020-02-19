import React from "react";
import { Button, Table, message, Popconfirm } from "antd";
import classes from "./profile.module.scss";
import CreateFormModal from "../createGroup";
import { history } from "../../store";

// 分组列表项
const dataSource = [
  { id: 1, group: "系统管理员", key: "manage" },
  { id: 2, group: "普通用户", key: "general" },
  { id: 3, group: "HR", key: 0 }
];

class ProfileManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      title: ""
    };
    this.handleCancel = this.handleCancel.bind(this);
  }

  // 完成新建
  async handleCreate(data, title) {
    message.success(`${title}成功!`);
    this.handleCancel();
  }

  // 取消新建/关闭模态窗
  handleCancel() {
    this.setState({
      open: false
    });
  }

  render() {
    // 分组列表标题
    const columns = [
      { title: "组名", key: "group", dataIndex: "group" },
      {
        title: "操作",
        key: "action",
        dataIndex: "action",
        render: (text, record) => (
          <span className={classes.actionStyle}>
            <Button
              type="link"
              onClick={() =>
                history.push({
                  pathname: `/user/profile/view/${record.id}`,
                  state: { action: "view" }
                })
              }
            >
              查看
            </Button>
            {record.key !== "manage" && (
              <Button
                type="link"
                onClick={() =>
                  history.push({
                    pathname: `/user/profile/view/${record.id}`,
                    state: { action: "edit" }
                  })
                }
              >
                编辑
              </Button>
            )}
            <Button
              type="link"
              onClick={() => this.setState({ open: true, title: "克隆分组" })}
            >
              克隆
            </Button>
            {record.key !== "manage" && record.key !== "general" && (
              <Popconfirm
                title="是否删除这个分组？"
                okText="是"
                cancelText="否"
                onConfirm={() => confirm(record)}
              >
                <Button type="link">删除</Button>
              </Popconfirm>
            )}
          </span>
        )
      }
    ];

    // 确认是否删除
    const confirm = record => {
      dataSource.forEach((i, index) => {
        if (i.id === record.id) {
          return dataSource.splice(index, 1);
        }
      });
      this.setState({ dataSource });
      message.success("删除成功！");
    };

    return (
      <div className={classes.wrapper}>
        <Button
          type="primary"
          onClick={() => this.setState({ open: true, title: "添加分组" })}
        >
          添加分组
        </Button>
        <CreateFormModal
          title={this.state.title}
          visible={this.state.open}
          onOk={(data, title) => this.handleCreate(data, title)}
          onCancel={this.handleCancel}
        />
        <div className={classes.tableStyles}>
          <Table
            size="middle"
            columns={columns}
            dataSource={dataSource}
          ></Table>
        </div>
      </div>
    );
  }
}
export default ProfileManagement;
