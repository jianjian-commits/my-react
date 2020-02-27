import React, { Component } from "react";
import { Icon, Button, Table, Checkbox, message } from "antd";
import classes from "./profile.module.scss";
import { history } from "../../store";
import request from "../../utils/request";

class GroupDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      baseInfoBo: {},
      appManagerBos: [],
      permissions: {},
      setting: {}
    };
    const matches =
      /^\/user\/profile\/(\w+)\/(\w+)/.exec(history.location.pathname) || [];
    this.action = matches[1] || "view";
    this.groupId = matches[2] || "";
    this.oldPermissionAllTrue = [];
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    // 获取分组详情
    this.getDetail();
  }

  // 获取查看详情/编辑详情
  async getDetail() {
    const data = {
      groupId: this.groupId,
      teamId: ""
    };
    try {
      const res = await request("/group/detail", {
        method: "POST",
        data
      });
      if (res && res.status === "SUCCESS") {
        const {
          baseInfoBo,
          appManagerBos,
          permissions,
          sessionTime,
          passwordMinLength,
          passwordDiffer
        } = res.data;
        this.setState({
          baseInfoBo,
          appManagerBos,
          permissions,
          setting: {
            sessionTime,
            passwordMinLength,
            passwordDiffer
          }
        });
        // 获取数据库中（其他管理)被选中的选项值value
        this.oldPermissionAllTrue = this.getTrueValue(this.state.permissions);
      } else {
        message.error("获取详情失败");
      }
    } catch (err) {
      message.error("获取详情失败");
    }
  }

  onChange(state, type) {
    if (type === "getBasicInfo") {
      this.setState({
        baseInfoBo: {
          ...this.state.baseInfoBo,
          groupName: state
        }
      });
    }
    if (type === "getAppManage") {
      const { checkedValue, appId } = state;
      this.setState({
        appManagerBos: this.state.appManagerBos.map(item => {
          if (item.appId === appId) {
            return {
              ...item,
              checked: checkedValue
            };
          }
          return item;
        })
      });
    }
    if (type === "getOtherManage") {
      const { checkedValue, key } = state;
      const clickLine = this.state.permissions[key];
      this.setState({
        permissions: {
          ...this.state.permissions,
          [key]: clickLine.map(item => ({
            ...item,
            checked: checkedValue.includes(item.value)
          }))
        }
      });
    }
  }

  // 获取（其他管理)被选中的选项值value
  getTrueValue(state) {
    const result = [];
    for (let key in state) {
      state[key].forEach(item => {
        if (item.checked) {
          result.push(item.value);
        }
      });
    }
    return result;
  }

  // 保存
  async handleDetail() {
    // 其他管理（此刻所有被选中的选项值)
    const permissionAllTrue = this.getTrueValue(this.state.permissions);
    // 获取选中后被取消
    const permissionTrueToFalse = this.oldPermissionAllTrue.filter(
      item => !permissionAllTrue.includes(item)
    );

    // 应用管理被选中的id
    const appIds = this.state.appManagerBos
      .filter(item => item.checked)
      .map(item => item.appId);

    // 传给后台的data数据
    let data = {
      groupId: this.groupId,
      groupName: this.state.baseInfoBo.groupName,
      appIds,
      permissionAllTrue,
      permissionTrueToFalse,
      ...this.state.setting
    };
    try {
      const res = await request("/group/updateGroup", {
        method: "POST",
        data
      });
      if (res && res.status === "SUCCESS") {
        message.success("保存成功！");
      } else {
        message.error("保存失败！");
      }
    } catch (err) {
      message.error("保存失败！");
    }
  }

  render() {
    // 获取是查看还是编辑行为
    const action = this.action;
    const { baseInfoBo, permissions, appManagerBos, setting } = this.state;
    return (
      <div className={classes.groupContainer}>
        <div className={classes.groupHeader}>
          <Icon
            type="arrow-left"
            onClick={() => history.replace("/user/profile")}
          />
          <span>分组</span>
          {action === "edit" && (
            <>
              <Button type="primary" onClick={() => this.handleDetail()}>
                保存
              </Button>
              <Button onClick={() => history.replace("/user/profile")}>
                取消
              </Button>
            </>
          )}
        </div>
        {getBasicInfo(action, baseInfoBo, this.onChange)}
        {getAppManage(action, appManagerBos, this.onChange)}
        {getOtherManage(action, permissions, this.onChange)}
        {getSetting(action, setting)}
      </div>
    );
  }
}
export default GroupDetail;

// 基础信息
const getBasicInfo = (a, baseInfoBo, onChange) => {
  let {
    groupName,
    createName,
    createDate = "",
    lastModifyName,
    lastModifyDate = ""
  } = baseInfoBo;

  const basicInfo = [
    { title: "分组名", value: groupName },
    { title: "创建人", value: createName },
    {
      title: "创建时间",
      value: createDate.split(".")[0].replace("T", " ")
    },
    { title: "最后修改人", value: lastModifyName },
    {
      title: "最后修改时间",
      value: lastModifyDate.split(".")[0].replace("T", " ")
    }
  ];

  return (
    <div className={classes.groupBasic}>
      <span>基础信息</span>
      <table>
        <tbody>
          {basicInfo.map(i => {
            return (
              <tr key={i.title}>
                <td>{i.title}</td>
                <td>
                  <input
                    readOnly={a === "view" || i.title !== "分组名"}
                    defaultValue={i.value}
                    className={classes.inputStyle}
                    onChange={e => onChange(e.target.value, "getBasicInfo")}
                  ></input>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// 应用管理（动态）
const getAppManage = (a, appManagerBos, onChange) => {
  // 表格头
  const columns = [
    { title: "应用名", dataIndex: "appName" },
    {
      title: "是否可见",
      dataIndex: "checked",
      render: (text, record) => {
        return (
          <Checkbox
            checked={record.checked}
            disabled={a === "view"}
            onChange={e =>
              onChange(
                {
                  checkedValue: e.target.checked,
                  appId: record.appId
                },
                "getAppManage"
              )
            }
          />
        );
      }
    },
    {
      title: "操作",
      key: "action",
      dataIndex: "action",
      render: (text, record) => {
        return <a href="/">权限管理</a>;
      }
    }
  ];
  return (
    <div className={classes.groupApp}>
      <span>应用管理</span>
      <div className={classes.tableStyles}>
        <Table
          size="middle"
          columns={columns}
          dataSource={appManagerBos}
          rowKey="appId"
        ></Table>
      </div>
    </div>
  );
};

// 其他管理
const getOtherManage = (a, permissions, onChange) => {
  const {
    teamPermissions = [],
    teamEmployerPermissions = [],
    groupPermissions = []
  } = permissions;

  // 获取checked即被选中
  const getChecked = t => t.filter(i => i.checked).map(i => i.value);

  const teamInfo = [
    {
      title: "团队信息管理",
      options: teamPermissions,
      value: getChecked(teamPermissions),
      key: "teamPermissions"
    },
    {
      title: "团队成员管理",
      options: teamEmployerPermissions,
      value: getChecked(teamEmployerPermissions),
      key: "teamEmployerPermissions"
    },
    {
      title: "分组管理",
      options: groupPermissions,
      value: getChecked(groupPermissions),
      key: "groupPermissions"
    }
  ];

  return (
    <>
      {/* <h3>其他</h3> */}
      {teamInfo.map(i => {
        return (
          <div className={classes.groupManage} key={i.title}>
            <span>{i.title}</span>
            <Checkbox.Group
              options={i.options}
              value={i.value}
              disabled={a === "view"}
              onChange={checkedValue =>
                onChange(
                  {
                    checkedValue,
                    key: i.key
                  },
                  "getOtherManage"
                )
              }
            ></Checkbox.Group>
          </div>
        );
      })}
    </>
  );
};

// 设置
const getSetting = (a, setting) => {
  return (
    <div className={classes.groupSetting}>
      <span>Session设置</span>
      * 过期时间
      <input defaultValue={setting.sessionTime} readOnly />
      小时（不活跃状态）
      <span>Password设置</span>
      * 最小位数
      <input defaultValue={setting.passwordMinLength} readOnly />
      <br />
      * 密码复杂度
      <input defaultValue={setting.passwordDiffer} readOnly />
    </div>
  );
};
