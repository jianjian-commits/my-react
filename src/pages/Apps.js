import React from "react";
import { Layout, Button, Card, Avatar } from "antd";
import HomeHeader from "../components/header/HomeHeader";
import commonClasses from "../styles/common.module.scss";
import classes from "../styles/apps.module.scss";
import { history } from "../store";
const { Content } = Layout;
const { Meta } = Card;

const apps = Array.from(new Array(20)).map((e, i) => ({
  name: i + ""
}));

const getApps = list => {
  return list.map(e => {
    return (
      <Card
        key={e.name}
        className={classes.appCard}
        bodyStyle={{ padding: 15 }}
        loading={false}
        onClick={() => history.push(`/app/${e.name}/detail`)}
      >
        <Meta
          className={classes.appCardMeta}
          avatar={
            <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
          }
          title="Devinci"
          description={`${e.name}, 这么巧，你也叫Devinci`}
        />
      </Card>
    );
  });
};

class Apps extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <Layout>
        <HomeHeader />
        <Content className={commonClasses.container}>
          <header className={commonClasses.header}>
            <span style={{ fontSize: 20 }}>我的应用</span>
            <Button type="link" icon="plus">
              创建应用
            </Button>
          </header>
          <content>{getApps(apps)}</content>
        </Content>
      </Layout>
    );
  }
}

export default Apps;
