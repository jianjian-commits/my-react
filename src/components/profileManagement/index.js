import React from "react";
import { connect } from "react-redux";
import Authenticate from "../shared/Authenticate";
import { Button, Table, message, Popconfirm } from "antd";
import ModalCreation from "./modalCreate/ModalCreation";
import GroupDetail from "./GroupDetail";
import PermissionSetting from "../userManagement/applyPermissionSettings";
import { PROFILE_MANAGEMENT_NEW } from "../../auth";
import classes from "./profile.module.scss";
import request from "../../utils/request";

function GroupList(props) {
  const {
    handleClick,
    columns,
    dataSource,
    title,
    visible,
    onOk,
    onCancel
  } = props;
  return (
    <>
      <span>分组</span>
      <Button icon="filter">筛选</Button>
      <Authenticate auth={PROFILE_MANAGEMENT_NEW}>
        <Button icon="plus" onClick={handleClick}>
          添加分组
        </Button>
      </Authenticate>
      <Table
        // size="middle"
        columns={columns}
        dataSource={dataSource}
        rowKey="roleId"
      ></Table>
      <ModalCreation
        title={title}
        visible={visible}
        onOk={onOk}
        onCancel={onCancel}
      />
    </>
  );
}

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
        this.getGroupList();
      } else {
        message.error(`${title}失败`);
      }
    } catch (err) {
      message.error(`${title}失败`);
    } finally {
      this.setState({ open: false });
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
    const columns = [
      { title: "组名", dataIndex: "roleName" },
      {
        title: "操作",
        dataIndex: "action",
        width: 520,
        render: (text, record) => {
          const roleList = [
            {
              key: "view",
              text: "查看",
              options: () => this.enterDetail(true, "view", record)
            },
            {
              key: "edit",
              text: "编辑",
              options: () => this.enterDetail(true, "edit", record),
              hide: record.code === "SUPER_ADMIN"
            },
            {
              key: "clone",
              text: "克隆",
              options: () =>
                this.setState({
                  open: true,
                  title: "克隆分组",
                  oldRoleId: record.roleId
                })
            },
            {
              key: "delete",
              text: "删除",
              hide: record.code === "SUPER_ADMIN" || record.code === "GENERAL"
            }
          ];
          return roleList
            .filter(v => !v.hide)
            .map(w => {
              return w.key === "delete" ? (
                <Popconfirm
                  title="是否删除这个分组？"
                  okText="是"
                  cancelText="否"
                  onConfirm={() => this.removeGroup(record)}
                  key={w.key}
                >
                  <Button type="link" key={w.key}>
                    {w.text}
                  </Button>
                </Popconfirm>
              ) : (
                <Button type="link" onClick={w.options} key={w.key}>
                  {w.text}
                </Button>
              );
            });
        }
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
          <GroupList
            handleClick={() => this.setState({ open: true, title: "添加分组" })}
            columns={columns}
            dataSource={roleList}
            onOk={data => this.handleCreate(data, title)}
            onCancel={() => this.setState({ open: false })}
            visible={open}
            title={title}
          />
        )}
      </div>
    );
  }
}
export default connect(({ login }) => ({
  userId: login.userDetail.id,
  teamId: login.currentTeam.id
}))(ProfileManagement);
