import React, { useState } from "react";
import { connect } from "react-redux";
import { Input, Row, Col, List, Button, Spin, message } from "antd";
import request from "../../../utils/request";
import classes from "./team.module.scss";
import { getCurrentTeam, getAllTeam } from "../../../store/loginReducer";

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

  return (
    <div className={classes.rowBox}>
      {isRedact ? (
        <Row type="flex" align="middle">
          <Col span={10}>{lable}</Col>
          <Col span={14}>
            <Input
              defaultValue={defaultValue}
              onChange={changeValue}
              style={{ width: "auto" }}
            />
            <Button type="link" onClick={submitAmend}>
              确认
            </Button>
            <Button type="link" onClick={switchRedact}>
              取消
            </Button>
          </Col>
        </Row>
      ) : (
        <Row type="flex" align="middle">
          <Col span={10}>{lable}</Col>
          <Col span={14}>
            {defaultValue}
            <Button type="link" icon="form" onClick={switchRedact}></Button>
          </Col>
        </Row>
      )}
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
        message.success("修改成功");
        getCurrentTeam().then(res => {
          if (key === "name") {
            getAllTeam();
          }
        });
      })
      .catch(err => {
        message.error("修改失败");
      });
  };

  return currentTeam ? (
    <div className={classes.container}>
      <div className={classes.title}>团队信息</div>
      <div className={classes.listBox}>
        <List itemLayout="horizontal" split={false}>
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
                <Col span={10}>创建人</Col>
                <Col span={14}>{currentTeam.sysUserName}</Col>
              </Row>
            </div>
          </List.Item>
          <List.Item>
            <div className={classes.rowBox}>
              <Row>
                <Col span={10}>创建时间</Col>
                <Col span={14}>
                  {new Date(currentTeam.createDate).toLocaleString()}
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
