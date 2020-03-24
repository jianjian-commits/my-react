import React from "react";
import { connect } from "react-redux";
import ChartContainer from '../components/bi/component/elements/chart/ChartContainer';
import EditorHeader from '../components/bi/component/elements/EditorHeader';
import { Layout } from "antd";
import { ChartBindPane, LeftPane, RightPane, DragAndDrop } from '../components/bi/component/bind';
import classes from "../styles/apps.module.scss";
const { Sider, Content } = Layout;

class ElementEditor extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { chartData } = this.props;
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
              <ChartContainer chartData={chartData}/>
            </Content>
            <Sider style={{ background: "#fff" }}>
              <RightPane/>
            </Sider>
          </Layout>
        </DragAndDrop>
      </Layout>
    )
  }
}

export default connect(store => ({
  dataSource: store.bi.dataSource,
  chartData: store.bi.chartData
}),{})(ElementEditor);
