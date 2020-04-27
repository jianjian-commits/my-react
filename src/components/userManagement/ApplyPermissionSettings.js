import React, { useState } from "react";
import { Button, message, Radio } from "antd";
import Styles from "./user.module.scss";
import request from "../../utils/request";
import { catchError } from "../../utils";
import { Navigation } from "../shared";
import { Checkbox } from "../shared/customWidget";

const formMeteDataThead = {
  formHeader: [
    { key: "TYPE", value: "类型" },
    { key: "ADD", value: "增加" },
    { key: "REDIT", value: "编辑" },
    { key: "DELETE", value: "删除" },
    { key: "ENABLE", value: "启用" }
  ],
  boardHeader: [
    { key: "TYPE", value: "类型" },
    { key: "UPDATE", value: "编辑" },
    { key: "DEL", value: "删除" }
  ]
};

const formDataThead = {
  formHeader: [
    { key: "TYPE", value: "类型" },
    { key: "SEARCHOWNER", value: "查看自己" },
    { key: "ADD", value: "增加" },
    { key: "REDITOWNER", value: "编辑自己" },
    { key: "DELETE", value: "删除自己" },
    { key: "SEARCHALL", value: "查看所有" },
    { key: "REDITALL", value: "编辑所有" },
    { key: "DELETEALL", value: "删除所有" }
  ],
  boardHeader: [
    { key: "TYPE", value: "类型" },
    { key: "UPDATE", value: "编辑" },
    { key: "DEL", value: "删除" }
  ]
};

const Mete = {
  VISIBLE: "是否可见",
  TABLE: [
    { key: "FORM", value: "表单数据" },
    { key: "AP", value: "审批流元数据" },
    { key: "PB", value: "自动化流程元数据" }
  ],
  appSetting: "可见",
  createForm: "允许",
  createBoard: "允许",
  order: "允许"
};

const Board = ({
  dat,
  filters,
  headers,
  permissionsValue,
  index,
  state,
  setState,
  CheckBox,
  formId,
  fp,
  tableName
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
        <tr>
          {headers.map(header => {
            const Td = filters.filter(
              f => f.value.split("_")[2] === header.key
            );
            if (header.key === "TYPE")
              return <td key={header.key}>仪表盘数据</td>;
            return (
              <td key={header.key}>
                {Td[0] && (
                  <CheckBox
                    // defaultChecked={Td[0].defaultChecked || Td[0].checked}
                    checked={Td[0].checked}
                    onChange={e => {
                      dat[index][fp] = filters.map(f => {
                        if (f.value.split("_")[2] === header.key) {
                          return {
                            ...f,
                            checked: e.target.checked
                          };
                        }
                        return f;
                      });
                      setState({
                        ...state,
                        state: {
                          ...state["state"],
                          [permissionsValue]: {
                            ...state["state"][permissionsValue],
                            [tableName]: dat
                          }
                        },
                        data: crreteData({
                          defaultChecked: Td[0].defaultChecked || Td[0].checked,
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
      </tbody>
    </table>
  );
};

const blackSpan = value => (
  <span style={{ color: "#333333", fontSize: "14px" }}>{value}</span>
);

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
  fp,
  tableName
}) => {
  const filte = filters.filter(f => f.label.split("_")[0] === table.key);
  return (
    <tr>
      {headers.map(header => {
        const Td = filte.filter(f => f.label.split("_")[1] === header.key);
        const disabledCheck = value => {
          if (value === "DELETE") {
            const relater = filters.filter(
              f => f.label.split("_")[1] === "DELETEALL"
            )[0].checked;
            return relater;
          }
          if (value === "REDITOWNER") {
            const relater = filters.filter(
              f => f.label.split("_")[1] === "REDITALL"
            )[0].checked;
            return relater;
          }
          if (value === "SEARCHOWNER") {
            const relater = filters.filter(
              f => f.label.split("_")[1] === "SEARCHALL"
            )[0].checked;
            return relater;
          }
          return false;
        };
        return (
          <td key={header.key}>
            {header.key === "TYPE" && <span>{table.value}</span>}
            {Td[0] && (
              <CheckBox
                // defaultChecked={Td[0].defaultChecked || Td[0].checked}
                checked={Td[0].checked}
                disabledCheck={
                  fp === "formPermissions"
                    ? disabledCheck(Td[0].label.split("_")[1])
                    : null
                }
                onChange={e => {
                  dat[index][fp] = filters.map(f => {
                    if (
                      Td[0].label.split("_")[1] === "DELETEALL" &&
                      f.label.split("_")[1] === "DELETE"
                    )
                      return {
                        ...f,
                        checked: e.target.checked
                      };
                    if (
                      Td[0].label.split("_")[1] === "REDITALL" &&
                      f.label.split("_")[1] === "REDITOWNER"
                    )
                      return {
                        ...f,
                        checked: e.target.checked
                      };
                    if (
                      Td[0].label.split("_")[1] === "SEARCHALL" &&
                      f.label.split("_")[1] === "SEARCHOWNER"
                    )
                      return {
                        ...f,
                        checked: e.target.checked
                      };
                    if (f.label === Td[0].label) {
                      return {
                        ...f,
                        checked: !f.checked
                      };
                    }
                    return f;
                  });
                  setState({
                    ...state,
                    state: {
                      ...state["state"],
                      [permissionsValue]: {
                        ...state["state"][permissionsValue],
                        [tableName]: dat
                      }
                    },
                    data: crreteData({
                      defaultChecked: Td[0].defaultChecked || Td[0].checked,
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
const thunkBoard = (
  state,
  permissionsValue,
  headers,
  setState,
  CheckBox,
  disabled,
  tableName,
  fp
) => {
  const dat = state["state"][permissionsValue][tableName];
  return (
    <>
      {dat.map((board, index) => {
        const filters = board.boardDetailPermissions || board[fp];
        const display = filters.filter(
          f =>
            f.value.split("_")[1] === "VISIBLE" ||
            f.value.split("_")[2] === "VISIBLE"
        );
        const onChange = e => {
          dat[index][fp] = filters.map(f => {
            if (
              f.value.split("_")[1] === "VISIBLE" ||
              f.value.split("_")[2] === "VISIBLE"
            ) {
              return {
                ...f,
                checked: e.target.value
              };
            }
            return f;
          });
          setState({
            ...state,
            state: {
              ...state["state"],
              [permissionsValue]: {
                ...state["state"][permissionsValue],
                [tableName]: dat
              }
            },
            data: radioData({
              state,
              dat: display[0],
              formId: board.boardId,
              value: e.target.value
            })
          });
        };
        return (
          <div key={board.boardId} className={Styles.form}>
            <div>
              <div>
                <span>表单</span>
              </div>
              <span>{board.boardName}</span>
            </div>
            <div className={Styles.radioThunk}>
              <div>
                <span>
                  {display &&
                    display[0] &&
                    blackSpan(Mete[display[0].value.split("_")[1]])}
                </span>
                <Radio.Group
                  onChange={onChange}
                  value={display[0].checked}
                  style={{ color: "#333333", fontSize: "14px" }}
                  disabled={disabled}
                >
                  <Radio defaultChecked={display[0].checked} value={true}>
                    {blackSpan("可见")}
                  </Radio>
                  <Radio defaultChecked={display[0].checked} value={false}>
                    {blackSpan("不可见")}
                  </Radio>
                </Radio.Group>
              </div>
            </div>
            <div>
              {display[0].checked && (
                <Board
                  dat={dat}
                  filters={filters}
                  headers={headers}
                  permissionsValue={permissionsValue}
                  index={index}
                  state={state}
                  setState={setState}
                  CheckBox={CheckBox}
                  formId={board.boardId}
                  fp={fp}
                  tableName={tableName}
                />
              )}
            </div>
          </div>
        );
      })}
    </>
  );
};
const thunkForm = (
  state,
  permissionsValue,
  headers,
  setState,
  CheckBox,
  disabled,
  tableName,
  fp
) => {
  const dat = state["state"][permissionsValue][tableName];
  return (
    <>
      {dat.map((form, index) => {
        const filters = form.formDetailPermissions || form[fp];
        const display = filters.filter(
          f => f.value.split("_")[1] === "VISIBLE"
        );
        const onChange = e => {
          dat[index][fp] = filters.map(f => {
            if (f.value.split("_")[1] === "VISIBLE") {
              return {
                ...f,
                checked: e.target.value
              };
            }
            return f;
          });
          setState({
            ...state,
            state: {
              ...state["state"],
              [permissionsValue]: {
                ...state["state"][permissionsValue],
                [tableName]: dat
              }
            },
            data: radioData({
              state,
              dat: display[0],
              formId: form.formId,
              value: e.target.value
            })
          });
        };
        return (
          <div key={form.formId} className={Styles.form}>
            <div>
              <div>
                <span>表单</span>
              </div>
              <span>{form.formName}</span>
            </div>
            <div className={Styles.radioThunk}>
              <div>
                <span>
                  {display &&
                    display[0] &&
                    blackSpan(Mete[display[0].value.split("_")[1]])}
                </span>
                <Radio.Group
                  onChange={onChange}
                  value={display[0].checked}
                  style={{ color: "#333333", fontSize: "14px" }}
                  disabled={disabled}
                >
                  <Radio defaultChecked={display[0].checked} value={true}>
                    {blackSpan("可见")}
                  </Radio>
                  <Radio defaultChecked={display[0].checked} value={false}>
                    {blackSpan("不可见")}
                  </Radio>
                </Radio.Group>
              </div>
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
                  tableName={tableName}
                />
              )}
            </div>
          </div>
        );
      })}
    </>
  );
};

const thunkSetting = (state, settingValue, setState, disabled, visMete) => {
  const dat = state["state"][settingValue];
  const onChange = e => {
    const { value } = e.target;
    setState({
      ...state,
      state: {
        ...state["state"],
        [settingValue]: Object.assign({
          ...dat,
          checked: value
        })
      },
      permissionAllTrue: value
        ? [...state.permissionAllTrue.filter(f => f !== dat.value), dat.value]
        : state.permissionAllTrue.filter(f => f !== dat.value),
      permissionTrueToFalse: value
        ? state.permissionTrueToFalse.filter(f => f !== dat.value)
        : [
            ...state.permissionTrueToFalse.filter(f => f !== dat.value),
            dat.value
          ]
    });
  };
  const radioValue = Mete[settingValue];
  return (
    <>
      <div className={Styles.radioThunk}>
        <div style={{ borderBottom: visMete ? "none" : "1px solid #d6d8de" }}>
          <span>{blackSpan(dat.label)}</span>
          <Radio.Group
            onChange={onChange}
            value={dat.checked}
            style={{ color: "#333333", fontSize: "14px" }}
            disabled={disabled}
          >
            <Radio defaultChecked={dat.checked} value={true}>
              {blackSpan(`${radioValue}`)}
            </Radio>
            <Radio defaultChecked={dat.checked} value={false}>
              {blackSpan(`不${radioValue}`)}
            </Radio>
          </Radio.Group>
        </div>
      </div>
    </>
  );
};

const radioData = ({ state, dat, formId, value }) => {
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
    const values = () => [dat.value];
    if (d.formId === formId) {
      if (value) {
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
      const profix = dat.value.split("_");
      if (profix[1] === "LIST") return [dat.value, profix[0] + "_CHECK"];
      if (profix[1] === "EDITALL") return [dat.value, profix[0] + "_EDIT"];
      if (profix[1] === "DELALL") return [dat.value, profix[0] + "_DEL"];
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
  title,
  disabled
}) => {
  const permissionsValue = value + "Permissions";
  const displayControl = item =>
    state["state"][item] &&
    (state["state"]["appSetting"]["checked"] || value === "data") &&
    settingDisplay;
  const formControl = item => {
    return (
      state["state"][permissionsValue][item] &&
      (state["state"]["appSetting"]["checked"] || value === "data")
    );
  };
  const formValue =
    value === "metaData" ? "formMetaDataPermissions" : "formDataPermissions";
  const boardValue =
    value === "metaData" ? "boardMetaDataPermissions" : "boardDataPermissions";
  return (
    <div className={Styles.meteData}>
      <div>
        <span>{title}</span>
      </div>
      {state["state"].appSetting &&
        settingDisplay &&
        thunkSetting(
          state,
          "appSetting",
          setState,
          disabled,
          !state["state"]["appSetting"]["checked"]
        )}
      {displayControl("createForm") &&
        thunkSetting(state, "createForm", setState, disabled)}
      {displayControl("createBoard") &&
        thunkSetting(state, "createBoard", setState, disabled)}
      {displayControl("order") &&
        thunkSetting(state, "order", setState, disabled)}
      {formControl(formValue) &&
        thunkForm(
          state,
          permissionsValue,
          headers.formHeader,
          setState,
          CheckBox,
          disabled,
          formValue,
          value === "metaData" ? "formDetailPermissions" : "formPermissions"
        )}
      {formControl(boardValue) &&
        thunkBoard(
          state,
          permissionsValue,
          headers.boardHeader,
          setState,
          CheckBox,
          disabled,
          boardValue,
          value === "metaData" ? "boardDetailPermissions" : "boardPermissions"
        )}
    </div>
  );
};

const Top = ({
  roleName,
  state,
  disabled,
  initialData,
  enterPermission,
  enterDetail,
  appId
}) => {
  const navigationList = [
    {
      key: 0,
      label: "分组",
      onClick: () => {
        enterPermission();
        enterDetail();
      }
    },
    { key: 1, label: roleName, onClick: () => enterPermission() },
    { key: 2, label: "应用权限设置", disabled: true }
  ];
  return (
    <div className={Styles.top}>
      <Navigation navs={navigationList} />
      <div className={Styles.btn}>
        <Button onClick={() => enterPermission()}>取消</Button>
        <Button
          onClick={() =>
            handleSaveButton({ state, initialData, enterPermission,appId })
          }
          disabled={disabled}
        >
          保存
        </Button>
      </div>
    </div>
  );
};

function handleSaveButton({ state, initialData, enterPermission,appId }) {
  request(`/sysRole/saveAppPermission`, {
    method: "put",
    data: {
      ...initialData,
      appPermissionUpdateDetailBos: state.data,
      permissionAllTrue: state.permissionAllTrue,
      permissionTrueToFalse: state.permissionTrueToFalse
    },
    headers: { appId }
  }).then(
    res => {
      if (res && res.status === "SUCCESS") {
        message.success("保存成功");
        enterPermission();
      } else {
        message.error(res.msg || "保存应用权限失败");
      }
    },
    err => catchError(err)
  );
}

function fetchPermissionsDetail({ roleId, appId, setState, state }) {
  request(`/sysRole/appPermission`, {
    method: "post",
    data: { roleId },
    headers: { appId }
  }).then(
    res => {
      if (res && res.status === "SUCCESS") {
        setState({
          ...state,
          state: res.data,
          data: []
        });
      } else {
        message.error(res.msg || "获取应用权限失败");
      }
    },
    err => catchError(err)
  );
}

export default function ApplyPermissionSetting(props) {
  const {
    action,
    roleId,
    appId,
    enterPermission,
    roleName,
    enterDetail
  } = props;
  const initialData = {
    roleId: roleId,
    permissionAllTrue: [],
    permissionTrueToFalse: [],
    appPermissionUpdateDetailBos: []
  };
  const [state, setState] = useState({
    state: null,
    data: [],
    permissionAllTrue: [],
    permissionTrueToFalse: []
  });
  const [init, setInit] = useState(false);
  const disabled = action === "view" ? true : false;
  const CheckBox = ({
    defaultChecked,
    checked,
    onChange,
    disabledCheck,
    ...args
  }) => {
    return (
      <Checkbox
        defaultChecked={defaultChecked}
        checked={checked}
        onChange={onChange}
        disabled={disabledCheck || disabled}
        {...args}
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
  if (!state.state) return null;
  return (
    <>
      <div className={Styles.apsLayout}>
        <div className={Styles.aps}>
          <Top
            state={state}
            disabled={disabled}
            initialData={initialData}
            enterPermission={enterPermission}
            enterDetail={enterDetail}
            roleName={roleName}
            appId={appId}
          />
          <Permission
            value={"metaData"}
            headers={formMeteDataThead}
            state={state}
            setState={setState}
            CheckBox={CheckBox}
            settingDisplay={true}
            title={"元数据权限"}
            disabled={disabled}
          />
          <Permission
            value={"data"}
            headers={formDataThead}
            state={state}
            setState={setState}
            CheckBox={CheckBox}
            settingDisplay={false}
            title={"数据权限"}
            disabled={disabled}
          />
        </div>
      </div>
    </>
  );
}
