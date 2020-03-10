import React from "react";
import { connect } from "react-redux";

import { Button, Table, message, Popconfirm } from "antd";
import ModalCreation from "./modalCreate/ModalCreation";
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
      oldRoleId: "",
      roleList: []
    };
    this.action = "view";
    this.roleId = "";
    this.appId = "";
    this.handleCancel = this.handleCancel.bind(this);
    this.enterDetail = this.enterDetail.bind(this);
    this.enterPermission = this.enterPermission.bind(this);
  }

  componentDidMount() {
    this.getGroupList();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.teamId !== this.props.teamId) {
      this.getGroupList();
    }
  }

  // 获取分组总列表
  async getGroupList() {
    try {
      const res = await request("/sysRole/list");
      if (res && res.status === "SUCCESS") {
        this.setState({
          roleList: res.data
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
          ? await request(`/sysRole/role?name=${data.roleName}`, {
              method: "PUT"
            })
          : await request("/sysRole/clone", {
              method: "PUT",
              data: {
                oldRoleId: this.state.oldRoleId,
                newRoleName: data.roleName
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
      const res = await request(`/sysRole/${record.roleId}`, {
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

  // 进入或退出分组详情
  enterDetail(boolean, type, record) {
    this.setState({
      enterD: boolean
    });
    this.action = type ? type : "view";
    this.roleId = record ? record.roleId : "";
    this.getGroupList();
  }

  // 进入或退出权限管理
  enterPermission(boolean, record) {
    this.setState({
      enterP: boolean
    });
    this.appId = record ? record.appId : "";
  }

  render() {
    const { open, title, roleList } = this.state;
    // 分组列表标题和操作
    const columns = [
      { title: "组名", dataIndex: "roleName" },
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
                  oldRoleId: record.roleId
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
            roleId={this.roleId}
            appId={this.appId}
            enterPermission={this.enterPermission}
          />
        ) : this.state.enterD === true ? (
          <GroupDetail
            action={this.action}
            enterDetail={this.enterDetail}
            roleId={this.roleId}
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
            <ModalCreation
              title={title}
              visible={open}
              onOk={data => this.handleCreate(data, title)}
              onCancel={this.handleCancel}
            />
            <div className={classes.tableStyles}>
              <Table
                size="middle"
                columns={columns}
                dataSource={roleList}
                rowKey="roleId"
              ></Table>
            </div>
          </>
        )}
      </div>
    );
  }
}
export default connect(({ login }) => ({
  userId: login.userDetail.id,
  teamId: login.currentTeam.id
}))(ProfileManagement);
