import React, { useState } from "react";
import { connect } from "react-redux";
import { Input, Row, Col, List, Typography, Button, Spin, message } from "antd";
import request from "../../../utils/request";
import classes from "./team.module.scss";
import { getCurrentTeam, getAllTeam } from "../../../store/loginReducer";

const { Title } = Typography;

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
    <div>
      {isRedact ? (
        <Row type="flex" gutter={5} align="middle">
          <Col>{lable}:</Col>
          <Col>
            <Row type="flex" gutter={5} align="middle">
              <Col>
                <Input defaultValue={defaultValue} onChange={changeValue} />
              </Col>
              <Col>
                <Button type="link" onClick={submitAmend}>
                  确认
                </Button>
              </Col>
              <Col>
                <Button type="link" onClick={switchRedact}>
                  取消
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      ) : (
        <Row type="flex" gutter={16} align="middle">
          <Col>{lable}:</Col>
          <Col>{defaultValue}</Col>
          <Col>
            <Button type="link" onClick={switchRedact}>
              修改
            </Button>
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
      <Title level={3}>团队信息</Title>
      <List itemLayout="horizontal">
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
          <Row type="flex" gutter={16}>
            <Col>创建人:</Col>
            <Col>{currentTeam.sysUserName}</Col>
          </Row>
        </List.Item>
        <List.Item>
          <Row type="flex" gutter={16}>
            <Col>创建时间:</Col>
            <Col>{new Date(currentTeam.createDate).toLocaleString()}</Col>
          </Row>
        </List.Item>
      </List>
    </div>
  ) : (
    <Spin size="large" />
  );
});
