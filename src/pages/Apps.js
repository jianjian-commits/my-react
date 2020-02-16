import React from "react";
import { Layout, Button, Card, Icon, message } from "antd";
import HomeHeader from "../components/header/HomeHeader";
import commonClasses from "../styles/common.module.scss";
import classes from "../styles/apps.module.scss";
import { history } from "../store";
import { CreateFormModal } from "../components/createModal";
import request from "../utils/request";
const { Content } = Layout;
const { Meta } = Card;

// 示例（默认）数据
const defaultData = [
  {
    id: 0,
    appName: "用户示例",
    appDescription: "示例应用各项产品功能",
    icon: "apartment"
  }
];

// 创建模拟数据
// const createDatas = [
//   {
//     id: 1,
//     appName: "请假申请",
//     appDescription: "用于处理公司的请假申请",
//     icon: "edit"
//   },
//   {
//     id: 2,
//     appName: "车辆管理系统",
//     appDescription: "用于公司的车辆管理",
//     icon: "bar-chart"
//   }
// ];

const getApps = list => {
  return list.map(e => {
    return (
      <Card
        key={e.id}
        className={classes.appCard}
        loading={false}
        onClick={() => history.push(`/app/${e.appName}/detail`)}
      >
        <Meta
          className={classes.appCardMeta}
          avatar={<Icon type={e.icon} className={classes.avatarIcon} />}
          title={e.appName}
          description={e.appDescription}
        />
      </Card>
    );
  });
};

class Apps extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      createDatas: []
    };
    this.handleCancel = this.handleCancel.bind(this);
  }

  // 完成新建
  async handleCreate(data) {
    const res = await request("/customApplication", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify(data)
    });
    if (!res) {
      message.error("创建应用失败");
    }
    this.handleCancel();
  }

  // 取消新建/关闭模态窗
  handleCancel() {
    this.setState({
      open: false
    });
  }

  // 获取到所有的应用列表
  async getList() {
    const res = await request("/customApplication/list", {
      method: "POST",
      data: {
        page: "1",
        size: "10"
      }
    });
    if (res && res.data) {
      return this.setState({
        createDatas: res.data.datas
      });
    }
    message.error("获取应用列表失败");
  }

  componentDidMount() {
    this.getList();
  }

  render() {
    return (
      <Layout>
        <HomeHeader />
        <Content className={commonClasses.container}>
          <header className={commonClasses.header}>
            <span style={{ fontSize: 20 }}>我的应用</span>
            <Button
              type="link"
              icon="plus"
              onClick={() => this.setState({ open: true })}
            >
              创建应用
            </Button>
          </header>
          <content>
            {getApps(defaultData)}
            {getApps(this.state.createDatas)}
          </content>
          <CreateFormModal
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

export default Apps;
