import React, { Fragment } from "react";
import { Checkbox, Button, Table, Input, Radio, ConfigProvider } from "antd";
import classes from "./profile.module.scss";
import moment from "moment";
import { EditIcon } from "../../assets/icons";
import zhCN from "antd/es/locale/zh_CN";

export const BaseInfoModule = ({
  disabled,
  baseInfoBo,
  editable,
  setEditable,
  onChange
}) => {
  const {
    roleName,
    createName,
    createdDate,
    lastModifyName,
    lastModifyDate
  } = baseInfoBo;
  const formatDate = date => moment(date).format("YYYY/MM/DD hh:mm");
  const list = [
    { title: "分组名", value: roleName },
    { title: "创建人", value: createName },
    { title: "创建时间", value: formatDate(createdDate) },
    { title: "最后修改人", value: lastModifyName },
    { title: "最后修改时间", value: formatDate(lastModifyDate) }
  ];
  return (
    <div className={classes.groupBasic}>
      <div style={{ fontSize: "15px", color: "#777F97", marginBottom: "7px" }}>
        基本信息
      </div>
      <table>
        <tbody>
          {list.map((i, index) => (
            <tr key={i.title}>
              <td>{i.title}</td>
              <td>
                {editable && index === 0 && (
                  <Input
                    value={i.value}
                    onBlur={() => setEditable(false)}
                    onChange={e => {
                      onChange(e.target.value, "baseInfoBo");
                    }}
                  />
                )}
                <span>{i.value}</span>
                {!disabled && !editable && index === 0 && (
                  <EditIcon onClick={() => setEditable(true)} />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const AppManagerModule = ({
  disabled,
  appManagerBos,
  onChange,
  enterPermission,
  permissions
}) => {
  const { appVisible = {} } = permissions;
  const columns = [
    { title: "应用名", dataIndex: "appName" },
    {
      title: "是否可见",
      dataIndex: "checked",
      render: (text, record) => (
        <Checkbox
          checked={record.checked}
          disabled={disabled}
          onChange={e =>
            onChange(
              {
                checkedValue: e.target.checked,
                appId: record.appId
              },
              "appManagerBos"
            )
          }
        />
      )
    },
    {
      title: "操作",
      dataIndex: "action",
      width:"27%",
      // render: (text, record) => (
      //   <Button
      //     type="link"
      //     onClick={() => {
      //       enterPermission(true, record);
      //     }}
      //     style={{ color: "#2A7FFF" }}
      //   >
      //     权限管理
      //   </Button>
      // )
      render: (text, record) => {
        console.log('text',text);
        console.log('record',record);
        return (
          <>
            {record.checked && (
              <Button
                type="link"
                onClick={() => {
                  enterPermission(true, record);
                }}
                style={{ color: "#2A7FFF" }}
              >
                权限管理
              </Button>
            )}
          </>
        );
      }
    }
  ];
  return (
    <div className={classes.groupApp}>
      <span className={classes.moduleTitle}>应用管理</span>
      <div className={classes.radioStyle}>
        {appVisible.label}
        <Radio.Group
          value={appVisible.checked}
          disabled={disabled}
          onChange={e =>
            onChange(
              {
                checkedValue: e.target.value,
                arrayItem: "appVisible"
              },
              "permissions_radio"
            )
          }
        >
          <Radio value={true}>允许</Radio>
          <Radio value={false}>不允许</Radio>
        </Radio.Group>
      </div>
      <ConfigProvider locale={zhCN}>
        <Table
          columns={columns}
          dataSource={appManagerBos}
          rowKey="appId"
          pagination={false}
        ></Table>
      </ConfigProvider>
    </div>
  );
};

export const PermissionsModule = ({ disabled, permissions, onChange }) => {
  const {
    teamVisible = {},
    teamPermission = {},
    teamEmployerPermissions = [],
    groupPermissions = []
  } = permissions;
  const radioList = [
    { key: "teamVisible", ...teamVisible, option: "可见" },
    { key: "teamPermission", ...teamPermission, option: "允许" }
  ];
  const checkboxList = [
    {
      key: "teamEmployerPermissions",
      title: "团队成员管理",
      data: [...teamEmployerPermissions]
    },
    { key: "groupPermissions", title: "分组管理", data: [...groupPermissions] }
  ];
  return (
    <div className={classes.groupManage}>
      {radioList.map(i => {
        return (
          <Fragment key={i.key}>
            {(i.key === "teamVisible" || teamVisible.checked !== false) && (
              <>
                <span className={classes.moduleTitle}>{i.label}</span>
                <Radio.Group
                  disabled={disabled}
                  value={i.checked}
                  onChange={e =>
                    onChange(
                      {
                        checkedValue: e.target.value,
                        arrayItem: i.key
                      },
                      "permissions_radio"
                    )
                  }
                >
                  <Radio value={true}>{i.option}</Radio>
                  <Radio value={false}>不{i.option}</Radio>
                </Radio.Group>
              </>
            )}
          </Fragment>
        );
      })}
      {teamVisible.checked !== false &&
        checkboxList.map(i => (
          <Fragment key={i.key}>
            <span className={classes.moduleTitle}>{i.title}</span>
            <div className={classes.checkboxStyle}>
              {i.data.map(j => (
                <Fragment key={j.label}>
                  <span>{j.label}</span>
                  <Checkbox
                    checked={j.checked}
                    disabled={disabled}
                    onChange={e =>
                      onChange(
                        {
                          checkedValue: e.target.checked,
                          arrayItem: i.key,
                          label: j.label
                        },
                        "permissions_checkbox"
                      )
                    }
                  />
                </Fragment>
              ))}
            </div>
          </Fragment>
        ))}
    </div>
  );
};

// export const SettingModule = ({ disabled, settings }) => {
//   const { sessionTime, passwordMinLength, passwordDiffer } = settings;
//   return (
//     <div className={classes.groupSetting}>
//       <span className={classes.moduleTitle}>Session设置</span>
//       <div>
//         <span className={classes.star}>*</span> 过期时间
//         <Input value={sessionTime} disabled={disabled} />
//         小时（不活跃状态）
//       </div>
//       <span className={classes.moduleTitle}>Password设置</span>
//       <div>
//         <span className={classes.star}>*</span> 最小位数
//         <Input value={passwordMinLength} disabled={disabled} />
//         <span className={classes.star}>*</span> 密码复杂度
//         <Input value={passwordDiffer} disabled={disabled} />
//       </div>
//     </div>
//   );
// };
