import React from "react";
import { useParams, useHistory } from "react-router-dom";
import { Layout } from "antd";
import CommonHeader from "../components/header/CommonHeader";
import TransactionDetail from "../components/transactList/TransactionDetail";

const { Content } = Layout;

const navigationList = (appId, history) => [
  {
    key: 0,
    label: "审批详情",
    disabled: true
  }
];

const getOreations = (appId, history) => [
  {
    key: "setting",
    icon: "setting",
    label: "应用设置",
    onClick: () => history.push(`/app/${appId}/setting`)
  }
];
const Backlog = () => {
  const { appId, disposeId } = useParams();
  const history = useHistory();
  return (
    <Layout>
      <CommonHeader
        navigationList={navigationList(appId, history)}
        operations={getOreations(appId, history)}
      />
      <Content>
        <TransactionDetail></TransactionDetail>
      </Content>
    </Layout>
  );
};

export default Backlog;
