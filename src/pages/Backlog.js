import React from "react";
import { Layout } from "antd";
import HomeHeader from "../components/header/HomeHeader";

const { Content } = Layout;
class Backlog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <Layout>
        <HomeHeader />
        <Content>没有代办，别点了</Content>
      </Layout>
    );
  }
}

export default Backlog;
