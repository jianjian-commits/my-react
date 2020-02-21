import React, { useState } from "react";
import { Button, Icon, Form, Checkbox } from "antd";
import settingStyles from "./user.module.scss";

const newinitState = {
  meteData: {
    title: "元数据权限",
    settingButton: [
      {
        key: "visibleSettingButton",
        value: {
          itemName: "visibleSettingButton",
          text: "是否显示应用设置按钮",
          options: {
            rules: []
          },
          checked: true
        }
      },
      {
        key: "allowGenerateForm",
        value: {
          itemName: "allowGenerateForm",
          text: "允许新建表单",
          options: {
            rules: []
          },
          checked: false
        }
      }
    ],
    tables: [
      {
        name: "车辆管理",
        display: {
          key: "display",
          value: {
            itemName: "display_meteData",
            text: "是否可见",
            options: {},
            checked: false
          }
        },
        table: {
          tableThKey: [
            { key: "category", value: "类别" },
            { key: "add", value: "添加" },
            { key: "redit", value: "编辑" },
            { key: "delete", value: "删除" },
            { key: "enable", value: "禁用/启用" }
          ],
          tableDate: [
            {
              key: "form",
              value: [
                { label: "表单元数据", value: null, checked: false },
                { label: null, value: null, checked: null },
                { label: null, value: "redit_meteData_form", checked: true },
                { label: null, value: "delete_meteDataForm", checked: false },
                { label: null, value: null, checked: null }
              ]
            },
            {
              key: "ap",
              value: [
                { label: "审批流源数据", value: null, checked: null },
                { label: null, value: "add_meteData_ap", checked: false },
                { label: null, value: "redit_meteData_ap", checked: false },
                { label: null, value: "delete_meteData_ap", checked: false },
                { label: null, value: "enable_meteData_ap", checked: false }
              ]
            },
            {
              key: "pb",
              value: [
                { label: "自动化流程元数据", value: null, checked: null },
                { label: null, value: "add_meteData_pb", checked: true },
                { label: null, value: "redit_meteData_pb", checked: true },
                { label: null, value: "delete_meteData_pb", checked: false },
                { label: null, value: "enable_meteData_pb", checked: true }
              ]
            }
          ]
        }
      },
      {
        name: "车辆年检记录",
        display: {
          key: "display",
          value: {
            itemName: "display_meteData",
            text: "是否可见",
            options: {},
            checked: false
          }
        },
        table: {}
      }
    ]
  },
  data: {
    title: "数据权限",
    tables: [
      {
        name: "车辆管理",
        display: {
          key: "display",
          value: {
            itemName: "display_data",
            text: "是否可见",
            options: {},
            checked: false
          }
        },
        table: {
          tableThKey: [
            { key: "", value: "类别" },
            { key: "", value: "查看自己" },
            { key: "", value: "编辑自己" },
            { key: "", value: "删除" },
            { key: "", value: "查看所有" },
            { key: "", value: "编辑所有" },
            { key: "", value: "删除所有后" }
          ],
          tableDate: [
            {
              key: "form",
              value: [
                { label: "表单元数据", value: null, checked: null },
                { label: null, value: "searchOwn_data_form", checked: true },
                { label: null, value: "reditOwn_data_form", checked: true },
                { label: null, value: "delete_data_form", checked: false },
                { label: null, value: "searchAll_data_form", checked: true },
                { label: null, value: "reditAll_data_form", checked: true },
                {
                  label: null,
                  value: "deleteAllAfter_data_form",
                  checked: true
                }
              ]
            },
            {
              key: "pb",
              value: [
                { label: "自动化流程元数据", value: null, checked: null },
                { label: null, value: "searchOwn_data_pb", checked: true },
                { label: null, value: null, checked: null },
                { label: null, value: null, checked: null },
                { label: null, value: "searchAll_data__pb", checked: true },
                { label: null, value: null, checked: null },
                { label: null, value: null, checked: null }
              ]
            }
          ]
        }
      },
      {
        name: "车辆年检记录",
        display: {
          key: "display",
          value: {
            itemName: "display_data",
            text: "是否可见",
            options: {},
            checked: false
          }
        },
        table: {}
      }
    ]
  }
};

export default Form.create({ name: "apply_permission_settings" })(
  function PermissionSetting({ form }) {
    const { getFieldDecorator, getFieldValue, setFieldsValue } = form;
    const [state, setState] = useState(newinitState);
    const { meteData, data } = state;

    const updateState = (type, value) => {};

    const decoratorField = ({ itemName, options, checked }, type) => {
      return (
        <>
          {getFieldDecorator(itemName, {
            ...options
          })(
            <span>
              <Checkbox
                checked={!!getFieldValue(itemName) || checked}
                defaultChecked={checked}
                onChange={e => {
                  console.log(e);
                  console.log(itemName, e.target.checked);
                }}
              />
            </span>
          )}
        </>
      );
    };

    const applyThunk = items => {
      const { title, settingButton, tables } = items;
      return (
        <>
          <div>
            <div style={{ margin: "5px 0" }}>
              <span>{title}</span>
            </div>
            <div>
              {settingButton &&
                settingButton.map(s => (
                  <React.Fragment key={s.key}>
                    <Form.Item>
                      {s.value.text}&nbsp;&nbsp;&nbsp;&nbsp;
                      {decoratorField(s.value, s.key)}
                    </Form.Item>
                    <hr />
                  </React.Fragment>
                ))}
            </div>
            <div>
              {tables &&
                tables.map((t, index) => {
                  const { name, display, table } = t;
                  const { tableThKey, tableDate } = table;
                  return (
                    <React.Fragment key={index}>
                      <div>
                        <span>表单: &nbsp;&nbsp;{name}</span>
                      </div>
                      <div>
                        {display.value.text}&nbsp;&nbsp;&nbsp;&nbsp;
                        {decoratorField(display.value, display.key)}
                      </div>
                      {tableThKey && tableDate && (
                        <div>
                          <table>
                            <thead>
                              <tr>
                                {tableThKey.map(t => (
                                  <th key={t.value}>{t.value}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {tableDate.map(t => {
                                return (
                                  <tr key={t.key}>
                                    {t.value.map((v, index) => (
                                      <td key={index}>
                                        {v.label && <span>{v.label}</span>}
                                        {v.value &&
                                          decoratorField(
                                            {
                                              itemName: v.value,
                                              checked: v.checked
                                            },
                                            v.value
                                          )}
                                        {!v.label && !v.value && <span></span>}
                                      </td>
                                    ))}
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                          {tables.length !== index + 1 && <hr />}
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
            </div>
          </div>
        </>
      );
    };

    const settingTitle = (
      <>
        <div className={settingStyles.title}>
          <div className={settingStyles.panel}>
            <div>
              <span>
                <Icon type="arrow-left" />
              </span>
              <span>应用权限设置</span>
            </div>
            <div style={{ display: "flex" }}>
              <div>
                <Button>取消</Button>
              </div>
              <div style={{ margin: "0 0 0 10px" }}>
                <Button onClick={e => handleSubmit(e)}>确认</Button>
              </div>
            </div>
          </div>
        </div>
      </>
    );

    const handleSubmit = e => {
      e.preventDefault();
      const nnprocessedData = getFieldValue();
    };
    return (
      <>
        <Form className={settingStyles.setting}>
          {settingTitle}
          {applyThunk(meteData)}
          {applyThunk(data)}
        </Form>
      </>
    );
  }
);
