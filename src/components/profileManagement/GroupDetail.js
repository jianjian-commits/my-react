import React, { Component } from "react";
import { connect } from "react-redux";

import { Icon, Button, message } from "antd";
import classes from "./profile.module.scss";
import request from "../../utils/request";
import { getBasicInfo, getAppManage, getOtherManage } from "./DetailModule";

class GroupDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      baseInfoBo: {},
      appManagerBos: [],
      permissions: {},
      setting: {}
    };
    this.action = props.action;
    this.groupId = props.groupId;
    this.oldPermissionAllTrue = [];
    this.oldAppAllTrue = [];
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
      roleId: this.groupId
    };
    try {
      const res = await request("/sysRole/detail", {
        method: "POST",
        data
      });
      if (res && res.status === "SUCCESS") {
        const {
          baseInfoBo,
          appManagerBos,
          permissions,
          sessionTime,
          passwordMinLength,
          passwordDiffer
        } = res.data;
        this.setState({
          baseInfoBo,
          appManagerBos,
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
          groupName: state
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
    // 获取选中后被取消
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

    // 传给后台的data数据
    let data = {
      groupId: this.groupId,
      groupName: this.state.baseInfoBo.groupName,
      permissionAllTrue: [...permissionAllTrue, ...appAllTrue],
      permissionTrueToFalse: [...permissionTrueToFalse, ...appTrueToFalse],
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
          this.props.teamId,
          this.props.enterPermission
        )}
        {getOtherManage(action, permissions, this.onChange)}
        {/* {getSetting(action, setting)} */}
      </div>
    );
  }
}
export default connect(({ login }) => ({
  teamId: login.currentTeam.id,
  userId: login.userDetail.id
}))(GroupDetail);
