import React, { useState } from "react";
import { connect } from "react-redux";
import { Input, Row, Col, List, Button, Spin, message, Popover } from "antd";
import request from "../../../utils/request";
import classes from "./team.module.scss";
import { getCurrentCompany, getAllCompany } from "../../../store/loginReducer";
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
  { getCurrentCompany, getAllCompany }
)(function TeamInfo({ loginData, getCurrentCompany, getAllCompany }) {
  const { currentCompany } = loginData;
  const onClickSubmit = (key, changeStr) => {
    const params = {
      method: "PUT",
      data: {}
    };
    params.data[key] = changeStr;
    request(`/company`, params)
      .then(res => {
        if (res && res.status === "SUCCESS") {
          getCurrentCompany().then(res => {
            if (key === "name") {
              getAllCompany();
            }
          });
          message.success("修改成功");
        } else {
          message.error(res.msg || "修改失败！");
        }
      })
      .catch(err => catchError(err));
  };

  return currentCompany ? (
    <div className={classes.container}>
      <div className={classes.title}>公司信息</div>
      <div className={classes.listBox}>
        <List itemLayout="horizontal" size="small">
          <List.Item>
            <EditInput
              defaultValue={currentCompany.companyName}
              onClickSubmit={onClickSubmit}
              lableKey="name"
              lable="公司名称"
            />
          </List.Item>
          <List.Item>
            <EditInput
              defaultValue={currentCompany.companyDescription}
              onClickSubmit={onClickSubmit}
              lableKey="description"
              lable="公司介绍"
            />
          </List.Item>
          <List.Item>
            <div className={classes.rowBox}>
              <Row>
                <Col span={8} className={classes.lable}>
                  创建人
                </Col>
                <Col span={16} className={classes.text}>
                  {currentCompany.sysUserName}
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
                  {new Date(currentCompany.createdDate).toLocaleString()}
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
