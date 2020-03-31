import React from "react";
import { connect } from "react-redux";
import Authenticate from "../shared/Authenticate";
import { Button, Table, message, Popconfirm } from "antd";
import ModalCreation from "./modalCreate/ModalCreation";
import GroupDetail from "./GroupDetail";
import PermissionSetting from "../userManagement/ApplyPermissionSettings";
import {
  PROFILE_MANAGEMENT_NEW,
  PROFILE_MANAGEMENT_UPDATE,
  PROFILE_MANAGEMENT_DELETE
} from "../../auth";
import { catchError } from "../../utils";
import { CreateIcon } from "../../assets/icons/teams";
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
    onCancel,
    loading
  } = props;
  return (
    <>
      <span>分组</span>
      <Authenticate auth={PROFILE_MANAGEMENT_NEW}>
        <Button onClick={handleClick}>
          <CreateIcon />
          添加分组
        </Button>
      </Authenticate>
      <Table columns={columns} loading={loading} dataSource={dataSource} rowKey="roleId"></Table>
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
      roleList: [],
      loading: true
    };
    this.action = "view";
    this.roleId = "";
    this.roleName = "";
    this.appId = "";
    this.enterDetail = this.enterDetail.bind(this);
    this.enterPermission = this.enterPermission.bind(this);
  }

  componentDidMount() {
    this.getGroupList()
  }

//   componentWillUnmount = () => {
//     this.setState = (state,callback)=>{
//       return;
//     };
// }

  componentDidUpdate(prevProps) {
    if (prevProps.teamId !== this.props.teamId) {
      clearTimeout(this.loadingTimeout());
      this.getGroupList()
    }
  }
  //loading定时器
  loadingTimeout() {
    return this._timeout = setTimeout(() => { this.setState({ loading: false }); }, 500)
  }
  // 获取分组总列表
  async getGroupList() {
    this.setState({ loading: true })
    try {
      const res = await request("/sysRole/list");
      if (res && res.status === "SUCCESS") {
        this.setState({
          roleList: res.data
        });
      } else {
        message.error(res.msg || "获取分组列表失败");
      }
      this.loadingTimeout()
    } catch (err) {
      this.loadingTimeout()
      catchError(err);
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
        message.error(res.msg || `${title}失败`);
      }
    } catch (err) {
      catchError(err);
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
        message.error(res.msg || "删除失败！");
      }
    } catch (err) {
      catchError(err);
    }
  }

  // 进入或退出分组详情
  enterDetail(boolean, type, record) {
    this.setState({
      enterD: boolean
    });
    this.action = type ? type : "view";
    this.roleId = record ? record.roleId : "";
    this.roleName = record ? record.roleName : "";
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
    const { open, title, roleList, loading } = this.state;
    const columns = [
      { title: "组名", dataIndex: "roleName", width: "70%" },
      {
        title: "操作",
        dataIndex: "action",
        width: "30%",
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
              auth: PROFILE_MANAGEMENT_UPDATE,
              options: () => this.enterDetail(true, "edit", record),
              hide: record.code === "SUPER_ADMIN"
            },
            {
              key: "clone",
              text: "克隆",
              auth: PROFILE_MANAGEMENT_NEW,
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
              auth: PROFILE_MANAGEMENT_DELETE,
              hide: record.code === "SUPER_ADMIN" || record.code === "GENERAL"
            }
          ];
          return roleList
            .filter(v => !v.hide)
            .map(w => (
              <Authenticate key={w.key} auth={w.auth}>
                {w.key === "delete" ? (
                  <Popconfirm
                    title="是否删除这个分组？"
                    okText="是"
                    cancelText="否"
                    onConfirm={() => this.removeGroup(record)}
                    placement="top"
                  >
                    <Button type="link" key={w.key} style={{ color: "#2A7FFF" }}>
                      {w.text}
                    </Button>
                  </Popconfirm>
                ) : (
                    <Button type="link" onClick={w.options} key={w.key} style={{ color: "#2A7FFF" }}>
                      {w.text}
                    </Button>
                  )}
              </Authenticate>
            ));
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
            roleName={this.roleName}
            enterDetail={this.enterDetail}
            enterPermission={this.enterPermission}
          />
        ) : this.state.enterD === true ? (
          <GroupDetail
            action={this.action}
            enterDetail={this.enterDetail}
            roleId={this.roleId}
            roleName={this.roleName}
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
                loading={loading}
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
