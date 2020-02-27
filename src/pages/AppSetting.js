import React, { useEffect } from "react";
import { Layout, Input, Button, Icon } from "antd";
import { useParams, useHistory } from "react-router-dom";
import request from "../utils/request";
import CommonHeader from "../components/header/CommonHeader";
import DraggableList, {
  DropableWrapper
} from "../components/shared/DraggableList";

import classes from "../styles/apps.module.scss";
const { Content, Sider } = Layout;

const navigationList = (history, appId) => [
  { key: 0, label: "我的应用", onClick: () => history.push("/app/list") },
  {
    key: 1,
    label: "13号Devinci应用",
    onClick: () => history.push(`/app/${appId}/detail`)
  },
  { key: 1, label: "应用设置", disabled: true }
];

// const mockForms = {
//   groups: [
// {
//   name: "基础设置",
//   key: "base",
//   list: [
//     { key: "sWw", name: "车队信息" },
//     { key: "clr", name: "油卡信息" },
//     { key: "CrE", name: "车辆信息" }
//   ]
// },
// {
//   name: "用车管理",
//   key: "use",
//   list: [
//     { key: "short", name: "短途申请" },
//     { key: "long", name: "长途用车申请" }
//   ]
// },
// {
//   name: "违章管理",
//   key: "ban",
//   list: [
//     { key: "aban", name: "违章记录" },
//     { key: "handle", name: "违章处理记录" }
//   ]
// }
// ],
// list: [
// { key: "short", name: "短途申请" },
// { key: "long", name: "长途用车申请" }
//   ]
// };

const AppSetting = () => {
  const { appId } = useParams();
  const history = useHistory();
  const [searchKey, setSearchKey] = React.useState(null);
  const [mockForms, setMockForms] = React.useState({ groups: [], list: [] });

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

  if (searchKey) {
    const all = groups.reduce((acc, e) => acc.concat(e.list), []).concat(list);
    groups = null;
    list = all.filter(i => i.name.indexOf(searchKey) !== -1);
    if (list.length === 0) {
      list = [{ key: "", name: "暂无匹配项" }];
    }
  }

  const searchHandle = e => {
    const { value } = e.target;
    setSearchKey(value);
  };

  const addFolder = () => alert("没用的");
  const dropHandle = (formId, groupId) => {
    alert(formId + " 放进 " + groupId);
  };

  const formEnterHandle = e => {
    if (list[0].key !== "") {
      history.push(`/app/${appId}/setting/form/${e.key}/edit?formId=${e.key}`);
    }
  };

  return (
    <Layout>
      <CommonHeader navigationList={navigationList(history, appId)} />
      <Layout>
        <Sider className={classes.appSider} theme="light">
          <div className={classes.newForm}>
            <Button
              type="primary"
              block
              onClick={e => {
                // history.push(`/app/${appId}/setting/form/create`)

                if (list[0].key !== "") {
                  history.push(`/app/${appId}/setting/form/sWw/edit`);
                }
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
              onDrop={dropHandle}
            />
            <DropableWrapper
              className={classes.empty}
              onDrop={e => dropHandle(e.dataTransfer.getData("formId"), null)}
            ></DropableWrapper>
          </div>
        </Sider>
        <Content className={classes.container}></Content>
      </Layout>
    </Layout>
  );
};
export default AppSetting;
