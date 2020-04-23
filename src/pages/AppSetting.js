import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Layout, Input, message } from "antd";
import { useParams, useHistory } from "react-router-dom";
import { getFormsAll, deleteForm ,updateFormName } from "../components/formBuilder/component/homePage/redux/utils/operateFormUtils";
import CommonHeader from "../components/header/CommonHeader";
import DraggableList, {
  // DropableWrapper
} from "../components/shared/DraggableList";
import { setAllForms } from "../components/formBuilder/component/formBuilder/redux/utils/operateFormComponent";

import classes from "../styles/apps.module.scss";
import ForInfoModal from "../components/formBuilder/component/formInfoModal/formInfoModal";
import Authenticate from "../components/shared/Authenticate";
import request from '../components/bi/utils/request';
import { newDashboard } from '../components/bi/redux/action';
import { APP_SETTING_ABLED } from "../auth";
import { newFormAuth } from "../components/formBuilder/utils/permissionUtils";

import { setDashboards } from '../components/bi/redux/action';
import { setDB, getDashboardAll } from '../components/bi/utils/reqUtil';
const { Content, Sider } = Layout;

const navigationList = (history, appId, appName) => [
  { key: 0, label: "我的应用", onClick: () => history.push("/app/list") },
  {
    key: 1,
    label: `${appName}`,
    onClick: () => history.push(`/app/${appId}/detail`)
  },
  { key: 1, label: "应用管理", disabled: true }
];

const AppSetting = props => {
  const { appId } = useParams();
  const history = useHistory();
  const [searchKey, setSearchKey] = React.useState(null);
  const [mockForms, setMockForms] = React.useState({
    groups: [],
    list: [],
    searchList: []
  });
  const [dashboards,setDashboardGroup] = React.useState({
    dbGroup: [],
    dbList: [],
    dbSearchList: []
  });
  const [user, setUser] = React.useState({});
  // isDeleteOne 用于判断是否删除表单
  const [ isDeleteOne, setIsDeleteOne ] = React.useState(false)
  const [ isChangeSequence, setIsChangeSequence ] = React.useState(false)

  let { groups, list, searchList } = mockForms;
  let { dbGroup,dbList } = dashboards;
  useEffect(() => {
    let newList = [];
    let { id, name } = props.userDetail;

    // 存储用户的信息
    setUser({ user: { id, name } });
    // let extraProp = { user: { id: user.id, name: user.name } }

    // 通过appid获取表单列表信息
    getFormsAll(appId, false).then(res => {
      newList = res.map(item => ({
        key: item.id,
        name: item.name,
        path: item.path
      }));

      props.setAllForms(res);

      setMockForms({
        groups: [
          // {key:'',name:'',list:[]}
        ],
        searchList: [],
        list: newList
      });
    });

    getDashboardAll(appId).then(res => {
      if(res && res.msg === "success"){
        let newDashboards = res.data.items.map(item => ({
          key: item.dashboardId,
          name: item.name,
        }));
        setDashboardGroup({
          dbGroup: [],
          dbList: newDashboards,
          dbSearchList: []
        })
      }
    })

    // 初始化是否删除的标志
    setIsDeleteOne( false )
    // 初始化是否更改列表的顺序

    setIsChangeSequence( false )
  }, [props, appId, isDeleteOne,isChangeSequence]);

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
    // 深拷贝数据
    const all = JSON.parse(JSON.stringify(list));
    const allGroups = JSON.parse(JSON.stringify(groups));
    groups =
      searchKey === "" ? searchList : searchForms(searchKey, [...allGroups]);
    list = all.filter(i => i.name.indexOf(searchKey) !== -1);
    if (list.length === 0 && groups === null) {
      list = [{ key: "", name: "暂无匹配项" }];
    }
  }

  const searchHandle = e => {
    const { value } = e.target;
    setSearchKey(value);
  };

  // const addFolder = () => alert("没用的");

  // 拖动进入文件
  const dragFileToFolder = (formId, groupId) => {
    alert(formId + " 放进 " + groupId);
  };

  // 处理点击表单名字事件
  const formEnterHandle = e => {
    if (list[0].key !== "") {
      history.push(`/app/${appId}/setting/form/${e.key}/edit?formId=${e.key}`);
    }
  };

  //处理仪表盘的点击事件
  const dashboardEnterHandle = e => {
    if (dbList[0].key !== "") {
      setDB(e.key, props.setDashboards);
      history.push(`/app/${appId}/setting/bi/${e.key}`);
    }
  };

  const createDashboard = () => {
    request("/bi/dashboards", {
      method: "POST",
      data: {name: "新建仪表盘", appId}, 
      warning: "创建报表失败"
    }).then(
      (res) => {
        if(res && res.msg === "success") {
          const data = res.data;
          props.newDashboard(data.id, data.name);
          history.push(`/app/${appId}/setting/bi/${data.id}`)
        } else {
          message.error("创建报表失败");
        }
        
      },
      () => message.error("创建报表失败")
    )
  }

  const [visible, setVisible] = useState(false);
  const modalProps = {
    visible,
    showModal: () => {
      setVisible(true);
    },
    handleCancel: e => {
      setVisible(false);
    },
    handleOK: e => {
      setVisible(false);
    }
  };

  const { permissions, teamId } = props;
  console.log(permissions, teamId, appId);
  const isShowNewFormBtn = newFormAuth(permissions, teamId, appId);
  return (
    <Authenticate type="redirect" auth={APP_SETTING_ABLED(appId)}>
      <ForInfoModal
        key={Math.random()}
        {...modalProps}
        pathArray={mockForms.list}
        extraProp={user}
        appid={appId}
        url={`/app/${appId}/setting/form/`}
      />
      <CommonHeader
        // title={appName}
        navigationList={navigationList(history, appId, appName)}
      />
      <Layout>
        <Sider className={classes.appSider} theme="light" width="240">
          
          <div className={classes.searchBox} style={{ padding: "30px 20px 0 20px"}}>
            <Input
              style={{ width: 200, height: 32 }}
              placeholder="输入名称来搜索"
              value={searchKey}
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
              onChange={searchHandle}
            />
            {/* <Icon
              type="folder-add"
              className={classes.addFolder}
              
            /> */}
          </div>

          <div className={classes.formArea}>
            <DraggableList
              draggable={!searchKey}
              onSelect={formEnterHandle}
              groups={groups}
              list={list}
              onDrop={dragFileToFolder}
              deleteForm={ deleteForm }
              updateFormName={ updateFormName }
              isDeleteOne={( params ) => setIsDeleteOne( params )}
              appId = {appId}
              isChangeSequence = { ( params ) => setIsChangeSequence( params )}
            />
            <hr/>
            <p>已创建仪表盘</p>
            <DraggableList
              draggable={!searchKey}
              onClick={dashboardEnterHandle}
              groups={dbGroup}
              list={dbList}
              onDrop={dragFileToFolder}
              isChangeSequence = { ( params ) => setIsChangeSequence( params )}
            />
            {/* <DropableWrapper
              className = {classes.empty}
              draggable = { true }

              onDrop = {
                
                 e => e.dataTransfer.setData("formId", formId)
                
              }
            ></DropableWrapper> */}
          </div>
          {/* <div className={classes.addFolder} 
          // ? 禁用点击新建文件夹功能,功能暂未开发 onClick={addFolder}
          disabled
          >
            <div className={classes.folderContent}>
              <i className={classes.folderIcon}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.1868 4.95637H2.81394V2.31403C2.81394 1.96923 3.08423 1.62478 3.48173 1.62478H7.42351C8.42527 1.62478 9.29773 3.33586 10.8877 3.33586H12.5353C12.8692 3.33586 13.2032 3.61504 13.2032 4.0251V4.95637H13.1868ZM13.1868 11.6033C13.1868 11.9478 12.9165 12.2926 12.519 12.2926H3.48155C3.14757 12.2926 2.81359 12.0134 2.81359 11.6031V5.62921H13.1868V11.6033ZM12.5194 2.66266H10.8886C9.56855 2.66266 8.69608 0.952637 7.42386 0.952637H3.48138C2.75025 0.952637 2.16187 1.57645 2.16187 2.31473V11.685C2.16187 12.4397 2.75008 13.0471 3.48138 13.0471H12.5201C13.2514 13.0471 13.8396 12.4234 13.8396 11.685V3.95897C13.7918 3.20376 13.2514 2.66231 12.5201 2.66231L12.5194 2.66266Z"
                    fill="#777F97"
                  />
                  <path
                    d="M12.5193 13.1524H3.48063C3.29211 13.1527 3.10549 13.1147 2.93205 13.0408C2.75861 12.9669 2.60196 12.8586 2.47154 12.7225C2.20312 12.4443 2.05414 12.0722 2.05642 11.6857V2.31542C2.05568 1.93109 2.20442 1.56153 2.47119 1.28486C2.60097 1.14737 2.75742 1.03777 2.93097 0.962766C3.10453 0.887763 3.29156 0.848927 3.48063 0.848633H7.42242C8.08898 0.848633 8.647 1.28888 9.18654 1.71464C9.71281 2.12993 10.257 2.55936 10.8866 2.55936H12.6233V2.56337C12.9558 2.5832 13.27 2.72229 13.5082 2.95511C13.7635 3.20742 13.9177 3.56234 13.9425 3.95442V11.6857C13.9432 12.0699 13.7945 12.4394 13.5277 12.716C13.3981 12.8534 13.2418 12.963 13.0684 13.038C12.8951 13.113 12.7082 13.152 12.5193 13.1524ZM3.48063 1.05715C3.31987 1.05768 3.1609 1.09095 3.01341 1.15494C2.86593 1.21894 2.73303 1.3123 2.62283 1.42934C2.39366 1.66705 2.26589 1.98454 2.26651 2.31472V11.685C2.2643 12.0171 2.39205 12.3369 2.62248 12.5761C2.73339 12.6921 2.86667 12.7843 3.01426 12.8473C3.16185 12.9103 3.32069 12.9427 3.48115 12.9425H12.5199C12.6807 12.9421 12.8398 12.9089 12.9874 12.845C13.135 12.781 13.2681 12.6876 13.3784 12.5705C13.6075 12.3328 13.7353 12.0153 13.7347 11.6851V3.9635C13.6888 3.25959 13.1896 2.76822 12.5199 2.76822H10.8882C10.1859 2.76822 9.61265 2.31594 9.05828 1.87831C8.52311 1.45604 8.01779 1.05715 7.42381 1.05715H3.48063ZM12.5192 12.3976H3.4815C3.27389 12.3943 3.07603 12.3089 2.93123 12.16C2.78643 12.0112 2.70647 11.8111 2.70885 11.6035V5.52503H13.2915V11.6036C13.2899 11.8049 13.2145 11.9985 13.0795 12.1477C13.009 12.2266 12.9227 12.2896 12.8261 12.3327C12.7295 12.3757 12.6249 12.3979 12.5192 12.3976ZM2.91824 5.73442V11.6035C2.91585 11.7556 2.97375 11.9024 3.07929 12.012C3.18482 12.1216 3.32942 12.1849 3.4815 12.1882H12.5192C12.8669 12.1882 13.0823 11.8848 13.0823 11.6036V5.73442H2.91824ZM13.3077 5.06158H2.7092V2.31454C2.71068 2.11326 2.78614 1.91955 2.92121 1.7703C2.9917 1.69147 3.07809 1.62846 3.1747 1.58542C3.2713 1.54238 3.37592 1.52029 3.48168 1.5206H7.42346C7.90349 1.5206 8.34688 1.87604 8.81626 2.25225C9.38895 2.71134 10.0377 3.23168 10.8877 3.23168H12.5352C12.7428 3.23498 12.9406 3.32037 13.0854 3.46916C13.2302 3.61794 13.3102 3.81802 13.3079 4.02562L13.3077 5.06158ZM2.91859 4.85219H13.0983V4.02562C13.1006 3.87355 13.0427 3.72673 12.9372 3.61721C12.8317 3.50769 12.6871 3.44437 12.535 3.44107H10.8875C9.96425 3.44107 9.2846 2.8963 8.68505 2.41557C8.22613 2.04774 7.83003 1.72999 7.42329 1.72999H3.4815C3.13374 1.72999 2.91842 2.03344 2.91842 2.31454L2.91859 4.85219Z"
                    fill="#777F97"
                  />
                </svg>
              </i>
              <span className={classes.folderDesc}>新建文件夹</span>
            </div>
          </div> */}
        </Sider>
        <Content className={classes.container}>
          {/* <div className={classes.operateTitle}>
            <div
              className={classes.backBox}
              onClick={() => {
                history.push(`/app/${appId}/detail`);
              }}
            >
              <i className={classes.backIcon}>
                <svg
                  width="15"
                  height="14"
                  viewBox="0 0 15 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.00888263 6.85065C0.0371044 6.63879 0.137875 6.44512 0.292205 6.30615L6.07533 0.211178C6.23474 0.0672995 6.43979 -0.0078825 6.64952 0.000654977C6.85924 0.00919246 7.05818 0.100821 7.20659 0.25723C7.35499 0.413639 7.44194 0.623309 7.45004 0.844341C7.45814 1.06537 7.3868 1.28148 7.25028 1.44949L2.84211 6.09537H14.1667C14.3877 6.09537 14.5997 6.1879 14.7559 6.3526C14.9122 6.5173 15 6.74068 15 6.97361C15 7.20653 14.9122 7.42991 14.7559 7.59461C14.5997 7.75932 14.3877 7.85184 14.1667 7.85184H2.84211L7.25028 12.4977C7.32798 12.579 7.38972 12.6757 7.43198 12.7821C7.47424 12.8886 7.49618 13.0028 7.49657 13.1182C7.49696 13.2336 7.47577 13.3479 7.43423 13.4547C7.39269 13.5614 7.3316 13.6585 7.25445 13.7404C7.1773 13.8223 7.0856 13.8874 6.9846 13.9319C6.88359 13.9765 6.77524 13.9996 6.66575 14C6.55626 14.0004 6.44776 13.9781 6.34646 13.9343C6.24515 13.8905 6.15302 13.8261 6.07533 13.7448L0.242207 7.59715C0.15092 7.50041 0.0822979 7.38257 0.0417943 7.25298C0.00129071 7.12339 -0.00997823 6.98563 0.00888263 6.85065Z"
                    fill="#333333"
                  />
                </svg>
              </i>
              <div className={classes.backDesc}>返回应用访问</div>
            </div>
          </div> */}
          <div className={classes.operateGroup}>
            <div className={classes.btnGroup}>
              {isShowNewFormBtn ? (
                <div
                  className={classes.newForm}
                  onClick={e => {
                    modalProps.showModal();
                  }}
                >
                  <div className={classes.formContent}>
                    <div className={classes.formSvg}>
                      <svg
                        width="78"
                        height="70"
                        viewBox="0 0 78 70"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect width="68" height="70" rx="5" fill="#D4E6FF" />
                        <rect
                          x="8"
                          y="19"
                          width="27"
                          height="5"
                          fill="#2A7EFF"
                        />
                        <rect
                          x="8"
                          y="44"
                          width="42"
                          height="5"
                          fill="#2A7EFF"
                        />
                        <rect
                          x="8"
                          y="32"
                          width="27"
                          height="5"
                          fill="#B0D0FF"
                        />
                        <circle cx="63" cy="15" r="15" fill="white" />
                        <circle cx="63" cy="15" r="12" fill="#2A7EFF" />
                        <rect
                          x="56"
                          y="14"
                          width="14"
                          height="2"
                          fill="white"
                        />
                        <rect
                          x="62"
                          y="22"
                          width="14"
                          height="2"
                          transform="rotate(-90 62 22)"
                          fill="white"
                        />
                      </svg>
                    </div>
                    <div className={classes.formDesc}>新建表单</div>
                  </div>
                </div>
              ) : null}
              <div
                className={classes.newDashBoard}
                onClick={e => {
                  createDashboard();
                }}
              >
                <div className={classes.dashBoardContent}>
                  <div className={classes.dashboardSvg}>
                    <svg
                      width="80"
                      height="70"
                      viewBox="0 0 80 70"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect width="68" height="70" rx="5" fill="#FFE3B8" />
                      <path
                        d="M17.5 17V26.1C17.5 26.94 18.06 27.5 18.9 27.5H28C28 33.24 23.24 38 17.5 38C11.76 38 7 33.24 7 27.5C7 21.76 11.76 17 17.5 17Z"
                        fill="#FFA11A"
                      />
                      <path
                        d="M19 16C24.5714 16 29 20.4286 29 26H19V16Z"
                        fill="#FFC775"
                      />
                      <rect
                        x="20"
                        y="62"
                        width="18"
                        height="5"
                        transform="rotate(-90 20 62)"
                        fill="#FFB549"
                      />
                      <rect
                        x="55"
                        y="62"
                        width="15"
                        height="5"
                        transform="rotate(-90 55 62)"
                        fill="#FFD89F"
                      />
                      <rect
                        x="43"
                        y="62"
                        width="22"
                        height="5"
                        transform="rotate(-90 43 62)"
                        fill="#FFB13F"
                      />
                      <rect
                        x="32"
                        y="62"
                        width="9"
                        height="5"
                        transform="rotate(-90 32 62)"
                        fill="#FFD89F"
                      />
                      <rect
                        x="8"
                        y="62"
                        width="12"
                        height="5"
                        transform="rotate(-90 8 62)"
                        fill="#FFD89F"
                      />
                      <circle cx="65" cy="15" r="15" fill="white" />
                      <circle cx="65" cy="15" r="12" fill="#FFA82A" />
                      <rect x="58" y="14" width="14" height="2" fill="white" />
                      <rect
                        x="64"
                        y="22"
                        width="14"
                        height="2"
                        transform="rotate(-90 64 22)"
                        fill="white"
                      />
                    </svg>
                  </div>
                  <div className={classes.dashboardDesc}>新建仪表盘</div>
                </div>
              </div>
            </div>
          </div>
        </Content>
      </Layout>
    </Authenticate>
  );
};
export default connect(
  ({ app, login }) => ({
    appList: app.appList,
    teamId: login.currentCompany && login.currentCompany.id,
    permissions: (login.userDetail && login.userDetail.permissions) || [],
    userDetail: login.userDetail
  }),
  {
    setAllForms,
    newDashboard,
    setDB,
    setDashboards
  }
)(AppSetting);
