import React from "react";
import { Icon, Button, Checkbox } from "antd";
import Styles from "./user.module.scss";

const formMeteDataThead = [
  { key: "T", value: "类型" },
  { key: "A", value: "增加" },
  { key: "U", value: "编辑" },
  { key: "D", value: "删除" },
  { key: "E", value: "启用" }
];

const state = {
  appSetting: {
    label: "显示应用设置按钮",
    value: "teamId:appId:RB",
    checked: false
  },
  createForm: {
    label: "允许新建表单",
    value: "teamId:appId:CF",
    checked: false
  },
  formPermissions: [
    {
      formId: "form01",
      formDetailPermissions: [
        {
          label: "是否可见",
          value: "teamId:appId:form01:RR",
          checked: false
        },
        {
          label: "表单编辑",
          value: "teamId:appId:form01:FU",
          checked: false
        },
        {
          label: "表单删除",
          value: "teamId:appId:form01:FD",
          checked: false
        },
        {
          label: "审批流增加",
          value: "teamId:appId:form01:AC",
          checked: false
        },
        {
          label: "审批流编辑",
          value: "teamId:appId:form01:AU",
          checked: false
        },
        {
          label: "审批流删除",
          value: "teamId:appId:form01:AD",
          checked: false
        },
        {
          label: "审批流元数据启用",
          value: "teamId:appId:form01:AE",
          checked: false
        },
        {
          label: "自动化流程增加",
          value: "teamId:appId:form01:ATC",
          checked: false
        },
        {
          label: "自动化流程编辑",
          value: "teamId:appId:form01:ATU",
          checked: false
        },
        {
          label: "自动化流程删除",
          value: "teamId:appId:form01:ATD",
          checked: false
        },
        {
          label: "自动化流程启用",
          value: "teamId:appId:form01:ATE",
          checked: false
        }
      ]
    },
    {
      formId: "form02",
      formDetailPermissions: [
        {
          label: "是否可见",
          value: "teamId:appId:form02:RR",
          checked: false
        },
        {
          label: "表单编辑",
          value: "teamId:appId:form02:FE",
          checked: false
        },
        {
          label: "表单删除",
          value: "teamId:appId:form02:FD",
          checked: false
        },
        {
          label: "审批流增加",
          value: "teamId:appId:form02:AC",
          checked: false
        },
        {
          label: "审批流编辑",
          value: "teamId:appId:form02:AU",
          checked: false
        },
        {
          label: "审批流删除",
          value: "teamId:appId:form02:AD",
          checked: false
        },
        {
          label: "审批流元数据启用",
          value: "teamId:appId:form02:AE",
          checked: false
        },
        {
          label: "自动化流程增加",
          value: "teamId:appId:form02:ATC",
          checked: false
        },
        {
          label: "自动化流程编辑",
          value: "teamId:appId:form02:ATU",
          checked: false
        },
        {
          label: "自动化流程删除",
          value: "teamId:appId:form02:ATD",
          checked: false
        },
        {
          label: "自动化流程启用",
          value: "teamId:appId:form02:ATE",
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
          label: "是否可见",
          value: "teamId:appId::form01:RR",
          checked: false
        },
        {
          label: "表单查看自己",
          value: "teamId:appId::form01:u#owner:R",
          checked: false
        },
        {
          label: "表单增加",
          value: "teamId:appId::form01:C",
          checked: false
        },
        {
          label: "表单编辑自己",
          value: "teamId:appId::form01:u#owner:E",
          checked: false
        },
        {
          label: "表单删除",
          value: "teamId:appId::form01:D",
          checked: false
        },
        {
          label: "表单查看所有",
          value: "teamId:appId::form01:R",
          checked: false
        },
        {
          label: "表单编辑所有",
          value: "teamId:appId::form01:UA",
          checked: false
        },
        {
          label: "表单删除所有",
          value: "teamId:appId::form01:DA",
          checked: false
        },
        {
          label: "自动化流程查看自己",
          value: "teamId:appId::form01:u#owner:R",
          checked: false
        },
        {
          label: "自动化流程查看所有",
          value: "teamId:appId::form01:RA",
          checked: false
        }
      ]
    },
    {
      formId: "form02",
      dataPermissions: [
        {
          label: "是否可见",
          value: "teamId:appId::form02:RR",
          checked: false
        },
        {
          label: "表单查看自己",
          value: "teamId:appId::form02:u#owner:R",
          checked: false
        },
        {
          label: "表单增加",
          value: "teamId:appId::form02:C",
          checked: false
        },
        {
          label: "表单编辑自己",
          value: "teamId:appId::form02:u#owner:E",
          checked: false
        },
        {
          label: "表单删除",
          value: "teamId:appId::form02:D",
          checked: false
        },
        {
          label: "表单查看所有",
          value: "teamId:appId::form02:R",
          checked: false
        },
        {
          label: "表单编辑所有",
          value: "teamId:appId::form02:UA",
          checked: false
        },
        {
          label: "表单删除所有",
          value: "teamId:appId::form02:DA",
          checked: false
        },
        {
          label: "自动化流程查看自己",
          value: "teamId:appId::form02:u#owner:R",
          checked: false
        },
        {
          label: "自动化流程查看所有",
          value: "teamId:appId::form02:RA",
          checked: false
        }
      ]
    }
  ]
};

const Top = () => {
  return (
    <div className={Styles.top}>
      <div className={Styles.back}>
        <span>
          <Icon type="arrow-left" />
        </span>
        <span>应用权限设置</span>
      </div>
      <div className={Styles.btn}>
        <Button>取消</Button>
        <Button>保存</Button>
      </div>
    </div>
  );
};

const MeteDataPermission = ({ appSetting, createForm, formPermissions }) => {
  const thunkSetting = data => {
    return (
      <div>
        <span>
          {data.label}
          <Checkbox
            defaultChecked={data.checked}
            checked={data.checked}
            onChange={() => console.log(data.value, data.checked)}
          />
        </span>
      </div>
    );
  };
  const table = (formId, data) => {
    const F = data.filter(d => d.value.split(`${formId}:F`)[1]);
    const As = data.filter(d => d.value.split(`${formId}:F`)[1]);
    const A = As.filter(d => !d.value.split(`${formId}:AT`)[1]);
    const AT = As.filter(d => d.value.split(`${formId}:AT`)[1]);
    return (
      <table>
        <thead>
          <tr>
            {formMeteDataThead.map(f => (
              <th key={f.key}>{f.value}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {formMeteDataThead.map(f => {
              const td = data.filter(d =>
                console.log(
                  d.value,
                  `${formId}:F${f.key}`,
                  d.value.split(`${formId}:F${f.key}`)
                )
              );
              if (f.key === "T") return <td>表单</td>;
              console.log(td);
              return (
                <td key={f.key}>
                  {/* {td ? (
                    <Checkbox
                      defaultChecked={td[0].checked}
                      checked={td[0].checked}
                      onChange={() => console.log(td[0].value, td[0].checked)}
                    />
                  ) : null} */}
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    );
  };
  const thunkForm = data => {
    return (
      <>
        {data.map(form => {
          const display = form.formDetailPermissions.filter(
            f => f.value.split(`${form.formId}`)[1] === ":RR"
          );
          return (
            <div key={form.formId}>
              <div>
                <span>表单: {form.formId}</span>
              </div>
              <div>
                <span>
                  {display && display[0].label}
                  <Checkbox
                    defaultChecked={data.checked}
                    checked={data.checked}
                    onChange={() => console.log(data.value, data.checked)}
                  />
                </span>
              </div>
              <div>{table(form.formId, form.formDetailPermissions)}</div>
            </div>
          );
        })}
      </>
    );
  };
  return (
    <div className={Styles.meteData}>
      <div>
        <h5>元数据权限</h5>
      </div>
      {appSetting && thunkSetting(appSetting)}
      {createForm && thunkSetting(createForm)}
      {formPermissions && thunkForm(formPermissions)}
    </div>
  );
};

export default function ApplyPermissionSetting() {
  console.log(state);
  const { appSetting, createForm, formPermissions, dataPermissions } = state;

  return (
    <>
      <div className={Styles.apsLayout}>
        <div className={Styles.aps}>
          <Top />
          <MeteDataPermission
            appSetting={appSetting}
            createForm={createForm}
            formPermissions={formPermissions}
          />
        </div>
      </div>
    </>
  );
}
