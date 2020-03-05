import React from "react";
import { Checkbox, Button, Table } from "antd";
import classes from "./profile.module.scss";

// 基础信息
export const getBasicInfo = (a, baseInfoBo, onChange) => {
  let {
    roleName,
    createName,
    createDate = "",
    lastModifyName,
    lastModifyDate = ""
  } = baseInfoBo;

  const basicInfo = [
    { title: "分组名", value: roleName },
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
export const getAppManage = (a, appManagerBos, onChange, enterPermission) => {
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
      dataIndex: "action",
      render: (text, record) => {
        return (
          <Button
            type="link"
            onClick={() => {
              enterPermission(true, record);
            }}
          >
            权限管理
          </Button>
        );
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
export const getOtherManage = (a, permissions, onChange) => {
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
// export const getSetting = (a, setting) => {
//   return (
//     <div className={classes.groupSetting}>
//       <span>Session设置</span>
//       * 过期时间
//       <input defaultValue={setting.sessionTime} readOnly />
//       小时（不活跃状态）
//       <span>Password设置</span>
//       * 最小位数
//       <input defaultValue={setting.passwordMinLength} readOnly />
//       <br />
//       * 密码复杂度
//       <input defaultValue={setting.passwordDiffer} readOnly />
//     </div>
//   );
// };
