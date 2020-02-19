import React from "react";
import { Layout } from "antd";
import HomeHeader from "../components/header/HomeHeader";
import TransactList from "../components/transactList/TransactList";

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
        <Content>
          <TransactList></TransactList>
        </Content>
      </Layout>
    );
  }
}

export default Backlog;
