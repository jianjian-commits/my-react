import React, { Component } from "react";
import { Icon, Button, Table, Checkbox } from "antd";
import classes from "./profile.module.scss";
import { history } from "../../store";

const basicInfo = [
  { title: "分组名", value: "HR" },
  { title: "创建人", value: "Kevin" },
  { title: "创建时间", value: "2020/1/12 08:20" },
  { title: "最后修改人", value: "Helen" },
  { title: "最后修改时间", value: "2020/1/22 18:20" }
];
const teamInfo = [
  { title: "团队信息管理", options: ["领队信息修改"], defaultValue: [] },
  {
    title: "团队成员管理",
    options: ["查看列表", "邀请用户", "更改分组", "踢人"],
    defaultValue: ["查看列表"]
  },
  {
    title: "分组管理",
    options: ["查看列表", "增加", "编辑", "删除"],
    defaultValue: ["查看列表"]
  }
];

class GroupDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    // 获取是查看还是编辑行为
    let action = history.location.state.action;
    return (
      <div className={classes.groupContainer}>
        <div className={classes.groupHeader}>
          <Icon
            type="arrow-left"
            onClick={() => history.replace("/user/profile")}
          />
          <span>分组</span>
          <Button type="primary">保存</Button>
          <Button>取消</Button>
        </div>
        {getBasicInfo(action)}
        {getAppManage(action)}
        {getOtherManage(action)}
        {getSetting()}
      </div>
    );
  }
}
export default GroupDetail;

// 基础信息
const getBasicInfo = action => {
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
                    readOnly={action === "view" || i.title !== "分组名"}
                    defaultValue={i.value}
                    className={classes.inputStyle}
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
const getAppManage = action => {
  // 表格数据
  const dataSource = [
    { key: "leave", name: "请假申请", isChecked: false },
    { key: "car", name: "车辆管理系统", isChecked: true, action: "权限管理" },
    { key: "order", name: "订单管理", isChecked: false }
  ];
  // 表格头
  let columns = [
    { title: "应用名", key: "appName", dataIndex: "name" },
    {
      title: "是否可见",
      key: "visible",
      dataIndex: "visible",
      render: (text, record) => {
        return (
          <Checkbox
            defaultChecked={record.isChecked}
            disabled={action === "view"}
          />
        );
      }
    },
    {
      title: "操作",
      key: "action",
      dataIndex: "action",
      render: (text, record) => {
        return <a href="/">{record.action}</a>;
      }
    }
  ];
  return (
    <div className={classes.groupApp}>
      <span>应用管理</span>
      <div className={classes.tableStyles}>
        <Table size="middle" columns={columns} dataSource={dataSource}></Table>
      </div>
    </div>
  );
};

// 其他管理
const getOtherManage = action => {
  return (
    <>
      {teamInfo.map(i => {
        return (
          <div className={classes.groupManage} key={i.title}>
            <span>{i.title}</span>
            <Checkbox.Group
              options={i.options}
              defaultValue={i.defaultValue}
              disabled={action === "view"}
            ></Checkbox.Group>
          </div>
        );
      })}
    </>
  );
};

// 设置
const getSetting = () => {
  return (
    <div className={classes.groupSetting}>
      <span>Session设置</span>
      * 过期时间
      <input defaultValue={0.5} readOnly />
      小时（不活跃状态）
      <span>Password设置</span>
      * 最小位数
      <input defaultValue={8} readOnly />
      <br />
      * 密码复杂度
      <input defaultValue={"数字和字母组合"} readOnly />
    </div>
  );
};
