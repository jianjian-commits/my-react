import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import ChartContainer from '../components/bi/component/elements/chart/ChartContainer';
import EditorHeader from '../components/bi/component/elements/EditorHeader';
import { Layout } from "antd";
import { ChartBindPane, LeftPane, RightPane, DragAndDrop } from '../components/bi/component/bind';
import { setDashboards } from '../components/bi/redux/action';
import classes from "../styles/apps.module.scss";
import { setDB } from "../components/bi/utils/reqUtil";
const { Sider, Content } = Layout;

const ElementEditor = props => {
  const history = useHistory();
  const { appId, dashboardId } = useParams();
  const { chartData, setDashboards } = props;

  const load = (e) => {
    history.push(`/app/${appId}/setting/bi/${dashboardId}`);
    setDB(dashboardId, setDashboards);
  }

  useEffect(()=> {
    window.addEventListener("load", load);
    return () => {
      window.removeEventListener("load", load);
    }
  })

    return (
      <Layout>
        <EditorHeader/>
        <DragAndDrop>
          <Layout>
            <Sider style={{ background: "#fff" }}>
              <LeftPane/>
            </Sider>
            <Content className={classes.container}>
              <ChartBindPane/>
              <ChartContainer chartData={chartData} style={{height: 500}}/>
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
  chartData: store.bi.chartData
}), {
  setDashboards
})(ElementEditor);
