import React, { useEffect, useCallback } from "react";
import { connect } from "react-redux";
import { Button, Popconfirm, message, Spin } from "antd";
import { Table } from "../../shared/customWidget";
import Filter from "./Filter";
import ChangeGroup from "./ChangeGroup";
import classes from "./team.module.scss";
import request from "../../../utils/request";
import { getcurrentCompany } from "../../../store/loginReducer";
import InviteUser from "../ModalInviteUser";
import Authenticate from "../../shared/Authenticate";
import { HomeContentTitle } from "../../shared/";
import { catchError } from "../../../utils";
// import { ReactComponent as Funnel } from "../../../assets/icons/company/filter.svg";
import {
  TEAM_MANAGEMENT_INVITE,
  TEAM_MANAGEMENT_DROP,
  TEAM_MANAGEMENT_SWITCH,
} from "../../../auth";

export default connect(
  ({ login }) => ({
    loginData: login,
  }),
  { getcurrentCompany }
)(function TeamMember({ loginData, getcurrentCompany }) {
  const { currentCompany } = loginData;
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState(null); //用户数据
  const [total, setTotal] = React.useState(null);
  const [onOff, setOnOff] = React.useState({
    filterSwith: true, //筛选的显示开关
    changeGroupSwitch: false, //变更分组模态框显示开关
  });
  const [key, setKey] = React.useState({
    userKey: null, //变更分组用户的Id
    groupKey: null, //变更分组用户的当前分组id
  });
  const [pageConfig, setPageConfig] = React.useState({
    currentPage: 1,
    pageSize: 10,
  });
  const [filterConditions, setFilterConditions] = React.useState([]);
  const columns = [
    {
      title: "用户昵称",
      dataIndex: "name",
      width: 150,
    },
    {
      title: "邮箱",
      dataIndex: "email",
      width: 200,
    },
    {
      title: "最后登录时间",
      dataIndex: "lastLoginDate",
      width: 200,
    },
    {
      title: "职位",
      dataIndex: "position",
      width: 200,
    },
    {
      title: "分组",
      dataIndex: "groupName",
      width: 200,
    },
    {
      title: "操作",
      key: "action",
      width: 200,
      render: (text, record) => {
        return text.group.name === "超级管理员" &&
          currentCompany.groups.filter((item) => {
            return item.name === "超级管理员";
          })[0].peopleNumber === 1 ? (
          true
        ) : false ? null : (
          <span>
            <Authenticate auth={TEAM_MANAGEMENT_SWITCH}>
              <Button
                type="link"
                onClick={handleChange.bind(this, text)}
                className={classes.changeGroup}
              >
                变更分组
              </Button>
            </Authenticate>
            <Authenticate auth={TEAM_MANAGEMENT_DROP}>
              <Popconfirm
                title="把该成员从公司中踢出?"
                onConfirm={confirm.bind(this, text.id)}
                okText="确认"
                cancelText="取消"
                placement="top"
              >
                <Button type="link">踢出</Button>
              </Popconfirm>
            </Authenticate>
          </span>
        );
      },
    },
  ];
  //获取成员
  const gainData = useCallback(async () => {
    setLoading(true);
    const loadingTimeout = () =>
      setTimeout(() => {
        setLoading(false);
      }, 500);
    await request(`/sysUser/currentCompany/all`, {
      method: "POST",
      data: {
        page: pageConfig.currentPage,
        size: pageConfig.pageSize,
        fields: filterConditions,
      },
    })
      .then((res) => {
        if (res && res.status === "SUCCESS") {
          res.data.datas.forEach((item) => {
            item.key = item.id;
            item.lastLoginDate = item.lastLoginDate
              ? new Date(item.lastLoginDate).toLocaleString()
              : null;
            item.groupName = item.group.name;
            item.position = item.position.value;
          });
          setData(res.data.datas);
          setTotal(res.data.total);
        } else {
          message.error(res.msg || "成员获取失败！");
        }
        loadingTimeout();
      })
      .catch((err) => {
        loadingTimeout();
        catchError(err);
        return currentCompany.id;
      });
    return clearTimeout(loadingTimeout());
  }, [pageConfig, filterConditions, currentCompany.id]);
  //踢出成员
  const confirm = (sysUserId) => {
    request(`/sysUser/${sysUserId}/company`, {
      method: "PUT",
      data: { oldCompanyId: currentCompany.id },
    })
      .then((res) => {
        if (res && res.status === "SUCCESS") {
          if (
            pageConfig.currentPage >
            Math.ceil(
              (total - 1) / pageConfig.pageSize && pageConfig.currentPage !== 0
            )
          ) {
            setPageConfig({
              ...pageConfig,
              currentPage: pageConfig.currentPage - 1,
            });
          } else {
            gainData();
          }
          getcurrentCompany();
          message.success("踢出成功");
        } else {
          message.error(res.msg || "踢出失败");
        }
      })
      .catch((err) => catchError(err));
  };
  // 过滤组件开关显示
  // const onClickFilter = () => {
  //   setOnOff({
  //     ...onOff,
  //     filterSwith: !onOff.filterSwith,
  //   });
  // };
  //过滤请求参数设置
  const filterData = (value, groupId) => {
    const _fiels = [];
    _fiels[0] = value
      ? {
          conditions: [
            { negative: false, rule: "LK", value },
            { negative: false, rule: "LK", value },
          ],
          properties: ["email", "name"],
        }
      : null;
    _fiels[1] = groupId
      ? {
          conditions: [{ negative: false, rule: "EQ", value: groupId }],
          properties: ["sysRoles.id"],
        }
      : null;
    const _newFiels = _fiels.filter((item) => item !== null);
    setFilterConditions(_newFiels);
  };
  //变更分组
  const handleChange = (obj, e) => {
    setKey({
      userKey: obj.id,
      groupKey: obj.group.id,
    });
    setOnOff({
      ...onOff,
      changeGroupSwitch: !onOff.actionSwitch,
    });
  };
  // 提交变更分组
  const changeGroupCal = async (groupKey) => {
    if (groupKey) {
      await request(`/sysUser/${key.userKey}/group`, {
        method: "PUT",
        data: { oldGroupId: key.groupKey, newGroupId: groupKey },
      })
        .then((res) => {
          if (res && res.status === "SUCCESS") {
            gainData();
            getcurrentCompany();
            message.success("变更成功");
          } else {
            message.error(res.msg || "变更失败");
          }
        })
        .catch((err) => catchError(err));
    }
    setOnOff({
      ...onOff,
      changeGroupSwitch: !onOff.changeGroupSwitch,
    });
  };
  //点击页码
  const onChangePage = (e) => {
    setPageConfig({
      ...pageConfig,
      currentPage: e,
    });
  };

  //获取当前company只调用一次
  useEffect(() => {
    getcurrentCompany();
  }, [getcurrentCompany]);
  //初次改变页码获取成员
  useEffect(() => {
    gainData();
  }, [gainData]);
  const btns = (
    <>
      <Authenticate auth={TEAM_MANAGEMENT_INVITE}>
        <InviteUser {...loginData} />
      </Authenticate>
      {/* <Button className={classes.filterBtn} type="link" onClick={onClickFilter}>
        <Funnel className={classes.filterSvg} />
        筛选
      </Button> */}
    </>
  );
  return currentCompany ? (
    <div className={classes.container}>
      <HomeContentTitle title={"公司成员"} btns={btns} />
      {onOff.filterSwith ? (
        <Filter groups={currentCompany.groups} fn={filterData} />
      ) : null}
      <div className={classes.tableBox}>
        <Table
          pagination={{
            total: total,
            pageSize: pageConfig.pageSize,
            onChange: onChangePage,
          }}
          loading={loading}
          columns={columns}
          dataSource={data}
          rowClassName={classes.rowKey}
        />
      </div>
      {onOff.changeGroupSwitch ? (
        <ChangeGroup
          groups={currentCompany.groups}
          groupKey={key.groupKey}
          visible={onOff.changeGroupSwitch}
          fn={changeGroupCal}
        />
      ) : null}
    </div>
  ) : (
    <Spin size="large" />
  );
});
