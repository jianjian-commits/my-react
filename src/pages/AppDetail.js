import React from "react";
import { connect } from "react-redux";
import { Layout, Input, ConfigProvider } from "antd";
import zhCN from 'antd/es/locale/zh_CN';
import { useParams, useHistory } from "react-router-dom";
import CommonHeader from "../components/header/CommonHeader";
import { ApprovalSection } from "../components/approval";
import DraggableList from "../components/shared/DraggableList";
import mobileAdoptor from "../components/formBuilder/utils/mobileAdoptor";

import FormBuilderSubmitData from "../components/formBuilder/component/formData/formSubmitData";
import FormBuilderSubmission from "../components/formBuilder/component/submission/submission";
import EditFormData from "../components/formBuilder/component/formData/components/editFormData/editFormData";
import { getFormsAll, getApproveCount, clearApproveCount } from "../components/formBuilder/component/homePage/redux/utils/operateFormUtils";
// import { appDetailMenu } from "../components/transactList/appDetailMenu";
import { APP_VISIABLED, APP_SETTING_ABLED } from "../auth";
import Authenticate from "../components/shared/Authenticate";
// import { submitFormDataAuth } from "../components/formBuilder/utils/permissionUtils";
// import TransactList from "../components/transactList/TransactList";
import TodoTransctionList from "../components/transactList/TodoTransctionList";
import SubmitTransctionList from "../components/transactList/SubmitTransctionList";
import HandleTranscationList from "../components/transactList/HandleTranscationList";
import { AppManageIcon } from "../assets/icons/apps";
import classes from "../styles/apps.module.scss";
import appDeatilClasses from "../styles/appDetail.module.scss";
// import { TableIcon } from "../assets/icons/index"
const { Content, Sider } = Layout;

const navigationList = (appName, history) => [
  { key: 0, label: "我的应用", onClick: () => history.push("/app/list") },
  { key: 1, label: `${appName}`, disabled: true }
];

const getOreations = (appId, history) => [
  {
    key: "setting",
    icon: (
      <AppManageIcon
        style={{ paddingRight: "5px", width: "17px", height: "18px" }}
      />
    ),
    label: "应用管理",
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
  const [searchStatus,setSearchStatus] = React.useState(true)

  // zxx mockForms存储表单列表数据
  const [mockForms, setMockForms] = React.useState({
    groups: [],
    list: [],
    searchList: []
  });
  const [user, setUser] = React.useState({});

  //zxx groups目录结构 list无目录结构的表单
  let { groups, list, searchList } = mockForms;

  React.useEffect(() => {
    let newList = [];
    let { id, name } = props.userDetail;

    setUser({ user: { id, name } });

    // let extraProp = { user: { id, name} }
    
      getFormsAll(appId, true).then(res => {
        // let newList = []
        newList = res.map(item => ({
          key: item.id,
          name: item.name,
          // icon: TableIcon
        }));
        
        setMockForms({
          groups: [],
          searchList: [],
          list: newList
        });
      });

  }, [appId, props.userDetail]);


  const [approvalKey, setApprovalKey] = React.useState("myPending");
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
    if(value){
      setSearchStatus(false)
    }else{
      setSearchStatus(true)
    }
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

  let TransactList = <></>;
  let transctionListOptions = {
    actionFun: (submission_id, submitFlag = false, formId) => {
      setSubmit(submitFlag);
      setSubmissionId(submission_id);
      if (formId) {
        setSelectedForm(formId);
      }
    },
    fn: onClickMenu,
    approvalKey: approvalKey,
    enterApprovalDetail: enterApprovalDetail,
    setEnterApprovalDetail: setEnterApprovalDetail
  };
  switch (approvalKey) {
    case "myPending":
      TransactList = <TodoTransctionList {...transctionListOptions} approveListCount={props.approveListCount}/>;
      break;
    case "mySubmitted":
      TransactList = <SubmitTransctionList {...transctionListOptions} />;
      break;
    case "myHandled":
      TransactList = <HandleTranscationList {...transctionListOptions} />;
      break;
    default:
      break;
    // return <></>;
  }
  return (
    <Authenticate type="redirect" auth={APP_VISIABLED(appId)}>
      <CommonHeader
        // title={appName}
        navigationList={navigationList(appName, history)}
        operations={getOreations(appId, history)}
      />
      <Layout>
        <Sider
          className={classes.appSider}
          style={{ background: "#fff" }}
          width="240"
        >
          <ApprovalSection approvalKey={approvalKey} fn={onClickMenu} approveListCount={props.approveListCount} getApproveCount={props.getApproveCount} clearApproveCount={props.clearApproveCount}/>
          <div className={appDeatilClasses.searchBox}>
            <Input
              placeholder="输入名称来搜索"
              value={searchKey}
              onChange={searchHandle}
              prefix={
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.8696 11.2369L9.44935 8.80981C10.2291 7.87776 10.6988 6.67619 10.6988 5.36437C10.6988 2.40165 8.3039 0 5.34945 0C2.39492 0 0 2.40163 0 5.36437C0 8.32711 2.39494 10.7287 5.34945 10.7287C6.6747 10.7287 7.88717 10.2453 8.82161 9.44493L11.239 11.869C11.4131 12.0437 11.6955 12.0437 11.8696 11.869C12.0435 11.6944 12.0435 11.4115 11.8696 11.2369ZM5.34946 9.83465C2.88747 9.83465 0.89158 7.83323 0.89158 5.36435C0.89158 2.89549 2.88747 0.894038 5.34946 0.894038C7.81145 0.894038 9.80702 2.8955 9.80702 5.36435C9.80702 7.83323 7.81143 9.83465 5.34946 9.83465Z"
                    fill="#B6B6BA"
                  />
                </svg>
              }
            />
          </div>
          <div className={appDeatilClasses.formArea}>
            <DraggableList
              selected={selectedForm}
              draggable={false}
              onSelect={e => {
                setSelectedForm(e.key);
                setApprovalKey("");
                setSubmit(false);
                setSubmissionId(null);
                setSearchStatus(true)
              }}
              groups={groups}
              list={list}
            />
          </div>
        </Sider>
        <ConfigProvider locale={zhCN}>
          <Content className={classes.container}>
            {// eslint-disable-next-line
            selectedForm != void 0 ? (
              <>
                {submit ? (
                  submissionId ? (
                    <FormBuilderEditFormData
                      key={Math.random()}
                      formId={selectedForm}
                      submissionId={submissionId}
                      appId={appId}
                      extraProp={user}
                      actionFun={(submission_id, submitFlag = false) => {
                        setSubmissionId(submission_id);
                        setSubmit(submitFlag);
                      }}
                    ></FormBuilderEditFormData>
                  ) : (
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
                      setSubmissionId(submission_id);
                      if (formId) {
                        setSelectedForm(formId);
                      }
                    }}
                    appId={appId}
                    searchStatus = { searchStatus }
                  ></FormBuilderSubmitData>
                )}
              </>
            ) : approvalKey !== null ? (
              TransactList
            ) : null}
          </Content>
        </ConfigProvider>
      </Layout>
    </Authenticate>
  );
};
export default connect(({ app, login, forms }) => ({
  appList: app.appList,
  teamId: login.currentCompany && login.currentCompany.id,
  permissions: (login.userDetail && login.userDetail.permissions) || [],
  userDetail: login.userDetail,
  approveListCount: forms.approveListCount
}),{
  getApproveCount,
  clearApproveCount
})(AppDetail);
