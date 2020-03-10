import React, { useState } from "react";
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
  appSetting: {
    label: "displayApplySettingButton",
    value: "APP_SETTING",
    checked: false
  },
  createForm: {
    label: "allowCreateNewForm",
    value: "APP_CREATEFORM",
    checked: false
  },
  formPermissions: [
    {
      formId: "form01",
      formDetailPermissions: [
        {
          label: "DISPLAY",
          value: "FORM_VISIBLE",
          checked: false
        },
        {
          label: "FORM_REDIT",
          value: "FORM_DATAEDIT",
          checked: false
        },
        {
          label: "FORM_DELETE",
          value: "FORM_DATADEL",
          checked: false
        },
        {
          label: "AP_ADD",
          value: "FORM_APPROVEADD",
          checked: false
        },
        {
          label: "AP_DELETE",
          value: "FORM_APPROVEDEL",
          checked: false
        },
        {
          label: "AP_REDIT",
          value: "FORM_APPROVEEDIT",
          checked: false
        },
        {
          label: "AP_ENABLE",
          value: "FORM_APPROVEENABLE",
          checked: false
        },
        {
          label: "PB_ADD",
          value: "FORM_AUTOADD",
          checked: false
        },
        {
          label: "PB_DELETE",
          value: "FORM_AUTODEL",
          checked: false
        },
        {
          label: "PB_REDIT",
          value: "FORM_AUTOEDIT",
          checked: false
        },
        {
          label: "PB_ENABLE",
          value: "FORM_AUTOENABLE",
          checked: false
        }
      ]
    },
    {
      formId: "form02",
      formDetailPermissions: [
        {
          label: "DISPLAY",
          value: "FORM_VISIBLE",
          checked: false
        },
        {
          label: "FORM_REDIT",
          value: "FORM_DATAEDIT",
          checked: false
        },
        {
          label: "FORM_DELETE",
          value: "FORM_DATADEL",
          checked: false
        },
        {
          label: "AP_ADD",
          value: "FORM_APPROVEADD",
          checked: false
        },
        {
          label: "AP_DELETE",
          value: "FORM_APPROVEDEL",
          checked: false
        },
        {
          label: "AP_REDIT",
          value: "FORM_APPROVEEDIT",
          checked: false
        },
        {
          label: "AP_ENABLE",
          value: "FORM_APPROVEENABLE",
          checked: false
        },
        {
          label: "PB_ADD",
          value: "FORM_AUTOADD",
          checked: false
        },
        {
          label: "PB_DELETE",
          value: "FORM_AUTODEL",
          checked: false
        },
        {
          label: "PB_REDIT",
          value: "FORM_AUTOEDIT",
          checked: false
        },
        {
          label: "PB_ENABLE",
          value: "FORM_AUTOENABLE",
          checked: false
        }
      ]
    }
  ],
  dataPermissions: [
    {
      formId: "form01",
      dataPermissions: [
        {
          label: "DISPLAY",
          value: "FORMDATA_VISIBLE",
          checked: false
        },
        {
          label: "FORM_ADD",
          value: "FORMDATA_ADD",
          checked: false
        },
        {
          label: "FORM_SEARCHOWNER",
          value: "FORMDATA_CHECK",
          checked: false
        },
        {
          label: "FORM_DELETE",
          value: "FORMDATA_DEL",
          checked: false
        },
        {
          label: "FORM_DELETEALL",
          value: "FORMDATA_DELALL",
          checked: false
        },
        {
          label: "FORM_REDITOWNER",
          value: "FORMDATA_EDIT",
          checked: false
        },
        {
          label: "FORM_REDITALL",
          value: "FORMDATA_EDITALL",
          checked: false
        },
        {
          label: "FORM_SEARCHALL",
          value: "FORMDATA_LIST",
          checked: false
        }
      ]
    },
    {
      formId: "form02",
      dataPermissions: [
        {
          label: "DISPLAY",
          value: "FORMDATA_VISIBLE",
          checked: false
        },
        {
          label: "FORM_ADD",
          value: "FORMDATA_ADD",
          checked: false
        },
        {
          label: "FORM_SEARCHOWNER",
          value: "FORMDATA_CHECK",
          checked: false
        },
        {
          label: "FORM_DELETE",
          value: "FORMDATA_DEL",
          checked: false
        },
        {
          label: "FORM_DELETEALL",
          value: "FORMDATA_DELALL",
          checked: false
        },
        {
          label: "FORM_REDITOWNER",
          value: "FORMDATA_EDIT",
          checked: false
        },
        {
          label: "FORM_REDITALL",
          value: "FORMDATA_EDITALL",
          checked: false
        },
        {
          label: "FORM_SEARCHALL",
          value: "FORMDATA_LIST",
          checked: false
        }
      ]
    }
  ]
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
                defaultChecked={Td[0].defaultChecked || Td[0].checked}
                checked={Td[0].checked}
                onChange={e => {
                  dat[index][fp] = filters.map(f => {
                    // const relate = (r, rd) => {
                    //   if (
                    //     Td[0].label.split("_")[1] === r &&
                    //     f.label.split("_")[1] === rd
                    //   )
                    //     return {
                    //       ...f,
                    //       checked: true,
                    //       defaultChecked: f.defaultChecked || f.checked
                    //     };
                    // };
                    // relate("DELETEALL", "DELETE");
                    // relate("REDITALL", "REDITOWNER");
                    // relate("SEARCHALL", "SEARCHOWNER");
                    if (f.label === Td[0].label)
                      return {
                        ...f,
                        checked: !f.checked,
                        defaultChecked: f.defaultChecked || f.checked
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
                      checked: e.target.checked,
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
const Table = ({
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
}) => {
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
          <React.Fragment key={table.key}>
            {filters.filter(f => f.label.split("_")[0] === table.key)[0] && (
              <Tr
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
            )}
          </React.Fragment>
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
                  defaultChecked={
                    display[0].defaultChecked || display[0].checked
                  }
                  checked={display[0].checked}
                  onChange={e => {
                    dat[index][fp] = filters.map(f => {
                      if (f.label === "DISPLAY")
                        return {
                          ...f,
                          checked: !f.checked,
                          defaultChecked: f.defaultChecked || f.checked
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
                        checked: e.target.checked,
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
              {display[0].checked && (
                <Table
                  dat={dat}
                  filters={filters}
                  headers={headers}
                  permissionsValue={permissionsValue}
                  index={index}
                  state={state}
                  setState={setState}
                  CheckBox={CheckBox}
                  formId={form.formId}
                  fp={fp}
                />
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
            defaultChecked={dat.defaultChecked || dat.checked}
            checked={dat.checked}
            onChange={e => {
              const { defaultChecked, checked } = e.target;
              setState({
                ...state,
                state: {
                  ...state["state"],
                  [settingValue]: Object.assign({
                    ...dat,
                    checked: !dat.checked,
                    defaultChecked: dat.defaultChecked || dat.checked
                  })
                },
                permissionAllTrue:
                  defaultChecked === checked
                    ? state.permissionAllTrue.filter(f => f !== dat.value)
                    : checked
                    ? [
                        ...state.permissionAllTrue.filter(f => f !== dat.value),
                        dat.value
                      ]
                    : state.permissionAllTrue.filter(f => f !== dat.value),
                permissionTrueToFalse:
                  defaultChecked === checked
                    ? state.permissionTrueToFalse.filter(f => f !== dat.value)
                    : checked
                    ? state.permissionTrueToFalse.filter(f => f !== dat.value)
                    : [
                        ...state.permissionTrueToFalse.filter(
                          f => f !== dat.value
                        ),
                        dat.value
                      ]
              });
            }}
          />
        </span>
      </div>
      <hr />
    </>
  );
};

const crreteData = ({ defaultChecked, checked, state, dat, formId }) => {
  const fi = state.data.filter(f => f.formId === formId);
  const fil = item => {
    return item.filter(f => f !== dat.value);
  };
  if (!fi[0])
    state.data = [
      ...state.data,
      {
        formId,
        permissionAllTrue: [],
        permissionTrueToFalse: []
      }
    ];
  return state.data.map(d => {
    const values = () => {
      // const profix = dat.value.split("_");
      // if (profix[1] === "SEARCHALL")
      //   return [dat.value, profix[0] + "SEARCHOWNER"];
      // if (profix[1] === "REDITALL") return [dat.value, profix[0] + "REDITOWNER"];
      // if (profix[1] === "DELETEALL") return [dat.value, profix[0] + "DELETE"];
      return [dat.value];
    };
    if (d.formId === formId) {
      if (defaultChecked === checked)
        return {
          ...d,
          permissionAllTrue: fil(d.permissionAllTrue),
          permissionTrueToFalse: fil(d.permissionTrueToFalse)
        };
      if (checked) {
        return {
          ...d,
          permissionAllTrue: [...fil(d.permissionAllTrue), ...values()],
          permissionTrueToFalse: fil(d.permissionTrueToFalse)
        };
      } else {
        return {
          ...d,
          permissionAllTrue: fil(d.permissionAllTrue),
          permissionTrueToFalse: [...fil(d.permissionTrueToFalse), ...values()]
        };
      }
    }
    return d;
  });
};

const Permission = ({
  value,
  headers,
  setState,
  state,
  CheckBox,
  settingDisplay,
  title
}) => {
  const permissionsValue = value + "Permissions";
  return (
    <div className={Styles.meteData}>
      <div>
        <h5>{title}</h5>
      </div>
      {state["state"].appSetting &&
        settingDisplay &&
        thunkSetting(state, "appSetting", setState, CheckBox)}
      {state["state"].createForm &&
        settingDisplay &&
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
  initialData,
  enterPermission
}) => {
  return (
    <div className={Styles.top}>
      <div className={Styles.back} onClick={enterPermission}>
        <span>
          <Icon type="arrow-left" />
        </span>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <span>应用权限设置</span>
      </div>
      <div className={Styles.btn}>
        <Button onClick={enterPermission} disabled={disabled}>
          取消
        </Button>
        <Button
          onClick={() =>
            handleSaveButton({ state, initialData, enterPermission })
          }
          disabled={disabled}
        >
          保存
        </Button>
      </div>
    </div>
  );
};

function handleSaveButton({ state, initialData, enterPermission }) {
  request(`/sysRole/saveAppPermission`, {
    method: "put",
    data: {
      ...initialData,
      appPermissionUpdateDetailBos: state.data,
      permissionAllTrue: state.permissionAllTrue,
      permissionTrueToFalse: state.permissionTrueToFalse
    }
  }).then(
    res => {
      if (res && res.status === "SUCCESS") message.success("保存成功");
      enterPermission();
    },
    () => message.error("保存应用权限失败")
  );
}

function fetchPermissionsDetail({ roleId, appId, setState, state }) {
  request(`/sysRole/appPermission`, {
    method: "post",
    data: { roleId, appId }
  }).then(
    res => {
      if (res && res.status === "SUCCESS")
        setState({
          ...state,
          state: res.data,
          data: []
        });
    },
    () => message.error("获取应用权限失败")
  );
}

export default function ApplyPermissionSetting(props) {
  const { action, roleId, appId, enterPermission } = props;
  const initialData = {
    roleId: roleId,
    appId: appId,
    permissionAllTrue: [],
    permissionTrueToFalse: [],
    appPermissionUpdateDetailBos: []
  };
  const [state, setState] = useState({
    state: states,
    data: [],
    permissionAllTrue: [],
    permissionTrueToFalse: []
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
    fetchPermissionsDetail({
      roleId,
      appId,
      setState,
      state
    });
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
            enterPermission={enterPermission}
          />
          <Permission
            value={"form"}
            headers={formMeteDataThead}
            state={state}
            setState={setState}
            CheckBox={CheckBox}
            settingDisplay={true}
            title={"元数据权限"}
          />
          <Permission
            value={"data"}
            headers={formDataThead}
            state={state}
            setState={setState}
            CheckBox={CheckBox}
            settingDisplay={false}
            title={"数据权限"}
          />
        </div>
      </div>
    </>
  );
}
