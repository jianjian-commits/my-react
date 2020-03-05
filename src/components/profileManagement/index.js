import React from "react";
import { connect } from "react-redux";

import { Button, Table, message, Popconfirm } from "antd";
import CreateFormModal from "../createGroup";
import GroupDetail from "./GroupDetail";
import PermissionSetting from "../userManagement/applyPermissionSettings";

import classes from "./profile.module.scss";
import request from "../../utils/request";

class ProfileManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      enterD: false,
      enterP: false,
      title: "",
      oldGroupId: "",
      groupList: []
    };
    this.action = "view";
    this.groupId = "";
    this.appId = "";
    this.handleCancel = this.handleCancel.bind(this);
    this.enterDetail = this.enterDetail.bind(this);
    this.enterPermission = this.enterPermission.bind(this);
  }

  componentDidMount() {
    this.getGroupList();
  }

  // 获取分组总列表
  async getGroupList() {
    try {
      const res = await request("/sysRole/list");
      if (res && res.status === "SUCCESS") {
        if (res.data === "teamId:null") return;
        this.setState({
          groupList: res.data
        });
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
          ? await request("/sysRole", {
              method: "PUT",
              data: {
                name: data.groupName,
                userId: this.props.userId
              }
            })
          : await request("/sysRole/clone", {
              method: "PUT",
              data: {
                oldRoleId: this.state.oldGroupId,
                newRoleName: data.groupName
              }
            });
      if (res && res.status === "SUCCESS") {
        message.success(`${title}成功!`);
        this.handleCancel();
        this.getGroupList();
      }
    } catch (err) {
      message.error(`${title}失败`);
      this.handleCancel();
    }
  }

  // 删除分组
  async removeGroup(record) {
    try {
      const res = await request(`/sysRole/${record.groupId}`, {
        method: "DELETE"
      });
      if (res && res.status === "SUCCESS") {
        message.success("删除成功！");
        this.getGroupList();
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

  // 进入或退出分组详情
  enterDetail(boolean, type, record) {
    this.setState({
      enterD: boolean
    });
    this.action = type ? type : "view";
    this.groupId = record ? record.groupId : "";
  }

  // 进入或退出权限管理
  enterPermission(boolean, record) {
    this.setState({
      enterP: boolean
    });
    this.appId = record ? record.appId : "";
  }

  render() {
    const { open, title, groupList } = this.state;
    // 分组列表标题和操作
    const columns = [
      { title: "组名", dataIndex: "groupName" },
      {
        title: "操作",
        dataIndex: "action",
        render: (text, record) => (
          <span className={classes.actionStyle}>
            <Button
              type="link"
              onClick={() => {
                this.enterDetail(true, "view", record);
              }}
            >
              查看
            </Button>
            {record.code !== "SUPER_ADMIN" && (
              <Button
                type="link"
                onClick={() => {
                  this.enterDetail(true, "edit", record);
                }}
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
            {record.code !== "SUPER_ADMIN" && record.code !== "GENERAL" && (
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
        {this.state.enterP === true ? (
          <PermissionSetting
            action={this.action}
            groupId={this.groupId}
            appId={this.appId}
            teamId={this.props.teamId}
          />
        ) : this.state.enterD === true ? (
          <GroupDetail
            action={this.action}
            enterDetail={this.enterDetail}
            groupId={this.groupId}
            enterPermission={this.enterPermission}
          />
        ) : (
          <>
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
          </>
        )}
      </div>
    );
  }
}
export default connect(({ login }) => ({
  teamId: login.currentTeam.id,
  userId: login.userDetail.id
}))(ProfileManagement);
