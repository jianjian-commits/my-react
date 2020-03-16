import React, { Component } from "react";
import { connect } from "react-redux";

import { Icon, Button, message, Checkbox } from "antd";
import classes from "./profile.module.scss";
import request from "../../utils/request";
import { getBasicInfo, getAppManage, getOtherManage } from "./DetailModule";

class GroupDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      baseInfoBo: {},
      appManagerBos: [],
      teamVisible: {},
      permissions: {},
      setting: {},
      edit: false
    };
    this.action = props.action;
    this.roleId = props.roleId;
    this.oldPermissionAllTrue = [];
    this.oldAppAllTrue = [];
    this.oldTeamVisibleTrue = [];
    this.onChange = this.onChange.bind(this);
    this.inputEdit = this.inputEdit.bind(this);
  }

  componentDidMount() {
    this.getDetail();
  }

  // 获取被选中的选项值value
  getTrueValue(state, type) {
    const result = [];
    switch (type) {
      case "permissions":
        for (let key in state) {
          state[key]
            .filter(item => item.checked)
            .map(v => result.push(v.value));
        }
        return result;
      case "appManagerBos":
        state.filter(item => item.checked).map(v => result.push(v.value));
        return result;
      case "teamVisible":
        state.checked && result.push(state.value);
        return result;
      default:
        return result;
    }
  }

  // 获取查看详情/编辑详情
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
        // 获取数据库中为true的value组成的数组
        this.oldPermissionAllTrue = this.getTrueValue(
          this.state.permissions,
          "permissions"
        );
        this.oldAppAllTrue = this.getTrueValue(
          this.state.appManagerBos,
          "appManagerBos"
        );
        this.oldTeamVisibleTrue = this.getTrueValue(
          this.state.teamVisible,
          "teamVisible"
        );
      } else {
        message.error("获取详情失败");
      }
    } catch (err) {
      message.error("获取详情失败");
    }
  }

  // 通过用户操作修改state
  onChange(state, type) {
    if (type === "getBasicInfo") {
      this.setState({
        baseInfoBo: {
          ...this.state.baseInfoBo,
          roleName: state
        }
      });
    }
    if (type === "getAppManage") {
      const { checkedValue, appId } = state;
      this.setState({
        appManagerBos: this.state.appManagerBos.map(item => {
          if (item.appId === appId) {
            return {
              ...item,
              checked: checkedValue
            };
          }
          return item;
        })
      });
    }
    if (type === "getOtherManage") {
      const { checkedValue, key } = state;
      const clickLine = this.state.permissions[key];
      this.setState({
        permissions: {
          ...this.state.permissions,
          [key]: clickLine.map(item => ({
            ...item,
            checked: checkedValue.includes(item.value)
          }))
        }
      });
    }
  }

  inputEdit(edit) {
    this.setState({
      edit
    });
  }

  async handleDetail() {
    // 此刻所有被选中的选项值
    const permissionAllTrue = this.getTrueValue(
      this.state.permissions,
      "permissions"
    );
    const permissionTrueToFalse = this.oldPermissionAllTrue.filter(
      item => !permissionAllTrue.includes(item)
    );
    const appAllTrue = this.getTrueValue(
      this.state.appManagerBos,
      "appManagerBos"
    );
    const appTrueToFalse = this.oldAppAllTrue.filter(
      item => !appAllTrue.includes(item)
    );
    const teamVisibleTrue = this.getTrueValue(
      this.state.teamVisible,
      "teamVisible"
    );
    const teamVisibleTrueToFalse = this.oldTeamVisibleTrue.filter(
      item => !teamVisibleTrue.includes(item)
    );

    // 传给后台的data数据
    let data = {
      roleId: this.roleId,
      roleName: this.state.baseInfoBo.roleName,
      appAllTrue,
      appTrueToFalse,
      permissionAllTrue: [...permissionAllTrue, ...teamVisibleTrue],
      permissionTrueToFalse: [
        ...permissionTrueToFalse,
        ...teamVisibleTrueToFalse
      ],
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

  render() {
    // 获取是查看还是编辑行为
    const action = this.action;
    const { enterDetail, enterPermission } = this.props;
    const { baseInfoBo, permissions, appManagerBos, edit } = this.state;

    return (
      <>
        <Icon type="arrow-left" onClick={() => enterDetail(false)} />
        <span style={{ textIndent: "10px" }}>分组</span>
        {action === "edit" && (
          <>
            <Button
              type="primary"
              onClick={() => this.handleDetail()}
              style={{ color: "#fff" }}
            >
              保存
            </Button>
            <Button onClick={() => enterDetail(false)}>取消</Button>
          </>
        )}
        {getBasicInfo(action, baseInfoBo, this.onChange, edit, this.inputEdit)}
        {getAppManage(action, appManagerBos, this.onChange, enterPermission)}
        <div>
          <span className={classes.moduleTitle}>
            {this.state.teamVisible.label}
          </span>
          <Checkbox
            disabled={action === "view"}
            checked={this.state.teamVisible.checked}
            onChange={e => {
              this.setState({
                teamVisible: {
                  ...this.state.teamVisible,
                  checked: e.target.checked
                }
              });
            }}
          ></Checkbox>
        </div>
        {this.state.teamVisible.checked &&
          getOtherManage(action, permissions, this.onChange)}
        {/* {getSetting(action, setting)} */}
      </>
    );
  }
}
export default connect(({ login }) => ({
  teamId: login.currentTeam.id,
  userId: login.userDetail.id
}))(GroupDetail);
