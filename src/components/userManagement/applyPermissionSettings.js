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
      checked: true
    },
    createForm: {
      label: "allowCreateNewForm",
      value: "teamId:appId:CF",
      checked: true
    },
    meteDataPermissions: [
      {
        formId: "form01",
        permissions: [
          {
            label: "DISPLAY",
            value: "teamId:appId:form01:RR",
            checked: true
          },
          {
            label: "FORM_REDIT",
            value: "teamId:appId:form01:FU",
            checked: true
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
            checked: true
          },
          {
            label: "PB_REDIT",
            value: "teamId:appId:form01:PU",
            checked: true
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
            checked: true
          },
          {
            label: "FORM_SEARCHOWNER",
            value: "teamId:appId::form01:u#owner:R",
            checked: true
          },
          {
            label: "FORM_ADD",
            value: "teamId:appId::form01:C",
            checked: true
          },
          {
            label: "FORM_REDITOWNER",
            value: "teamId:appId::form01:u#owner:E",
            checked: true
          },
          {
            label: "FORM_DELETE",
            value: "teamId:appId::form01:D",
            checked: false
          },
          {
            label: "FORM_SEARCHALL",
            value: "teamId:appId::form01:R",
            checked: true
          },
          {
            label: "FORM_REDITALL",
            value: "teamId:appId::form01:UA",
            checked: true
          },
          {
            label: "FORM_DELETEALL",
            value: "teamId:appId::form01:DA",
            checked: true
          },
          {
            label: "PB_SEARCHOWNER",
            value: "teamId:appId::form01:u#owner:R",
            checked: true
          },
          {
            label: "PB_SEARCHALL",
            value: "teamId:appId::form01:RA",
            checked: true
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
  state,
  setState,
  index,
  permissionsValue,
  CheckBox,
  formId,
  fp
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
                  dat[index][fp] = filters.map(f => {
                    if (f.label === Td[0].label)
                      return {
                        ...f,
                        checked: !f.checked
                      };
                    return f;
                  });
                  setState({
                    ...state,
                    state: {
                      ...state["state"],
                      [permissionsValue]: dat
                    },
                    data: crreteData({
                      defaultChecked: e.target.defaultChecked,
                      state,
                      dat: Td[0],
                      formId
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
  permissionsValue,
  index,
  state,
  setState,
  CheckBox,
  formId,
  fp
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
            permissionsValue={permissionsValue}
            state={state}
            setState={setState}
            index={index}
            dat={dat}
            CheckBox={CheckBox}
            formId={formId}
            fp={fp}
          />
        ))}
      </tbody>
    </table>
  );
};
const thunkForm = (state, permissionsValue, headers, setState, CheckBox) => {
  const dat = state["state"][permissionsValue];
  const fp =
    permissionsValue === "formPermissions"
      ? "formDetailPermissions"
      : permissionsValue;
  return (
    <>
      {dat.map((form, index) => {
        const filters = form.formDetailPermissions || form.dataPermissions;
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
                    dat[index][fp] = filters.map(f => {
                      if (f.label === "DISPLAY")
                        return {
                          ...f,
                          checked: !f.checked
                        };
                      return f;
                    });
                    setState({
                      ...state,
                      state: {
                        ...state["state"],
                        [permissionsValue]: dat
                      },
                      data: crreteData({
                        defaultChecked: e.target.defaultChecked,
                        state,
                        dat: display[0],
                        formId: form.formId
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
                permissionsValue,
                index,
                state,
                setState,
                CheckBox,
                form.formId,
                fp
              )}
            </div>
            <hr />
          </div>
        );
      })}
    </>
  );
};

const thunkSetting = (state, settingValue, setState, CheckBox) => {
  const dat = state["state"][settingValue];
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
                  [settingValue]: Object.assign({
                    ...dat,
                    checked: !dat.checked
                  })
                },
                data: crreteData({
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

const crreteData = ({ defaultChecked, state, dat, formId }) => {
  const filte = state["data"].filter(f => f.formId === formId)[0];
  const fil = item => {
    return item.filter(f => f !== dat.value);
  };
  const file = item => {
    return item.filter(f => f === dat.value);
  };
  if (!filte)
    state["data"] = [
      ...state["data"],
      { formId, permissionAllTrue: [], permissionTrueToFalse: [] }
    ];
  return state["data"].map(d => {
    if (d.formId === formId) {
      if (!defaultChecked) {
        if (file(d.permissionTrueToFalse).length > 0) {
          return { ...d, permissionTrueToFalse: fil(d.permissionTrueToFalse) };
        }
        return {
          ...d,
          permissionAllTrue: [...fil(d.permissionAllTrue), dat.value]
        };
      }
      if (defaultChecked) {
        if (file(d.permissionAllTrue).length > 0)
          return { ...d, permissionAllTrue: fil(d.permissionAllTrue) };
        return {
          ...d,
          permissionTrueToFalse: [...fil(d.permissionTrueToFalse), dat.value]
        };
      }
    }
    return d;
  });
  // return filte
  //   ? [
  //       ...state.data,
  //       {
  //         ...filte,
  //         permissionAllTrue: [
  //           ...filte.permissionAllTrue.filter(f => f !== dat.value),
  //           dat.value
  //         ],
  //         permissionTrueToFalse: [
  //           ...filte.permissionTrueToFalse.filter(f => f !== dat.value),
  //           dat.value
  //         ]
  //       }
  //     ]
  //   : {
  //       form
  //     };

  // return handleChecked === defaultChecked
  //   ? {
  //       ...state.data,
  //       permissionAllTrue: state.data.permissionAllTrue.filter(
  //         f => f !== dat.value
  //       ),
  //       permissionTrueToFalse: state.data.permissionTrueToFalse.filter(
  //         f => f !== dat.value
  //       )
  //     }
  //   : handleChecked
  //   ? {
  //       ...state.data,
  //       permissionAllTrue: [
  //         ...state.data.permissionAllTrue.filter(f => f !== dat.value),
  //         dat.value
  //       ],
  //       permissionTrueToFalse: state.data.permissionTrueToFalse.filter(
  //         f => f !== dat.value
  //       )
  //     }
  //   : {
  //       ...state.data,
  //       permissionAllTrue: state.data.permissionAllTrue.filter(
  //         f => f !== dat.value
  //       ),
  //       permissionTrueToFalse: [
  //         ...state.data.permissionTrueToFalse.filter(
  //           f => f !== dat.value,
  //           dat.value
  //         )
  //       ]
  //     };
};

const Permission = ({ value, headers, setState, state, CheckBox }) => {
  const permissionsValue = value + "Permissions";
  return (
    <div className={Styles.meteData}>
      <div>
        <h5>{Mete[value]}</h5>
      </div>
      {state["state"].appSetting &&
        thunkSetting(state, "appSetting", setState, CheckBox)}
      {state["state"].createForm &&
        thunkSetting(state, "createForm", setState, CheckBox)}
      {state["state"][permissionsValue] &&
        thunkForm(state, permissionsValue, headers, setState, CheckBox)}
    </div>
  );
};

const Top = ({
  appId,
  roleId,
  setState,
  state,
  action,
  disabled,
  initialData
}) => {
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
          onClick={() => fetchPermissionsDetail({ roleId, appId, setState })}
          disabled={disabled}
        >
          取消
        </Button>
        <Button
          onClick={() => handleSaveButton({ state, initialData })}
          disabled={disabled}
        >
          保存
        </Button>
      </div>
    </div>
  );
};

function handleSaveButton({ state, initialData }) {
  request(`/sysRole/saveAppPermission`, {
    method: "post",
    data: {
      ...initialData,
      appPermissionUpdateDetailBos: state.data
    }
  }).then(
    res => {
      if (res && res.status === "SUCCESS") message.success("保存成功");
    },
    () => message.error("保存应用权限失败")
  );
}

function fetchPermissionsDetail({ roleId, appId, setState, initialData }) {
  request(`/sysRole/appPermission`, {
    method: "put",
    data: { roleId, appId }
  }).then(
    res => {
      if (res && res.status === "SUCCESS")
        setState({
          state: res.data,
          data: initialData.appPermissionUpdateDetailBos
        });
      // { state: res.data, data: initialData } ||
    },
    () => message.error("获取应用权限失败")
  );
}

export default function ApplyPermissionSetting(props) {
  const { action, roleId, appId } = props;
  const initialData = {
    roleId: roleId,
    appId: appId,
    appPermissionUpdateDetailBos: []
  };
  const [state, setState] = useState({
    state: states,
    data: initialData.appPermissionUpdateDetailBos
  });
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
    fetchPermissionsDetail({ roleId, appId, setState, initialData });
    return setInit(true);
  }
  return (
    <>
      <div className={Styles.apsLayout}>
        <div className={Styles.aps}>
          <Top
            appId={appId}
            roleId={roleId}
            state={state}
            action={action}
            setState={setState}
            disabled={disabled}
            initialData={initialData}
          />
          <Permission
            value={"form"}
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
