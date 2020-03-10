import React, { useEffect, useCallback } from "react";
import { connect } from "react-redux";
import { Button, Row, Col, Table, Popconfirm, message, Spin } from "antd";
import Filter from "./Filter";
import ChangeGroup from "./ChangeGroup";
import classes from "./team.module.scss";
import request from "../../../utils/request";
import { getCurrentTeam } from "../../../store/loginReducer";
import InviteUser from "../modalInviteUser";
import Authenticate from "../../shared/Authenticate";
import {
  TEAM_MANAGEMENT_INVITE,
  TEAM_MANAGEMENT_DROP,
  TEAM_MANAGEMENT_SWITCH
} from "../../../auth";

export default connect(
  ({ login }) => ({
    loginData: login
  }),
  { getCurrentTeam }
)(function TeamMember({ loginData, getCurrentTeam }) {
  const { currentTeam } = loginData;
  const [data, setData] = React.useState(null); //用户数据
  const [total, setTotal] = React.useState(null);
  const [onOff, setOnOff] = React.useState({
    filterSwith: false, //筛选的显示开关
    changeGroupSwitch: false //变更分组模态框显示开关
  });
  const [key, setKey] = React.useState({
    userKey: null, //变更分组用户的Id
    groupKey: null //变更分组用户的当前分组id
  });
  const [pageConfig, setPageConfig] = React.useState({
    currentPage: 1,
    pageSize: 1
  });
  const columns = [
    {
      title: "姓名",
      dataIndex: "name",
      width: 100
    },
    {
      title: "邮箱",
      dataIndex: "email",
      width: 200
    },
    {
      title: "最后登录时间",
      dataIndex: "lastModifiedDate",
      width: 200
    },
    {
      title: "分组",
      dataIndex: "groupName",
      width: 200
    },
    {
      title: "操作",
      key: "action",
      width: 200,
      render: (text, record) => {
        return text.group.name === "超级管理员" &&
          currentTeam.groups.filter(item => {
            return item.name === "超级管理员";
          })[0].peopleNumber === 1 ? (
          true
        ) : false ? null : (
          <span>
            <Authenticate auth={TEAM_MANAGEMENT_SWITCH}>
              <Button
                type="link"
                onClick={handleChange.bind(this, text)}
                style={{ paddingLeft: "0" }}
              >
                变更分组
              </Button>
            </Authenticate>
            <Authenticate auth={TEAM_MANAGEMENT_DROP}>
              <Popconfirm
                title="把该成员从团队中踢出?"
                onConfirm={confirm.bind(this, text.id)}
                okText="确认"
                cancelText="取消"
                placement="bottom"
              >
                <Button type="link">踢出</Button>
              </Popconfirm>
            </Authenticate>
          </span>
        );
      }
    }
  ];
  //获取成员
  const gainData = useCallback(() => {
    request(`/sysUser/currentTeam/all`, {
      method: "POST",
      data: { page: pageConfig.currentPage, size: pageConfig.pageSize }
    })
      .then(res => {
        res.data.datas.forEach(item => {
          item.key = item.id;
          item.lastModifiedDate = new Date().toLocaleString(
            item.lastModifiedDate
          );
          item.groupName = item.group.name;
        });
        setData(res.data.datas);
        setTotal(res.data.total);
      })
      .catch(err => {
        message.error("成员获取失败");
        return currentTeam.id;
      });
  }, [pageConfig, currentTeam.id]);
  //踢出成员
  const confirm = sysUserId => {
    request(`/sysUser/${sysUserId}/team`, {
      method: "PUT",
      data: { oldTeamId: currentTeam.id }
    })
      .then(res => {
        if (
          pageConfig.currentPage >
          Math.ceil(
            (total - 1) / pageConfig.pageSize && pageConfig.currentPage !== 0
          )
        ) {
          setPageConfig({
            ...pageConfig,
            currentPage: pageConfig.currentPage - 1
          });
        } else {
          gainData();
        }
        message.success("成功");
        getCurrentTeam();
      })
      .catch(err => {
        message.error("踢出失败");
      });
  };
  // 过滤
  const onClickFilter = () => {
    setOnOff({
      ...onOff,
      filterSwith: !onOff.filterSwith
    });
  };
  const filterData = value => {
    setData(value);
  };
  //变更分组
  const handleChange = (obj, e) => {
    setKey({
      userKey: obj.id,
      groupKey: obj.group.id
    });
    setOnOff({
      ...onOff,
      changeGroupSwitch: !onOff.actionSwitch
    });
  };
  // 提交变更分组
  const changeGroupCal = groupKey => {
    if (groupKey) {
      request(`/sysUser/${key.userKey}/group`, {
        method: "PUT",
        data: { oldGroupId: key.groupKey, newGroupId: groupKey }
      })
        .then(res => {
          gainData();
          message.success("成功");
          getCurrentTeam();
        })
        .catch(err => {
          message.error("变更失败");
        });
    }
    setOnOff({
      ...onOff,
      changeGroupSwitch: !onOff.changeGroupSwitch
    });
  };
  //点击页码
  const onChangePage = e => {
    setPageConfig({
      ...pageConfig,
      currentPage: e
    });
  };
  //获取当前team只调用一次
  useEffect(() => {
    getCurrentTeam();
  }, [getCurrentTeam]);
  //初次改变页码获取成员
  useEffect(() => {
    gainData();
  }, [gainData]);

  return currentTeam ? (
    <div className={classes.container}>
      <Row type="flex" justify="space-between" className={classes.box}>
        <Col>
          <div className={classes.title}>团队成员</div>
        </Col>
        <Col>
          <Authenticate auth={TEAM_MANAGEMENT_INVITE}>
            <InviteUser {...loginData} />
          </Authenticate>
          <Button
            style={{ backgroundColor: "#ffffff" }}
            type="link"
            icon="filter"
            onClick={onClickFilter}
          >
            筛选
          </Button>
        </Col>
      </Row>
      {onOff.filterSwith ? <Filter fn={filterData} /> : null}
      <div className={classes.tableBox}>
        <Table
          pagination={{
            total: total,
            pageSize: pageConfig.pageSize,
            onChange: onChangePage
          }}
          columns={columns}
          dataSource={data}
          rowClassName={classes.rowKey}
        />
      </div>
      {onOff.changeGroupSwitch ? (
        <ChangeGroup
          groups={currentTeam.groups}
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
