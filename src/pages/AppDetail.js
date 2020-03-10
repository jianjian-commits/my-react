import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Layout, Input, Button } from "antd";
import { useParams, useHistory } from "react-router-dom";
import CommonHeader from "../components/header/CommonHeader";
import { ApprovalSection } from "../components/approval";
import DraggableList from "../components/shared/DraggableList";
import FormBuilderSubmitData from "../components/formBuilder/component/formData/formSubmitData";
import FormBuilderSubmission from "../components/formBuilder/component/submission/submission";

import selectCom from "../utils/selectCom";
import request from "../utils/request";
import { appDetailMenu } from "../components/transactList/appDetailMenu";

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
    onClick: () => history.push(`/app/${appId}/setting`)
  }
];

const AppDetail = () => {
  const { appId, menuId } = useParams();
  const history = useHistory();
  const [selectedForm, setSelectedForm] = React.useState(null);
  const [searchKey, setSearchKey] = React.useState(null);
  const [submit, setSubmit] = React.useState(false);
  const [ele, setEle] = React.useState(selectCom(menuId, appDetailMenu));
  // zxx mockForms存储表单列表数据
  const [mockForms, setMockForms] = React.useState({ groups: [], list: [] });

  //zxx groups目录结构 list无目录结构的表单
  let { groups, list } = mockForms;
  useEffect(() => {
    let newList = [];
    request("/form?desc=createdTime", {
      methods: "get"
    }).then(res => {
      newList = res.map(item => ({
        key: item.id,
        name: item.name
      }));
      setMockForms({
        groups: [
          {
            name: "基础设置",
            key: "base",
            list: [
              { key: "sWw", name: "车队信息" },
              { key: "clr", name: "油卡信息" },
              { key: "CrE", name: "车辆信息" }
            ]
          }
        ],
        list: newList
      });
    });
  }, []);
  const currentApp =
    Object.assign([], props.appList).find(v => v.id === appId) || {};
  const appName = currentApp.name || "";

  if (searchKey) {
    const all = JSON.parse(JSON.stringify(list));
    const allGroups = JSON.parse(JSON.stringify(groups));
    groups =
      searchKey === "" ? searchList : searchForms(searchKey, [...allGroups]);
    list = all.filter(i => i.name.indexOf(searchKey) !== -1);
    if (list.length === 0 && groups === null) {
      list = [{ key: "", name: "暂无匹配项" }];
    }
  }
  //zxx 更改搜索的关键值
  const searchHandle = e => {
    const { value } = e.target;
    setSearchKey(value);
  };

  //根据点击菜单栏加载内容组件
  const onClickMenu = (key, e) => {
    setSelectedForm(null);
    setEle(selectCom(key, appDetailMenu));
  };

  // 父传子的方法
  const skipToSubmissionData = val => {
    setSubmit(!val);
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
                setSubmit(false);
              }}
              groups={groups}
              list={list}
            />
          </div>
        </Sider>
        <Content className={classes.container}>
          {selectedForm != void 0 ? (
            <>
              {!submit ? (
                <Button
                  type="primary"
                  className="form-submit-data-button"
                  onClick={_e => {
                    setSubmit(!submit);
                  }}
                >
                  提交数据
                </Button>
              ) : null}
              {submit ? (
                <FormBuilderSubmission
                  key={Math.random()}
                  formId={selectedForm}
                  actionFun={skipToSubmissionData}
                ></FormBuilderSubmission>
              ) : (
                <FormBuilderSubmitData
                  key={Math.random()}
                  formId={selectedForm}
                ></FormBuilderSubmitData>
              )}
            </>
          ) : ele != null ? (
            <ele.ContentEle count={ele.key} />
          ) : null}
        </Content>
      </Layout>
    </Layout>
  );
};
export default connect(({ app }) => ({
  appList: app.appList
}))(AppDetail);
