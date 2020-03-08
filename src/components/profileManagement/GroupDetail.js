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
      setting: {}
    };
    this.action = props.action;
    this.roleId = props.roleId;
    this.oldPermissionAllTrue = [];
    this.oldAppAllTrue = [];
    this.oldTeamVisibleTrue = [];
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    // 获取分组详情
    this.getDetail();
  }

  // 获取查看详情/编辑详情
  async getDetail() {
    const data = {
      userId: this.props.userId,
      roleId: this.roleId
    };
    try {
      const res = await request(`/sysRole/detail/${this.roleId}`, {
        method: "POST",
        data
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
        // 获取数据库中（其他管理)被选中的选项值value
        this.oldPermissionAllTrue = this.getTrueValue(
          this.state.permissions,
          "permissions"
        );
        this.oldAppAllTrue = this.getTrueValue(
          this.state.appManagerBos,
          "appManagerBos"
        );
        // 团队按钮旧数据被选中，如果被选中就返回value，否则为[]
        this.state.teamVisible.checked &&
          this.oldTeamVisibleTrue.push(this.state.teamVisible.value);
      }
    } catch (err) {
      message.error("获取详情失败");
    }
  }

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

  // 获取（其他管理)被选中的选项值value
  getTrueValue(state, type) {
    const result = [];
    if (type === "permissions") {
      for (let key in state) {
        state[key].forEach(item => {
          if (item.checked) {
            result.push(item.value);
          }
        });
      }
      return result;
    }
    if (type === "appManagerBos") {
      state.forEach(item => {
        if (item.checked) {
          result.push(item.value);
        }
      });
      return result;
    }
  }

  // 保存
  async handleDetail() {
    // 其他管理（此刻所有被选中的选项值)
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

    const teamVisibleTrue = [];
    this.state.teamVisible.checked &&
      teamVisibleTrue.push(this.state.teamVisible.value);
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
        this.props.enterDetail(false);
      }
    } catch (err) {
      message.error("保存失败！");
    }
  }

  render() {
    // 获取是查看还是编辑行为
    const action = this.action;
    const { enterDetail } = this.props;
    const { baseInfoBo, permissions, appManagerBos } = this.state;

    return (
      <div className={classes.groupContainer}>
        <div className={classes.groupHeader}>
          <Icon type="arrow-left" onClick={() => enterDetail(false)} />
          <span>分组</span>
          {action === "edit" && (
            <>
              <Button type="primary" onClick={() => this.handleDetail()}>
                保存
              </Button>
              <Button onClick={() => enterDetail(false)}>取消</Button>
            </>
          )}
        </div>
        {getBasicInfo(action, baseInfoBo, this.onChange)}
        {getAppManage(
          action,
          appManagerBos,
          this.onChange,
          this.props.enterPermission
        )}
        <p>
          团队管理信息可见
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
        </p>
        {this.state.teamVisible.checked &&
          getOtherManage(action, permissions, this.onChange)}
        {/* {getSetting(action, setting)} */}
      </div>
    );
  }
}
export default connect(({ login }) => ({
  teamId: login.currentTeam.id,
  userId: login.userDetail.id
}))(GroupDetail);
