import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Icon, Button, Checkbox, message } from "antd";
import Styles from "./user.module.scss";
import request from "../../utils/request";

const formMeteDataThead = [
  { key: "TYPE", value: "类型" },
  { key: "ADD", value: "增加" },
  { key: "REDIT", value: "编辑" },
  { key: "DELETE", value: "删除" },
  { key: "ENABLE", value: "启用" }
];

const formDataThead = [
  { key: "TYPE", value: "类型" },
  { key: "SEARCHOWNER", value: "查看自己" },
  { key: "ADD", value: "增加" },
  { key: "REDITOWNER", value: "编辑自己" },
  { key: "DELETE", value: "删除" },
  { key: "SEARCHALL", value: "查看所有" },
  { key: "REDITALL", value: "编辑所有" },
  { key: "DELETEALL", value: "删除所有" }
];

const Mete = {
  meteData: "元数据权限",
  data: "数据权限",
  DISPLAY: "是否可见",
  TABLE: [
    { key: "FORM", value: "表单元数据" },
    { key: "AP", value: "审批流元数据" },
    { key: "PB", value: "自动化流程元数据" }
  ],
  displayApplySettingButton: "是否显示应用设置按钮",
  allowCreateNewForm: "允许新建列表"
};

const states = {
  meteData: {
    appSetting: {
      label: "displayApplySettingButton",
      value: "teamId:appId:RB",
      checked: false
    },
    createForm: {
      label: "allowCreateNewForm",
      value: "teamId:appId:CF",
      checked: false
    },
    meteDataPermissions: [
      {
        formId: "form01",
        permissions: [
          {
            label: "DISPLAY",
            value: "teamId:appId:form01:RR",
            checked: false
          },
          {
            label: "FORM_REDIT",
            value: "teamId:appId:form01:FU",
            checked: false
          },
          {
            label: "FORM_DELETE",
            value: "teamId:appId:form01:FD",
            checked: false
          },
          {
            label: "AP_ADD",
            value: "teamId:appId:form01:AC",
            checked: false
          },
          {
            label: "AP_REDIT",
            value: "teamId:appId:form01:AU",
            checked: false
          },
          {
            label: "AP_DELETE",
            value: "teamId:appId:form01:AD",
            checked: false
          },
          {
            label: "AP_ENABLE",
            value: "teamId:appId:form01:AE",
            checked: false
          },
          {
            label: "PB_ADD",
            value: "teamId:appId:form01:PC",
            checked: false
          },
          {
            label: "PB_REDIT",
            value: "teamId:appId:form01:PU",
            checked: false
          },
          {
            label: "PB_DELETE",
            value: "teamId:appId:form01:PD",
            checked: false
          },
          {
            label: "PB_ENABLE",
            value: "teamId:appId:form01:PE",
            checked: false
          }
        ]
      },
      {
        formId: "form02",
        permissions: [
          {
            label: "DISPLAY",
            value: "teamId:appId:form02:RR",
            checked: false
          },
          {
            label: "FORM_REDIT",
            value: "teamId:appId:form02:FE",
            checked: false
          },
          {
            label: "FORM_DELETE",
            value: "teamId:appId:form02:FD",
            checked: false
          },
          {
            label: "AP_ADD",
            value: "teamId:appId:form02:AC",
            checked: false
          },
          {
            label: "AP_REDIT",
            value: "teamId:appId:form02:AU",
            checked: false
          },
          {
            label: "AP_DELETE",
            value: "teamId:appId:form02:AD",
            checked: false
          },
          {
            label: "AP_ENABLE",
            value: "teamId:appId:form02:AE",
            checked: false
          },
          {
            label: "PB_ADD",
            value: "teamId:appId:form02:PC",
            checked: false
          },
          {
            label: "PB_REDIT",
            value: "teamId:appId:form02:PU",
            checked: false
          },
          {
            label: "PB_DELETE",
            value: "teamId:appId:form02:PD",
            checked: false
          },
          {
            label: "PB_ENABLE",
            value: "teamId:appId:form02:PE",
            checked: false
          }
        ]
      }
    ]
  },
  data: {
    dataPermissions: [
      {
        formId: "form01",
        permissions: [
          {
            label: "DISPLAY",
            value: "teamId:appId::form01:RR",
            checked: false
          },
          {
            label: "FORM_SEARCHOWNER",
            value: "teamId:appId::form01:u#owner:R",
            checked: false
          },
          {
            label: "FORM_ADD",
            value: "teamId:appId::form01:C",
            checked: false
          },
          {
            label: "FORM_REDITOWNER",
            value: "teamId:appId::form01:u#owner:E",
            checked: false
          },
          {
            label: "FORM_DELETE",
            value: "teamId:appId::form01:D",
            checked: false
          },
          {
            label: "FORM_SEARCHALL",
            value: "teamId:appId::form01:R",
            checked: false
          },
          {
            label: "FORM_REDITALL",
            value: "teamId:appId::form01:UA",
            checked: false
          },
          {
            label: "FORM_DELETEALL",
            value: "teamId:appId::form01:DA",
            checked: false
          },
          {
            label: "PB_SEARCHOWNER",
            value: "teamId:appId::form01:u#owner:R",
            checked: false
          },
          {
            label: "PB_SEARCHALL",
            value: "teamId:appId::form01:RA",
            checked: false
          }
        ]
      }
    ]
  }
};
const Tr = ({
  dat,
  table,
  filters,
  headers,
  value,
  state,
  setState,
  index,
  permissionsValue,
  CheckBox
}) => {
  const filte = filters.filter(f => f.label.split("_")[0] === table.key);
  return (
    <tr>
      {headers.map(header => {
        const Td = filte.filter(f => f.label.split("_")[1] === header.key);
        return (
          <td key={header.key}>
            {header.key === "TYPE" && <span>{table.value}</span>}
            {Td[0] && (
              <CheckBox
                defaultChecked={Td[0].checked}
                checked={Td[0].checked}
                onChange={e => {
                  dat[index].permissions = filters.map(f => {
                    if (f.label === Td[0].label)
                      return { ...f, checked: !f.checked };
                    return f;
                  });
                  setState({
                    ...state,
                    state: {
                      ...state["state"],
                      [value]: {
                        ...state["state"][value],
                        [permissionsValue]: dat
                      }
                    },
                    data: crreteData({
                      handleChecked: e.target.checked,
                      defaultChecked: e.target.defaultChecked,
                      state,
                      dat: Td[0]
                    })
                  });
                }}
              />
            )}
          </td>
        );
      })}
    </tr>
  );
};
const table = (
  dat,
  filters,
  headers,
  value,
  index,
  state,
  setState,
  permissionsValue,
  CheckBox
) => {
  return (
    <table className={Styles.table}>
      <thead>
        <tr>
          {headers.map(header => (
            <th key={header.key}>{header.value}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Mete["TABLE"].map(table => (
          <Tr
            key={table.key}
            table={table}
            filters={filters}
            headers={headers}
            value={value}
            state={state}
            setState={setState}
            index={index}
            dat={dat}
            permissionsValue={permissionsValue}
            CheckBox={CheckBox}
          />
        ))}
      </tbody>
    </table>
  );
};
const thunkForm = (state, value, headers, setState, Data, CheckBox) => {
  const permissionsValue = value + "Permissions";
  const dat = Data[permissionsValue];
  return (
    <>
      {dat.map((form, index) => {
        const filters = form.permissions;
        const display = filters.filter(f => f.label === "DISPLAY");
        return (
          <div key={form.formId} className={Styles.form}>
            <div>
              <span>表单:&nbsp;&nbsp;&nbsp;&nbsp;{form.formId}</span>
            </div>
            <div>
              <span>
                {display && display[0] && Mete[display[0].label]}
                &nbsp;&nbsp;&nbsp;&nbsp;
                <CheckBox
                  defaultChecked={display[0].checked}
                  checked={display[0].checked}
                  onChange={e => {
                    dat[index].permissions = filters.map(f => {
                      if (f.label === "DISPLAY")
                        return { ...f, checked: !f.checked };
                      return f;
                    });
                    setState({
                      ...state,
                      state: {
                        ...state["state"],
                        [value]: {
                          ...state["state"][value],
                          [permissionsValue]: dat
                        }
                      },
                      data: crreteData({
                        handleChecked: e.target.checked,
                        defaultChecked: e.target.defaultChecked,
                        state,
                        dat: display[0]
                      })
                    });
                  }}
                />
              </span>
            </div>
            <div>
              {table(
                dat,
                filters,
                headers,
                value,
                index,
                state,
                setState,
                permissionsValue,
                CheckBox
              )}
            </div>
            <hr />
          </div>
        );
      })}
    </>
  );
};

const thunkSetting = (state, Data, value, settingValue, setState, CheckBox) => {
  const dat = Data[settingValue];
  return (
    <>
      <div>
        <span>
          {Mete[dat.label]}&nbsp;&nbsp;&nbsp;&nbsp;
          <CheckBox
            defaultChecked={dat.checked}
            checked={dat.checked}
            onChange={e =>
              setState({
                ...state,
                state: {
                  ...state["state"],
                  [value]: {
                    ...state["state"][value],
                    [settingValue]: Object.assign({
                      ...dat,
                      checked: !dat.checked
                    })
                  }
                },
                data: crreteData({
                  handleChecked: e.target.checked,
                  defaultChecked: e.target.defaultChecked,
                  state,
                  dat
                })
              })
            }
          />
        </span>
      </div>
      <hr />
    </>
  );
};

const crreteData = ({ handleChecked, defaultChecked, state, dat }) => {
  return handleChecked === defaultChecked
    ? {
        ...state.data,
        permissionAllTrue: state.data.permissionAllTrue.filter(
          f => f !== dat.value
        ),
        permissionTrueToFalse: state.data.permissionTrueToFalse.filter(
          f => f !== dat.value
        )
      }
    : handleChecked
    ? {
        ...state.data,
        permissionAllTrue: [
          ...state.data.permissionAllTrue.filter(f => f !== dat.value),
          dat.value
        ],
        permissionTrueToFalse: state.data.permissionTrueToFalse.filter(
          f => f !== dat.value
        )
      }
    : {
        ...state.data,
        permissionAllTrue: state.data.permissionAllTrue.filter(
          f => f !== dat.value
        ),
        permissionTrueToFalse: [
          ...state.data.permissionTrueToFalse.filter(
            f => f !== dat.value,
            dat.value
          )
        ]
      };
};

const Permission = ({ value, headers, setState, state, CheckBox }) => {
  const permissionsValue = value + "Permissions";
  const Data = state["state"][value];
  return (
    <div className={Styles.meteData}>
      <div>
        <h5>{Mete[value]}</h5>
      </div>
      {Data.appSetting &&
        thunkSetting(state, Data, value, "appSetting", setState, CheckBox)}
      {Data.createForm &&
        thunkSetting(state, Data, value, "createForm", setState, CheckBox)}
      {Data[permissionsValue] &&
        thunkForm(state, value, headers, setState, Data, CheckBox)}
    </div>
  );
};

const Top = ({ appId, roleId, teamId, setState, state, action, disabled }) => {
  return (
    <div className={Styles.top}>
      <div className={Styles.back}>
        <Link to={`/user/profile/${action}/${roleId}`}>
          <span>
            <Icon type="arrow-left" />
          </span>
          <span>应用权限设置</span>
        </Link>
      </div>
      <div className={Styles.btn}>
        <Button
          onClick={() =>
            fetchPermissionsDetail({ roleId, teamId, appId, setState })
          }
          disabled={disabled}
        >
          取消
        </Button>
        <Button onClick={() => handleSaveButton({ state })} disabled={disabled}>
          保存
        </Button>
      </div>
    </div>
  );
};

function handleSaveButton({ state }) {
  request(`/sysRole/saveAppPermission`, {
    method: "post",
    data: state.data
  }).then(
    res => {
      if (res && res.status === "SUCCESS") message.success("保存成功");
    },
    () => message.error("保存应用权限失败")
  );
}

function fetchPermissionsDetail({
  roleId,
  teamId,
  appId,
  setState,
  initialData
}) {
  request(`/sysRole/appPermission`, {
    method: "POST",
    data: { roleId, teamId, appId }
  }).then(
    res => {
      if (res && res.status === "SUCCESS")
        setState(res.data || { state: states, data: initialData });
    },
    () => message.error("获取应用权限失败")
  );
}

export default function ApplyPermissionSetting(props) {
  const { action, roleId, teamId, appId } = props;
  const initialData = {
    roleId: roleId,
    permissionAllTrue: [],
    permissionTrueToFalse: []
  };
  const [state, setState] = useState({ state: states, data: initialData });
  const [init, setInit] = useState(false);
  const disabled = action === "view" ? true : false;
  const CheckBox = ({ defaultChecked, checked, onChange }) => {
    return (
      <Checkbox
        defaultChecked={defaultChecked}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
    );
  };
  if (!init) {
    fetchPermissionsDetail({ roleId, teamId, appId, setState, initialData });
    return setInit(true);
  }
  return (
    <>
      <div className={Styles.apsLayout}>
        <div className={Styles.aps}>
          <Top
            appId={appId}
            roleId={roleId}
            teamId={teamId}
            state={state}
            action={action}
            setState={setState}
            disabled={disabled}
          />
          <Permission
            value={"meteData"}
            headers={formMeteDataThead}
            state={state}
            setState={setState}
            CheckBox={CheckBox}
          />
          <Permission
            value={"data"}
            headers={formDataThead}
            state={state}
            setState={setState}
            CheckBox={CheckBox}
          />
        </div>
      </div>
    </>
  );
}
