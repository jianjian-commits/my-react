import React from "react";
import { useParams, useHistory } from "react-router-dom";
import { Layout } from "antd";
import CommonHeader from "../components/header/CommonHeader";
import  FormDataDetail from "../components/formBuilder/component/formData/components/formDataDetail";

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
    label: "应用管理",
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
        <FormDataDetail
          id={disposeId.substring(0, disposeId.indexOf("-"))}
          dataId={disposeId}
          appId={appId}
          approvalKey={"MyPending"}
          enterPort={"Dispose"}
        ></FormDataDetail>
      </Content>
    </Layout>
  );
};

export default Backlog;
