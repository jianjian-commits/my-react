import React from "react";
import { Layout, Button, Input } from "antd";
import { useParams, useHistory } from "react-router-dom";
import CommonHeader from "../components/header/CommonHeader";
import { ApprovalSection } from "../components/approval";
import DraggableList from "../components/shared/DraggableList";
import FormBuilderList from "../components/formBuilder/component/homePage";

import classes from "../styles/apps.module.scss";
const { Content, Sider } = Layout;

const navigationList = history => [
  { key: 0, label: "我的应用", onClick: () => history.push("/app/list") },
  { key: 1, label: "13号Devinci应用", disabled: true }
];

const getOreations = (appId, history) => [
  {
    key: "setting",
    icon: "setting",
    label: "应用设置",
    onClick: () => history.push(`/app/${appId}/setting`)
  }
];

const mockForms = {
  groups: [
    {
      name: "基础设置",
      key: "base",
      list: [
        { key: "group", name: "车队信息" },
        { key: "card", name: "油卡信息" },
        { key: "carr", name: "车辆信息" }
      ]
    },
    {
      name: "用车管理",
      key: "use",
      list: [
        { key: "short", name: "短途申请" },
        { key: "long", name: "长途用车申请" }
      ]
    },
    {
      name: "违章管理",
      key: "ban",
      list: [
        { key: "aban", name: "违章记录" },
        { key: "handle", name: "违章处理记录" }
      ]
    }
  ],
  list: [
    { key: "genernal", name: "车辆状态一览" },
    { key: "check", name: "车辆年检记录" }
  ]
};

const AppDetail = () => {
  const { appId } = useParams();
  const history = useHistory();
  const [selectedForm, setSelectedForm] = React.useState(null);
  const [searchKey, setSearchKey] = React.useState(null);
  let { groups, list } = mockForms;

  if (searchKey) {
    const all = groups.reduce((acc, e) => acc.concat(e.list), []).concat(list);
    groups = null;
    list = all.filter(i => i.name.indexOf(searchKey) !== -1);
  }

  const searchHandle = e => {
    const { value } = e.target;
    setSearchKey(value);
  };

  return (
    <Layout>
      <CommonHeader
        navigationList={navigationList(history)}
        operations={getOreations(appId, history)}
      />
      <Layout>
        <Sider className={classes.appSider} style={{ background: "#fff" }}>
          <ApprovalSection />
          <div className={classes.searchBox}>
            <Input
              placeholder="输入名称来搜索"
              value={searchKey}
              onChange={searchHandle}
            />
          </div>
          <div className={classes.formArea}>
            <DraggableList
              selected={selectedForm}
              draggable={false}
              onClick={e => setSelectedForm(e.key)}
              groups={groups}
              list={list}
            />
          </div>
        </Sider>
        <Content className={classes.container}>
          <div className={classes.header}>
            <div>
              <Button type="primary" onClick={null}>
                提交数据
              </Button>
            </div>
            <FormBuilderList></FormBuilderList>
            <div>我是 {selectedForm} -表单数据</div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
export default AppDetail;
