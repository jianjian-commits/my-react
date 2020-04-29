import React from "react";
import { HomeLayout } from "../components/shared";
import TransactList from "../components/transactList/TransactList";

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
      <HomeLayout>
        <TransactList setBadgenum={this.setBadgenum}></TransactList>
      </HomeLayout>
    );
  }
}

export default Backlog;
