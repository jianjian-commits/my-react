import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Input, Row, Col, List, Typography, Button, Spin } from "antd";
import request from "../../utils/request";
import classes from "./team.module.scss";

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
    key: "creator",
    lable: "创建人",
    value: ""
  },
  {
    key: "createDate",
    lable: "创建时间",
    value: ""
  }
];

const EditInput = props => {
  const { obj, teamId } = props;
  const [dataStr, setDataStr] = useState(obj.value);
  const [redact, setRedact] = useState(false);
  const [changeStr, setChangeStr] = useState(obj.value);
  const onClickAmend = e => {
    setRedact(!redact);
  };
  const submitAmend = (key, e) => {
    infoData.forEach(item => {
      if (key === item.key) {
        item.value = dataStr;
      }
    });
    setChangeStr(dataStr);
    onClickAmend();
  };
  const changeValue = e => {
    setDataStr(e.target.value);
  };
  useEffect(() => {
    const upData = async () => {
      const params = {
        method: "PUT",
        data: {}
      };
      params.data[obj.key] = changeStr;
      const result = await request(`/team/${teamId}`, params);
    };
    upData();
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
                <Button type="link" onClick={submitAmend.bind(this, obj.key)}>
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
            <Button type="link" onClick={onClickAmend}>
              修改
            </Button>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default connect(({ login }) => ({
  loginData: login
}))(function TeamInfo({ loginData }) {
  const [teamId, setTeamId] = React.useState(loginData.currentTeam.id);
  const [data, setData] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      const res = await request(`/team/${teamId}`);
      const creator = await request(`/sysUser/${res.data.ownerId}`);
      const newData = infoData.map(item => {
        Object.keys(res.data).forEach(i => {
          if (item.key === i) {
            item.value = res.data[i];
          } else if (item.key === "creator") {
            item.value = creator.data.name;
          }
        });
        return item;
      });
      setData(newData);
    };
    fetchData();
  }, []);
  return data ? (
    <div className={classes.container}>
      <Title level={3}>团队信息</Title>
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={item => (
          <List.Item>
            {item.key === "name" || item.key === "description" ? (
              <EditInput obj={item} teamId={teamId} />
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
