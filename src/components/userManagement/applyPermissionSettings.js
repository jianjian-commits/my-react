import React, { useState } from "react";
import { Button, Icon, Form, Checkbox } from "antd";
import settingStyles from "./user.module.scss";

const initState = {
  setting: [
    {
      itemName: "visibleSettingButton",
      text: "是否显示应用设置按钮",
      options: {
        rules: []
      },
      checked: true
    },
    {
      itemName: "allowGenerateForm",
      text: "允许新建表单",
      options: {
        rules: []
      },
      checked: false
    }
  ],
  table: {
    meteData: [
      {
        name: "车辆管理",
        tableThKey: ["类别", "添加", "编辑", "删除", "禁用/启用"],
        tableMeteDate: [
          [
            { label: "表单元数据", value: null, checked: false },
            { label: null, value: null, checked: null },
            { label: null, value: "redit_meteData_form", checked: true },
            { label: null, value: "delete_meteDataForm", checked: false },
            { label: null, value: null, checked: null }
          ],
          [
            { label: "审批流源数据", value: null, checked: null },
            { label: null, value: "add_meteData_ap", checked: false },
            { label: null, value: "redit_meteData_ap", checked: false },
            { label: null, value: "delete_meteData_ap", checked: false },
            { label: null, value: "enable_meteData_ap", checked: false }
          ],
          [
            { label: "自动化流程元数据", value: null, checked: null },
            { label: null, value: "add_meteData_pb", checked: true },
            { label: null, value: "redit_meteData_pb", checked: true },
            { label: null, value: "delete_meteData_pb", checked: false },
            { label: null, value: "enable_meteData_pb", checked: true }
          ]
        ],
        checkBoxButton: {
          itemName: "display_data",
          text: "是否可见",
          options: {},
          checked: false
        }
      },
      {
        name: "车辆年检记录",
        checkBoxButton: {
          itemName: "display_data",
          text: "是否可见",
          options: {},
          checked: false
        }
      }
    ],
    data: [
      {
        name: "车辆管理",
        tableThKey: [
          "类别",
          "查看自己",
          "编辑自己",
          "删除",
          "查看所有",
          "编辑所有",
          "删除所有后"
        ],
        tableMeteDate: [
          [
            { label: "表单元数据", value: null, checked: null },
            { label: null, value: "searchOwn_data_form", checked: true },
            { label: null, value: "reditOwn_data_form", checked: true },
            { label: null, value: "delete_data_form", checked: false },
            { label: null, value: "searchAll_data_form", checked: true },
            { label: null, value: "reditAll_data_form", checked: true },
            { label: null, value: "deleteAllAfter_data_form", checked: true }
          ],
          [
            { label: "自动化流程元数据", value: null, checked: null },
            { label: null, value: "searchOwn_data_pb", checked: true },
            { label: null, value: null, checked: null },
            { label: null, value: null, checked: null },
            { label: null, value: "searchAll_data__pb", checked: true },
            { label: null, value: null, checked: null },
            { label: null, value: null, checked: null }
          ]
        ],
        checkBoxButton: {
          itemName: "display_meteData",
          text: "是否可见",
          options: {},
          checked: false
        }
      },
      {
        name: "车辆年检记录",
        checkBoxButton: {
          itemName: "display_meteData",
          text: "是否可见",
          options: {},
          checked: false
        }
      }
    ]
  }
};

export default Form.create({ name: "apply_permission_settings" })(
  function PermissionSetting(props) {
    const [state, setState] = useState(initState);
    const { setting, table } = state;
    const { meteData, data } = table;
    const { form } = props;
    const { getFieldDecorator, getFieldValue } = form;

    // const updateState = (type, itemName, value) => {
    //   if (type === "setting") {
    //     const item = setting.map(s => {
    //       if (s.itemName === itemName) return (s.checked = value);
    //       return s;
    //     });
    //     item.checked = value;
    //     updateState({ setting: item, table });
    //   }
    //   setState(initState);
    // };

    const checkBoxComponent = ({ itemName, text, options, checked }, type) => {
      return {
        itemName: itemName,
        options: {
          ...options,
          initialValue: checked
        },
        component: (
          <span>
            {text}
            {text && <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>}
            <Checkbox
              checked={!!getFieldValue(itemName) || checked}
              defaultChecked={checked}
              onChange={e => {
                setState();
                // updateState(type, itemName, !checked)
              }}
            />
          </span>
        ),
        additionComponent: null
      };
    };

    const tableThunk = (item, type) => {
      return (
        <div className={settingStyles.thunk}>
          {item.map((t, index) => {
            const name = t.name;
            const { tableMeteDate, tableThKey, checkBoxButton } = t;
            const itemName = `${checkBoxButton.itemName}_${name}`;
            const display = checkBoxComponent(
              {
                ...checkBoxButton,
                itemName: itemName
              },
              type
            );
            return (
              <div key={index}>
                <div style={{ margin: "10px 0" }}>表单: {name}</div>
                {getFieldDecorator(display.itemName, {
                  ...display.options
                })(display.component)}
                {display.additionComponent}
                {tableMeteDate && tableThKey && (
                  <table className={settingStyles.table}>
                    <thead>
                      <tr>
                        {tableThKey.map(h => (
                          <th key={h}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tableMeteDate.map((t, index) => {
                        return (
                          <tr key={index}>
                            {t.map((d, index) => {
                              const itemName = `${d.value}_${name}`;
                              const defaultData = () => ({
                                ...d,
                                itemName: itemName
                              });
                              const data = d.value
                                ? checkBoxComponent(defaultData())
                                : null;
                              const item = d.label ? (
                                d.label
                              ) : data ? (
                                <Form.Item
                                  style={{
                                    margin: "auto 0"
                                  }}
                                >
                                  {getFieldDecorator(data.itemName, {
                                    ...data.options
                                  })(data.component)}
                                  {data.additionComponent}
                                </Form.Item>
                              ) : (
                                <span></span>
                              );
                              return <td key={index}>{item}</td>;
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
                {item.length !== index + 1 && <hr />}
              </div>
            );
          })}
        </div>
      );
    };

    const DataPermission = () => {
      return (
        <>
          <div className={settingStyles.metedate}>
            <div style={{ margin: "5px 0" }}>
              <span>数据权限</span>
            </div>
          </div>
          {tableThunk(data, "data")}
        </>
      );
    };
    const MetedataPermissions = () => {
      return (
        <>
          <div className={settingStyles.metedate}>
            <div style={{ margin: "5px 0" }}>
              <span>元数据权限</span>
            </div>
            <div className={settingStyles.thunk}>
              {setting.map(s => {
                const settingFormData = checkBoxComponent(s, "setting");
                return (
                  <React.Fragment key={settingFormData.itemName}>
                    <div>
                      <Form.Item style={{ margin: "0" }}>
                        {getFieldDecorator(settingFormData.itemName, {
                          ...settingFormData.options
                        })(settingFormData.component)}
                        {settingFormData.additionComponent}
                      </Form.Item>
                    </div>
                    <hr />
                  </React.Fragment>
                );
              })}
            </div>
            {tableThunk(meteData, "meteData")}
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
      console.log(nnprocessedData);
    };
    return (
      <>
        <Form className={settingStyles.setting}>
          {settingTitle}
          <MetedataPermissions />
          <DataPermission />
        </Form>
      </>
    );
  }
);
