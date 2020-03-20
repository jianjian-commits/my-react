import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Layout, Input } from "antd";
import { useParams, useHistory } from "react-router-dom";
import CommonHeader from "../components/header/CommonHeader";
import { ApprovalSection } from "../components/approval";
import DraggableList from "../components/shared/DraggableList";
import mobileAdoptor from "../components/formBuilder/utils/mobileAdoptor";

import FormBuilderSubmitData from "../components/formBuilder/component/formData/formSubmitData";
import FormBuilderSubmission from "../components/formBuilder/component/submission/submission";
import EditFormData from "../components/formBuilder/component/formData/components/editFormData/editFormData";
import { getFormsAll } from "../components/formBuilder/component/homePage/redux/utils/operateFormUtils";
// import { appDetailMenu } from "../components/transactList/appDetailMenu";
import { APP_VISIABLED, APP_SETTING_ABLED } from "../auth";
import Authenticate from "../components/shared/Authenticate";
import TransactList from "../components/transactList/TransactList";
import { submitFormDataAuth } from "../components/formBuilder/utils/permissionUtils";

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

const FormBuilderEditFormData = mobileAdoptor.submission(EditFormData);
const AppDetail = props => {
  const { appId } = useParams();
  const history = useHistory();
  const [selectedForm, setSelectedForm] = React.useState(null);
  const [searchKey, setSearchKey] = React.useState(null);
  const [submit, setSubmit] = React.useState(false);
  const [submissionId, setSubmissionId] = React.useState(null);
  const [enterApprovalDetail, setEnterApprovalDetail] = React.useState(false);
  // zxx mockForms存储表单列表数据
  const [mockForms, setMockForms] = React.useState({
    groups: [],
    list: [],
    searchList: []
  });
  const [user, setUser] = React.useState({});

  //zxx groups目录结构 list无目录结构的表单
  let { groups, list, searchList } = mockForms;

  useEffect(() => {
    let newList = [];
    let { id, name } = props.userDetail;

    setUser({ user: { id, name } });

    // let extraProp = { user: { id, name} }

    getFormsAll(appId, true).then(res => {
      newList = res.map(item => ({
        key: item.id,
        name: item.name
      }));
      console.log(res)
      setMockForms({
        groups: [],
        searchList: [],
        list: newList
      });
    });
  }, [appId, props.userDetail]);

  const [approvalKey, setApprovalKey] = React.useState(null);
  const currentApp =
    Object.assign([], props.appList).find(v => v.id === appId) || {};
  const appName = currentApp.name || "";

  const searchForms = (keyword, groupsParams) => {
    let _groups = groupsParams;

    for (let i = 0, maxLength = _groups.length; i < maxLength; i++) {
      let arr = _groups[i].list.filter(
        item => item.name.indexOf(keyword) !== -1
      );
      if (arr.length !== 0) {
        _groups[i].list = arr;
      } else {
        _groups = null;
      }
    }
    return _groups;
  };

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

  //根据点击菜单栏
  const onClickMenu = (key, e) => {
    setApprovalKey(key);
    setSelectedForm(null);
    setEnterApprovalDetail(false);
  };

  // 父传子的方法
  const skipToSubmissionData = val => {
    setSubmit(!val);
  };

  // 提交权限
  const isSubmitAuth = submitFormDataAuth(props.permissions, props.teamId, appId, selectedForm);

  return (
    <Authenticate type="redirect" auth={APP_VISIABLED(appId)}>
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
                setSubmissionId(null);
              }}
              groups={groups}
              list={list}
            />
          </div>
        </Sider>
        <Content className={classes.container}>
          { // eslint-disable-next-line
            selectedForm != void 0 ? (
              <>
                {/* {(!submit && isSubmitAuth) ? (
                  <Button
                    type="primary"
                    className="form-submit-data-button"
                    onClick={_e => {
                      setSubmit(!submit);
                    }}
                  >
                    提交数据
                </Button>
                ) : null} */}
                {submit ? (
                  submissionId ? (
                    <FormBuilderEditFormData
                      key={Math.random()}
                      formId={selectedForm}
                      submissionId={submissionId}
                      appId={appId}
                      extraProp={user}
                      actionFun={(submission_id, submitFlag = false) => {
                        setSubmissionId(submission_id)
                        setSubmit(submitFlag);
                      }}
                    ></FormBuilderEditFormData>
                  )
                    : (
                      <FormBuilderSubmission
                        key={Math.random()}
                        formId={selectedForm}
                        extraProp={user}
                        appid={appId}
                        actionFun={skipToSubmissionData}
                      ></FormBuilderSubmission>
                    )
                ) : (
                    <FormBuilderSubmitData
                      key={Math.random()}
                      formId={selectedForm}
                      actionFun={(submission_id, submitFlag = false, formId) => {
                        setSubmit(submitFlag);
                        setSubmissionId(submission_id)
                        if (formId) {
                          setSelectedForm(formId)
                        }
                      }}
                      appId={appId}
                    ></FormBuilderSubmitData>
                  )}
              </>
            ) : approvalKey !== null ? (
              <TransactList fn={onClickMenu} approvalKey={approvalKey} enterApprovalDetail={enterApprovalDetail} setEnterApprovalDetail={setEnterApprovalDetail} />
            ) : null}
        </Content>
      </Layout>
    </Authenticate>
  );
};
export default connect(({ app, login }) => ({
  appList: app.appList,
  userDetail: login.userDetail,
  teamId: login.currentTeam && login.currentTeam.id,
  permissions: (login.userDetail && login.userDetail.permissions) || []
}))(AppDetail);
