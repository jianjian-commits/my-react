import React from "react";
import { Button, Table, message, Popconfirm } from "antd";
import classes from "./profile.module.scss";
import CreateFormModal from "../createGroup";
import { history } from "../../store";
import request from "../../utils/request";
class ProfileManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      title: "",
      groupList: [],
      oldGroupId: ""
    };
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentDidMount() {
    this.getGroupList();
  }

  // 获取分组总列表
  async getGroupList() {
    try {
      const res = await request("/group/list");
      if (res && res.status === "SUCCESS") {
        this.setState({
          groupList: res.data
        });
      } else {
        message.error("获取分组列表失败");
      }
    } catch (err) {
      message.error("获取分组列表失败");
    }
  }

  // 新建分组
  async handleCreate(data, title) {
    try {
      const res =
        title === "添加分组"
          ? await request("/group/addGroup", {
              method: "POST",
              data: {
                teamId: "",
                name: data.groupName
              }
            })
          : await request("/group/cloneGroup", {
              method: "POST",
              data: {
                oldGroupId: this.state.oldGroupId,
                newGroupName: data.groupName
              }
            });
      if (res && res.status === "SUCCESS") {
        message.success(`${title}成功!`);
        this.handleCancel();
        this.getGroupList();
      } else {
        message.error(`${title}失败`);
        this.handleCancel();
      }
    } catch (err) {
      message.error(`${title}失败`);
      this.handleCancel();
    }
  }

  // 删除分组
  async removeGroup(record) {
    try {
      const res = await request(`/group/delGroup?id=${record.groupId}`, {
        method: "DELETE"
      });
      if (res && res.status === "SUCCESS") {
        message.success("删除成功！");
        this.getGroupList();
      } else {
        message.error("删除失败！");
      }
    } catch (err) {
      message.error("删除失败！");
    }
  }

  // 取消新建分组/关闭模态窗
  handleCancel() {
    this.setState({
      open: false
    });
  }

  render() {
    const { open, title, groupList } = this.state;
    // 分组列表标题和操作
    const columns = [
      { title: "组名", dataIndex: "groupName" },
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
                  pathname: `/user/profile/view/${record.groupId}`
                })
              }
            >
              查看
            </Button>
            {record.groupName !== "管理员" && (
              <Button
                type="link"
                onClick={() =>
                  history.push({
                    pathname: `/user/profile/edit/${record.groupId}`
                  })
                }
              >
                编辑
              </Button>
            )}
            <Button
              type="link"
              onClick={() =>
                this.setState({
                  open: true,
                  title: "克隆分组",
                  oldGroupId: record.groupId
                })
              }
            >
              克隆
            </Button>
            {record.groupName !== "管理员" && record.groupName !== "普通用户" && (
              <Popconfirm
                title="是否删除这个分组？"
                okText="是"
                cancelText="否"
                onConfirm={() => this.removeGroup(record)}
              >
                <Button type="link">删除</Button>
              </Popconfirm>
            )}
          </span>
        )
      }
    ];

    return (
      <div className={classes.wrapper}>
        <Button
          type="primary"
          onClick={() => this.setState({ open: true, title: "添加分组" })}
        >
          添加分组
        </Button>
        <CreateFormModal
          title={title}
          visible={open}
          onOk={(data, title) => this.handleCreate(data, title)}
          onCancel={this.handleCancel}
        />
        <div className={classes.tableStyles}>
          <Table
            size="middle"
            columns={columns}
            dataSource={groupList}
            rowKey="groupId"
          ></Table>
        </div>
      </div>
    );
  }
}
export default ProfileManagement;
