import React from "react";

import { Input, Row, Col, List, Typography, Button } from "antd";

const { Title } = Typography;
const infoData = [
  {
    key: "teamName",
    lable: "团队名称",
    value: "测试团队"
  },
  {
    key: "introduce",
    lable: "团队介绍",
    value: "供测试团队使用"
  },
  {
    key: "creator",
    lable: "创建人",
    value: "Kevin"
  },
  {
    key: "creatTime",
    lable: "创建时间",
    value: new Date().toLocaleString("chinese", { hour12: false })
  }
];

const EditInput = props => {
  const { obj } = props;
  const [redact, setRedact] = React.useState(false);
  const [dataStr, setDataStr] = React.useState(obj.value);
  const onClickAmend = e => {
    setRedact(!redact);
  };
  const submitAmend = (key, e) => {
    infoData.forEach(item => {
      if (key === item.key) {
        item.value = dataStr;
      }
    });
    onClickAmend();
  };
  const changeValue = e => {
    setDataStr(e.target.value);
  };
  return (
    <div>
      {redact ? (
        <Row>
          <Col>{obj.lable}:</Col>
          <Col>
            <Input defaultValue={obj.value} onChange={changeValue} />
            <Button type="link" onClick={submitAmend.bind(this, obj.key)}>
              确认
            </Button>
            <Button type="link" onClick={onClickAmend}>
              取消
            </Button>
          </Col>
        </Row>
      ) : (
        <Row type="flex" gutter={16}>
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

const TeamInfo = () => {
  return (
    <div>
      <Title level={3}>团队信息</Title>
      <List
        bordered={true}
        itemLayout="horizontal"
        dataSource={infoData}
        renderItem={item => (
          <List.Item>
            {item.key === "teamName" || item.key === "introduce" ? (
              <EditInput obj={item} />
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
  );
};

export default TeamInfo;
