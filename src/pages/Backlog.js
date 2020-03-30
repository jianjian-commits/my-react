import React from "react";
import { Layout } from "antd";
import HomeHeader from "../components/header/HomeHeader";
import TransactList from "../components/transactList/TransactList";

const { Content } = Layout;
class Backlog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      badgenum: 0
    };
  }

  setBadgenum = (badgenum) =>{
    this.setState({
      badgenum
    })
  }
  render() {
    return (
      <Layout>
        <HomeHeader badgenum={this.state.badgenum}/>
        <Content>
          <TransactList setBadgenum={this.setBadgenum}></TransactList>
        </Content>
      </Layout>
    );
  }
}

export default Backlog;
