import React from "react";
import { connect } from "react-redux";
import { Layout, Input } from "antd";
import { useParams, useHistory } from "react-router-dom";
import CommonHeader from "../components/header/CommonHeader";
import { ApprovalSection } from "../components/approval";
import DraggableList from "../components/shared/DraggableList";
import { APP_SETTING_ABLED } from "../auth";
import FormBuilderSubmitData from "../components/formBuilder/component/formData/formSubmitData";
import TransactList from "../components/transactList/TransactList";

import classes from "../styles/apps.module.scss";
const { Content, Sider } = Layout;

const navigationList = (appName, history) => [
  { key: 0, label: "我的应用", onClick: () => history.push("/app/list") },
  { key: 1, label: `${appName}`, disabled: true }
];

const getOreations = (appId, history) => [
  {
    key: "setting",
    icon: "setting",
    label: "应用设置",
    auth: APP_SETTING_ABLED(appId),
    onClick: () => history.push(`/app/${appId}/setting`)
  }
];

const mockForms = {
  groups: [
    {
      name: "基础设置",
      key: "base",
      list: [
        { key: "sWw", name: "车队信息" },
        { key: "clr", name: "油卡信息" },
        { key: "CrE", name: "车辆信息" }
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

const AppDetail = props => {
  const { appId } = useParams();
  const history = useHistory();
  const [selectedForm, setSelectedForm] = React.useState(null);
  const [searchKey, setSearchKey] = React.useState(null);
  const [approvalKey, setApprovalKey] = React.useState(null);
  let { groups, list } = mockForms;
  const currentApp =
    Object.assign([], props.appList).find(v => v.id === appId) || {};
  const appName = currentApp.name || "";

  if (searchKey) {
    const all = groups.reduce((acc, e) => acc.concat(e.list), []).concat(list);
    groups = null;
    list = all.filter(i => i.name.indexOf(searchKey) !== -1);
  }

  const searchHandle = e => {
    const { value } = e.target;
    setSearchKey(value);
  };

  //根据点击菜单栏
  const onClickMenu = (key, e) => {
    setApprovalKey(key);
  };
  return (
    <Layout>
      <CommonHeader
        navigationList={navigationList(appName, history)}
        operations={getOreations(appId, history)}
      />
      <Layout>
        <Sider className={classes.appSider} style={{ background: "#fff" }}>
          <ApprovalSection fn={onClickMenu} />
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
              onClick={e => {
                setSelectedForm(e.key);
              }}
              groups={groups}
              list={list}
            />
          </div>
        </Sider>
        <Content className={classes.container}>
          {selectedForm !== void 0 ? (
            <>
              <button
                onClick={_e => {
                  history.push(
                    `/app/${appId}/detail/submission?formId=${selectedForm}`
                  );
                }}
              >
                提交数据
              </button>
              <FormBuilderSubmitData
                key={Math.random()}
                formId={selectedForm}
              ></FormBuilderSubmitData>
            </>
          ) : approvalKey !== null ? (
            <TransactList fn={onClickMenu} approvalKey={approvalKey} />
          ) : null}
        </Content>
      </Layout>
    </Layout>
  );
};
export default connect(({ app }) => ({
  appList: app.appList
}))(AppDetail);
