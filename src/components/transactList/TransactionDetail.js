import React from "react";
import { Button, Row, Col, List, Table, Typography } from "antd";
import { useHistory } from "react-router-dom";

import clasess from "./transactionDetail.module.scss";

const { Title } = Typography;
const fields = [
  {
    key: "name",
    lable: "姓名",
    value: "王唯一"
  },
  {
    key: "phone",
    lable: "联系方式",
    value: "13667874323"
  },
  {
    key: "income",
    lable: "收入来源",
    value: "E.无固定收入"
  },
  {
    key: "investKnowledge",
    lable: "投资知识",
    value: "B.一般.对金融产品及相关风险有基本认识与理解"
  },
  {
    key: "能承受的最大损失",
    lable: "姓名",
    value: "B.10%(含)~30%"
  },
  {
    key: "experience",
    lable: "投资经验",
    value: "B.1年（含）~3年"
  }
];

const columns = [
  {
    title: "审批ID",
    dataIndex: "id"
  },
  {
    title: "环节名称",
    dataIndex: "name"
  },
  {
    title: "操作人",
    dataIndex: "operator"
  },
  {
    title: "状态",
    dataIndex: "status"
  },
  {
    title: "审批意见",
    dataIndex: "opinion"
  },
  {
    title: "日期",
    dataIndex: "dateTime"
  }
];
const data = [
  {
    key: "1",
    id: "101",
    name: "高风险客户",
    operator: "李XX",
    status: "通过",
    opinion: "风险可控",
    dateTime: new Date().toLocaleString("chinese", { hour12: false })
  }
];

const TransactionDetail = () => {
  const history = useHistory();
  const onClickBack = () => {
    console.log(history);
    history.goBack();
  };
  return (
    <div className={clasess.box}>
      <Row type="flex" align="middle" gutter={10} className={clasess.title}>
        <Col>
          <Title level={3}>
            <Button icon="arrow-left" onClick={onClickBack}></Button>
          </Title>
        </Col>
        <Col>
          <Title level={3}>理财产品合同审批</Title>
        </Col>
      </Row>
      <Row type="flex" justify="space-between" className={clasess.title}>
        <Col>
          <Title level={4}>记录信息</Title>
        </Col>
        <Col>
          <Button type="danger" style={{ marginRight: "20px" }}>
            拒绝
          </Button>
          <Button type="primary">通过</Button>
        </Col>
      </Row>
      <List
        bordered={true}
        itemLayout="horizontal"
        dataSource={fields}
        renderItem={item => (
          <List.Item>
            <Row type="flex" gutter={16}>
              <Col>{item.lable}:</Col>
              <Col>{item.value}</Col>
            </Row>
          </List.Item>
        )}
      />
      ,
      <Row type="flex" justify="space-between" className={clasess.title}>
        <Col>
          <Title level={4}>审批流水</Title>
        </Col>
        <Col>
          <Title level={4}>审批状态：进行中</Title>
        </Col>
      </Row>
      <Table
        pagination={false}
        columns={columns}
        dataSource={data}
        size="middle"
      />
    </div>
  );
};

export default TransactionDetail;
