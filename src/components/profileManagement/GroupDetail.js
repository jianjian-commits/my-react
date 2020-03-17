import React, { Component } from "react";
import { connect } from "react-redux";
import request from "../../utils/request";
import { Icon, Button, message } from "antd";
import {
  BaseInfoModule,
  AppManagerModule,
  PermissionsModule
  // SettingModule
} from "./DetailModule";

const Top = ({ disabled, enterDetail, handleDetail }) => (
  <>
    <Icon type="arrow-left" onClick={() => enterDetail()} />
    <span style={{ textIndent: "10px" }}>分组</span>
    {!disabled && (
      <>
        <Button
          type="primary"
          onClick={() => handleDetail()}
          style={{ color: "#fff" }}
        >
          保存
        </Button>
        <Button onClick={() => enterDetail()}>取消</Button>
      </>
    )}
  </>
);

class GroupDetail1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      baseInfoBo: {},
      appManagerBos: [],
      permissions: {},
      settings: {},
      editable: false
    };
    this.roleId = props.roleId;
    this.oldAppAllTrue = [];
    this.oldPermissionAllTrue = [];
    this.onChange = this.onChange.bind(this);
  }
  componentDidMount() {
    this.getDetail();
  }

  async getDetail() {
    try {
      const res = await request(`/sysRole/detail/${this.roleId}`, {
        method: "POST",
        data: {
          userId: this.props.userId,
          roleId: this.roleId
        }
      });
      if (res && res.status === "SUCCESS") {
        const {
          baseInfoBo,
          appManagerBos,
          teamVisible,
          permissions,
          sessionTime,
          passwordMinLength,
          passwordDiffer
        } = res.data;
        this.setState({
          baseInfoBo,
          appManagerBos,
          teamVisible,
          permissions,
          setting: {
            sessionTime,
            passwordMinLength,
            passwordDiffer
          }
        });
        this.oldAppAllTrue = this.getTrueValue(
          this.state.appManagerBos,
          "appManagerBos"
        );
        this.oldPermissionAllTrue = this.getTrueValue(
          this.state.permissions,
          "permissions"
        );
      } else {
        message.error("获取详情失败");
      }
    } catch (err) {
      message.error("获取详情失败");
    }
  }

  getTrueValue(state, module) {
    const result = [];
    switch (module) {
      case "appManagerBos":
        state.filter(item => item.checked).map(v => result.push(v.value));
        return result;
      case "permissions":
        const { appVisible, teamVisible, teamPermission, ...rest } = state;
        teamVisible.checked && result.push(teamVisible.value);
        teamPermission.checked && result.push(teamPermission.value);
        appVisible.checked && result.push(appVisible.value);
        for (let key in rest) {
          state[key]
            .filter(item => item.checked)
            .map(v => result.push(v.value));
        }
        return result;
      default:
        return result;
    }
  }

  async handleDetail() {
    const appAllTrue = this.getTrueValue(
      this.state.appManagerBos,
      "appManagerBos"
    );
    const appTrueToFalse = this.oldAppAllTrue.filter(
      item => !appAllTrue.includes(item)
    );
    const permissionAllTrue = this.getTrueValue(
      this.state.permissions,
      "permissions"
    );
    const permissionTrueToFalse = this.oldPermissionAllTrue.filter(
      item => !permissionAllTrue.includes(item)
    );

    const data = {
      roleId: this.roleId,
      roleName: this.state.baseInfoBo.roleName,
      appAllTrue,
      appTrueToFalse,
      permissionAllTrue,
      permissionTrueToFalse,
      ...this.state.setting
    };
    try {
      const res = await request("/sysRole/save", {
        method: "PUT",
        data
      });
      if (res && res.status === "SUCCESS") {
        message.success("保存成功！");
      } else {
        message.error("保存失败！");
      }
    } catch (err) {
      message.error("保存失败！");
    } finally {
      this.props.enterDetail(false);
    }
  }

  onChange(changeValue, module) {
    if (module === "baseInfoBo") {
      this.setState({
        baseInfoBo: {
          ...this.state.baseInfoBo,
          roleName: changeValue
        }
      });
    }
    if (module === "appManagerBos") {
      const { checkedValue, appId } = changeValue;
      this.setState({
        appManagerBos: this.state.appManagerBos.map(i => {
          if (i.appId === appId) return { ...i, checked: checkedValue };
          return i;
        })
      });
    }
    if (module === "permissions_radio") {
      const { checkedValue, arrayItem } = changeValue;
      this.setState({
        permissions: {
          ...this.state.permissions,
          [arrayItem]: {
            ...this.state.permissions[arrayItem],
            checked: checkedValue
          }
        }
      });
    }
    if (module === "permissions_checkbox") {
      const { checkedValue, arrayItem, label } = changeValue;
      const clickLine = this.state.permissions[arrayItem];
      this.setState({
        permissions: {
          ...this.state.permissions,
          [arrayItem]: clickLine.map(item => {
            if (item.label === label) {
              return {
                ...item,
                checked: checkedValue
              };
            }
            return item;
          })
        }
      });
    }
  }

  render() {
    const { action, enterDetail, enterPermission } = this.props;
    const { editable, baseInfoBo, appManagerBos, permissions } = this.state;
    const disabled = action === "view" ? true : false;
    return (
      <>
        <Top
          disabled={disabled}
          enterDetail={enterDetail}
          handleDetail={this.handleDetail.bind(this)}
        />
        <BaseInfoModule
          disabled={disabled}
          baseInfoBo={baseInfoBo}
          editable={editable}
          setEditable={v => this.setState({ editable: v })}
          onChange={this.onChange}
        />
        <AppManagerModule
          disabled={disabled}
          appManagerBos={appManagerBos}
          onChange={this.onChange}
          enterPermission={enterPermission}
          permissions={permissions}
        />
        <PermissionsModule
          disabled={disabled}
          permissions={permissions}
          onChange={this.onChange}
        />
        {/* <SettingModule disabled={disabled} settings={settings} /> */}
      </>
    );
  }
}

export default connect(({ login }) => ({
  userId: login.userDetail.id
}))(GroupDetail1);
