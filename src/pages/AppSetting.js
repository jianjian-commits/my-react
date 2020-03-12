import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Layout, Input, Button, Icon } from "antd";
import { useParams, useHistory } from "react-router-dom";
import { getFormsAll } from "../components/formBuilder/component/homePage/redux/utils/operateFormUtils";
import CommonHeader from "../components/header/CommonHeader";
import DraggableList, {
  DropableWrapper
} from "../components/shared/DraggableList";

import classes from "../styles/apps.module.scss";
import ForInfoModal from "../components/formBuilder/component/formInfoModal/formInfoModal";
const { Content, Sider } = Layout;

const navigationList = (history, appId, appName) => [
  { key: 0, label: "我的应用", onClick: () => history.push("/app/list") },
  {
    key: 1,
    label: `${appName}`,
    onClick: () => history.push(`/app/${appId}/detail`)
  },
  { key: 1, label: "应用设置", disabled: true }
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
  const [user,setUser] = React.useState('')

  let { groups, list, searchList } = mockForms;
  useEffect(() => {
    let newList = [];

    setUser(JSON.parse(localStorage.getItem("userDetail")))

    getFormsAll(appId).then(res => {
      newList = res.map(item => ({
        key: item.id,
        name: item.name
      }));

       setMockForms({
        groups: [
        ],
        searchList: [
        ],
        list: newList
      });

    });
  }, []);

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
    console.log(e);
    const { value } = e.target;
    setSearchKey(value);
  };

  const addFolder = () => alert("没用的");
  const dragFileToFolder = (formId, groupId) => {
    alert(formId + " 放进 " + groupId);
  };

  // 处理点击表单名字事件
  const formEnterHandle = e => {
    if (list[0].key !== "") {
      history.push(`/app/${appId}/setting/form/${e.key}/edit?formId=${e.key}`);
    }
  };

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

  return (
    <Layout>
      <ForInfoModal
        key={Math.random()}
        {...modalProps}
        extraProp={{ user: { id: user.id, name: user.name } }}
        appid = { appId }
        url={`/app/${appId}/setting/form/`}
      />
      <CommonHeader navigationList={navigationList(history, appId, appName)} />
      <Layout>
        <Sider className={classes.appSider} theme="light">
          <div className={classes.newForm}>
            <Button
              type="primary"
              block
              onClick={e => {
                modalProps.showModal();
              }}
            >
              新建表单
            </Button>
          </div>
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
              draggable={!searchKey}
              onClick={formEnterHandle}
              groups={groups}
              list={list}
              onDrop={dragFileToFolder}
            />
            <DropableWrapper
              className={classes.empty}
              onDrop={e =>
                dragFileToFolder(e.dataTransfer.getData("formId"), null)
              }
            ></DropableWrapper>
          </div>
        </Sider>
        <Content className={classes.container}></Content>
      </Layout>
    </Layout>
  );
};
export default connect(({ app }) => ({
  appList: app.appList
}))(AppSetting);
