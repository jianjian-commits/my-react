import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Input, Row, Col, List, Typography, Button, Spin } from "antd";
import request from "../../utils/request";
import classes from "./team.module.scss";
import { getCurrentTeam, getAllTeam } from "../../store/loginReducer";

const { Title } = Typography;
const infoData = [
  {
    key: "name",
    lable: "团队名称",
    value: ""
  },
  {
    key: "description",
    lable: "团队介绍",
    value: ""
  },
  {
    key: "sysUserName",
    lable: "创建人",
    value: ""
  },
  {
    key: "createDate",
    lable: "创建时间",
    value: ""
  }
];

const EditInput = ({ obj, getCurrentTeam, getAllTeam }) => {
  const [dataStr, setDataStr] = useState(obj.value);
  const [redact, setRedact] = useState(false);
  const [changeStr, setChangeStr] = useState(obj.value);
  const onClickAmend = e => {
    setRedact(false);
  };
  const submitAmend = () => {
    setChangeStr(dataStr);
  };
  const changeValue = e => {
    setDataStr(e.target.value);
  };

  const upData = async () => {
    const params = {
      method: "PUT",
      data: {}
    };
    params.data[obj.key] = changeStr;
    await request(`/team`, params);
  };
  useEffect(() => {
    upData().then((res, { key } = obj) => {
      getCurrentTeam().then(res => {
        if (key === "name") {
          getAllTeam();
        }
        onClickAmend();
      });
    });
  }, [changeStr]);
  return (
    <div>
      {redact ? (
        <Row type="flex" gutter={5} align="middle">
          <Col>{obj.lable}:</Col>
          <Col>
            <Row type="flex" gutter={5} align="middle">
              <Col>
                <Input defaultValue={obj.value} onChange={changeValue} />
              </Col>
              <Col>
                <Button type="link" onClick={submitAmend}>
                  确认
                </Button>
              </Col>
              <Col>
                <Button type="link" onClick={onClickAmend}>
                  取消
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      ) : (
        <Row type="flex" gutter={16} align="middle">
          <Col>{obj.lable}:</Col>
          <Col>{obj.value}</Col>
          <Col>
            <Button type="link" onClick={setRedact.bind(true)}>
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
  const [data, setData] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      const res = loginData.currentTeam;
      const createDate = new Date(res.createDate).toLocaleString();
      const newData = infoData.map(item => {
        Object.keys(res).forEach(i => {
          if (item.key === i) {
            if (i === "createDate") {
              item.value = createDate;
            } else {
              item.value = res[i];
            }
          }
        });
        return item;
      });
      setData(newData);
    };
    fetchData();
  }, [loginData.currentTeam]);
  return data ? (
    <div className={classes.container}>
      <Title level={3}>团队信息</Title>
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={item => (
          <List.Item>
            {item.key === "name" || item.key === "description" ? (
              <EditInput
                obj={item}
                getAllTeam={getAllTeam}
                getCurrentTeam={getCurrentTeam}
              />
            ) : (
              <Row type="flex" gutter={16}>
                <Col>{item.lable}:</Col>
                <Col>{item.value}</Col>
              </Row>
            )}
          </List.Item>
        )}
      />
    </div>
  ) : (
    <Spin size="large" />
  );
});
