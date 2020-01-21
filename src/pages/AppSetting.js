import React from "react";
import { Layout, Button, Input, Icon } from "antd";
import CommonHeader from "../components/header/CommonHeader";
import DraggableList, {
  DropableWrapper
} from "../components/shared/DraggableList";

import classes from "../styles/apps.module.scss";
import { history } from "../store";
const { Content, Sider } = Layout;

const navigationList = [
  { key: 0, label: "我的应用", onClick: () => history.push("/app/list") },
  { key: 1, label: "13号Devinci应用", disabled: true }
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
  const addFolder = () => alert("没用的");

  const dropHandle = (formId, groupId) => {
    alert(formId + " 放进 " + groupId);
  };
  return (
    <Layout>
      <CommonHeader navigationList={navigationList} />
      <Layout>
        <Sider className={classes.appSider} style={{ background: "#fff" }}>
          <div className={classes.searchBox}>
            <Input
              style={{ width: 150 }}
              placeholder="输入名称来搜索"
              value={searchKey}
              onChange={searchHandle}
            />
            <Icon
              type="folder-add"
              className={classes.addFolder}
              onClick={addFolder}
            />
          </div>
          <div className={classes.formArea}>
            <DraggableList
              selected={selectedForm}
              draggable={!!searchKey}
              onClick={e => setSelectedForm(e.key)}
              groups={groups}
              list={list}
              onDrop={dropHandle}
            />
            <DropableWrapper
              className={classes.empty}
              onDrop={e => dropHandle(e.dataTransfer.getData("formId"), null)}
            ></DropableWrapper>
          </div>
        </Sider>
        <Content className={classes.container}>
          <div className={classes.header}>
            <div>
              <Button type="primary" onClick={null}>
                提交数据
              </Button>
            </div>
            <div>我是 {selectedForm} -表单数据</div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
export default AppDetail;
