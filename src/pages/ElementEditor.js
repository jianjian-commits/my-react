import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import ChartContainer from '../components/bi/component/elements/chart/ChartContainer';
import EditorHeader from '../components/bi/component/elements/EditorHeader';
import { Layout } from "antd";
import { ChartBindPane, LeftPane, RightPane, DragAndDrop } from '../components/bi/component/bind';
import classes from "../styles/bi.module.scss";
import "../components/bi/scss/index.scss";
const { Sider, Content } = Layout;

const ElementEditor = props => {
  const history = useHistory();
  const { appId, dashboardId } = useParams();
  const { chartData, chartInfo, elemType } = props;

  const load = (e) => {
    history.push(`/app/${appId}/setting/bi/${dashboardId}`);
  }

  useEffect(()=> {
    window.addEventListener("load", load);
    return () => {
      window.removeEventListener("load", load);
    }
  })

  return (
      <Layout style={{height: document.body.scrollHeight}}>
        <EditorHeader/>
        <DragAndDrop>
          <Layout>
            <Sider style={{ background: "#fff" }}>
              <LeftPane />
            </Sider>
            <Content className={classes.elemContainer}>
              <ChartBindPane/>
              <ChartContainer isBtnBlock={true} chartData={chartData} chartInfo={chartInfo} elemType={elemType} style={{flexGrow: 1}}/>
            </Content>
            <Sider style={{ background: "#fff" }}>
              <RightPane/>
            </Sider>
          </Layout>
        </DragAndDrop>
      </Layout>
  )
}

export default connect(store => ({
  dataSource: store.bi.dataSource,
  chartData: store.bi.chartData,
  chartInfo: store.bi.chartInfo,
  elemType: store.bi.elemType
}), {
})(ElementEditor);
