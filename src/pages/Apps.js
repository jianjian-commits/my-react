import React from "react";
import { connect } from "react-redux";
import { history } from "../store";
import { Layout, Button, Card, message } from "antd";
import HomeHeader from "../components/header/HomeHeader";
import ModalCreation from "../components/profileManagement/modalCreate/ModalCreation";
import request from "../utils/request";
import { getAppList } from "../store/appReducer";
import Authenticate from "../components/shared/Authenticate";
import { SUPER_ADMINISTRATOR, APP_VISIABLED } from "../auth";
import commonClasses from "../styles/common.module.scss";
import classes from "../styles/apps.module.scss";
const { Content } = Layout;
const { Meta } = Card;

const getApps = list => {
  return list.map(e => {
    return (
      <Authenticate key={e.id} auth={APP_VISIABLED(e.id)}>
        <Card
          className={classes.appCard}
          loading={false}
          onClick={() => history.push(`/app/${e.id}/detail`)}
        >
          <Meta
            className={classes.appCardMeta}
            avatar={<img src={`/image/appCreateIcons/${e.icon}.png`} alt="" />}
            title={e.name}
            description={e.description}
          />
        </Card>
      </Authenticate>
    );
  });
};

class Apps extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentDidMount() {
    this.props.getAppList();
  }

  // 完成新建
  async handleCreate(data) {
    try {
      const res = await request("/customApplication", {
        method: "POST",
        data
      });
      if (res && res.status === "SUCCESS") {
        message.success("创建应用成功");
        this.props.getAppList();
        this.handleCancel();
      } else {
        message.error("创建应用失败");
      }
    } catch (err) {
      message.error("创建应用失败");
    }
  }

  // 取消新建/关闭模态窗
  handleCancel() {
    this.setState({
      open: false
    });
  }

  render() {
    return (
      <Layout>
        <HomeHeader />
        <Content className={commonClasses.container}>
          <header className={commonClasses.header}>
            <span style={{ fontSize: 20 }}>我的应用</span>
            <Authenticate auth={SUPER_ADMINISTRATOR}>
              <Button
                type="link"
                icon="plus"
                onClick={() => this.setState({ open: true })}
              >
                创建应用
              </Button>
            </Authenticate>
          </header>
          <content>{getApps(this.props.appList)}</content>
          <ModalCreation
            title={"创建应用"}
            visible={this.state.open}
            onOk={data => this.handleCreate(data)}
            onCancel={this.handleCancel}
          />
        </Content>
      </Layout>
    );
  }
}

export default connect(
  ({ app }) => ({
    appList: app.appList
  }),
  {
    getAppList
  }
)(Apps);
