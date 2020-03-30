import React, { useState } from "react";
import { connect } from "react-redux";
import { Input, Row, Col, List, Button, Spin, message, Popover } from "antd";
import request from "../../../utils/request";
import classes from "./team.module.scss";
import { getCurrentTeam, getAllTeam } from "../../../store/loginReducer";
import { ReactComponent as Edit } from "../../../assets/icons/edit.svg";
import Authenticate from "../../shared/Authenticate";
import { catchError } from "../../../utils";
import { TEAM_MANAGEMENT_UPDATE_INFO } from "../../../auth";

const EditInput = ({ defaultValue, lableKey, onClickSubmit, lable }) => {
  const [isRedact, setIsRedact] = useState(false);
  const [dataStr, setDataStr] = useState(defaultValue);

  const submitAmend = () => {
    onClickSubmit(lableKey, dataStr);
    switchRedact();
  };
  const switchRedact = () => {
    setIsRedact(!isRedact);
  };

  const changeValue = e => {
    setDataStr(e.target.value);
  };

  const content = <div>{dataStr}</div>;

  return (
    <div className={classes.rowBox}>
      <Row type="flex" align="middle">
        <Col span={8} className={classes.lable}>
          {lable}
        </Col>
        {isRedact ? (
          <Col span={16} className={classes.text}>
            <Input
              defaultValue={defaultValue}
              onChange={changeValue}
              className={classes.infoInput}
            />
            <Button type="link" onClick={submitAmend}>
              确认
            </Button>
            <Button type="link" onClick={switchRedact}>
              取消
            </Button>
          </Col>
        ) : (
          <Col span={16} className={classes.text}>
            <Popover placement="bottom" content={content}>
              <span className={classes.overInfo}> {defaultValue}</span>
            </Popover>
            <Authenticate auth={TEAM_MANAGEMENT_UPDATE_INFO}>
              <Button
                size="small"
                type="link"
                className={classes.edit}
                onClick={switchRedact}
              >
                <Edit />
              </Button>
            </Authenticate>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default connect(
  ({ login }) => ({
    loginData: login
  }),
  { getCurrentTeam, getAllTeam }
)(function TeamInfo({ loginData, getCurrentTeam, getAllTeam }) {
  const { currentTeam } = loginData;
  const onClickSubmit = (key, changeStr) => {
    const params = {
      method: "PUT",
      data: {}
    };
    params.data[key] = changeStr;
    request(`/team`, params)
      .then(res => {
        if (res && res.status === "SUCCESS") {
          getCurrentTeam().then(res => {
            if (key === "name") {
              getAllTeam();
            }
          });
          message.success("修改成功");
        } else {
          message.error(res.msg || "修改失败！");
        }
      })
      .catch(err => catchError(err));
  };

  return currentTeam ? (
    <div className={classes.container}>
      <div className={classes.title}>团队信息</div>
      <div className={classes.listBox}>
        <List itemLayout="horizontal" size="small">
          <List.Item>
            <EditInput
              defaultValue={currentTeam.name}
              onClickSubmit={onClickSubmit}
              lableKey="name"
              lable="团队名称"
            />
          </List.Item>
          <List.Item>
            <EditInput
              defaultValue={currentTeam.description}
              onClickSubmit={onClickSubmit}
              lableKey="description"
              lable="团队介绍"
            />
          </List.Item>
          <List.Item>
            <div className={classes.rowBox}>
              <Row>
                <Col span={8} className={classes.lable}>
                  创建人
                </Col>
                <Col span={16} className={classes.text}>
                  {currentTeam.sysUserName}
                </Col>
              </Row>
            </div>
          </List.Item>
          <List.Item>
            <div className={classes.rowBox}>
              <Row>
                <Col span={8} className={classes.lable}>
                  创建时间
                </Col>
                <Col span={16} className={classes.text}>
                  {new Date(currentTeam.createdDate).toLocaleString()}
                </Col>
              </Row>
            </div>
          </List.Item>
        </List>
      </div>
    </div>
  ) : (
    <Spin size="large" />
  );
});
