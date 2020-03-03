import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Button, Row, Col, Table, Popconfirm, message, Spin } from "antd";
import Filter from "./Filter";
import ChangeGroup from "./ChangeGroup";
import classes from "./team.module.scss";
import request from "../../utils/request";
import InviteUser from "../userManagement/inviteUser";
import { getCurrentTeam } from "../../store/loginReducer";

export default connect(
  ({ login }) => ({
    loginData: login
  }),
  { getCurrentTeam }
)(function TeamMember({ loginData, getCurrentTeam }) {
  const [teamId] = React.useState(loginData.currentTeam.id);
  const [isShow, setIsShow] = React.useState(false); //筛选的显示开关
  const [changeGroup, setChangeGroup] = React.useState(false); //变更分组模态框显示开关
  const [data, setData] = React.useState(null); //用户数据
  const [userKey, setUserKey] = React.useState(null); //变更分组用户的Id
  const [groupKey, setGroupKey] = React.useState(null); //变更分组用户的当前分组id
  const [onSwitch, setOnSwitch] = React.useState(null); //管理员操作按钮显示
  const [page, setPage] = React.useState(1); //页码
  const [total, setTotal] = React.useState(null); //数据总量
  const [size] = React.useState(5); //每页显示数量

  const columns = [
    {
      title: "姓名",
      dataIndex: "name"
    },
    {
      title: "邮箱",
      dataIndex: "email"
    },
    {
      title: "最后登录时间",
      dataIndex: "lastModifiedDate"
    },
    {
      title: "分组",
      dataIndex: "groupName"
    },
    {
      title: "操作",
      key: "action",
      render: (text, record) => {
        return text.group.name === "超级管理员" && onSwitch ? null : (
          <span>
            <Button
              type="link"
              onClick={handleChange.bind(this, text)}
              style={{ paddingLeft: "0" }}
            >
              变更分组
            </Button>
            <Popconfirm
              title="把该成员从团队中踢出?"
              onConfirm={confirm.bind(this, text.id)}
              onCancel={cancel}
              okText="确认"
              cancelText="取消"
              placement="bottom"
            >
              <Button type="link">踢出</Button>
            </Popconfirm>
          </span>
        );
      }
    }
  ];
  const confirm = sysUserId => {
    request(`/sysUser/${sysUserId}/team`, {
      method: "PUT",
      data: { oldTeamId: teamId }
    })
      .catch(err => {
        message.success("失败");
      })
      .then(async res => {
        const newData = await request(`/sysUser/currentTeam/all`, {
          method: "POST",
          data: { page: page, size: size }
        });
        if (Math.ceil(newData.data.total / size) < page) {
          setPage(Math.ceil(newData.data.total / size));
        }
        setData(newData.data.datas);
        setTotal(newData.data.total);
        message.success("成功");
      });
  };

  const cancel = e => {
    message.error("失败");
  };

  // 过滤
  const onClickFilter = () => {
    setIsShow(!isShow);
  };
  const filterData = value => {
    setData(value);
  };

  const handleChange = (obj, e) => {
    setGroupKey(obj.group.id);
    setUserKey(obj.id);
    setChangeGroup(!changeGroup);
  };

  // 变更分组后的回调
  const changeGroupCal = async () => {
    await getCurrentTeam();
    await gainData();
    setChangeGroup(!changeGroup);
  };

  const onChangePage = e => {
    setPage(e);
  };

  //获取成员
  const gainData = async () => {
    const res = await request(`/sysUser/currentTeam/all`, {
      method: "POST",
      data: { page: page, size }
    });
    res.data.datas.forEach(item => {
      item.key = item.id;
      item.lastModifiedDate = new Date().toLocaleString(item.lastModifiedDate);
      item.groupName = item.group.name;
    });
    setTotal(res.data.total);
    setData(res.data.datas);
  };
  useEffect(() => {
    setOnSwitch(
      loginData.currentTeam.groups.filter(item => {
        return item.name === "超级管理员";
      })[0].peopleNumber === 1
        ? true
        : false
    );
  }, [loginData]);
  useEffect(() => {
    gainData();
  }, [page]);
  return data ? (
    <div className={classes.container}>
      <Row type="flex" justify="space-between" className={classes.box}>
        <Col>
          <InviteUser {...loginData} />
        </Col>
        <Col>
          <Button
            size="large"
            type="link"
            icon="filter"
            onClick={onClickFilter}
          >
            筛选
          </Button>
        </Col>
      </Row>
      {isShow ? <Filter fn={filterData} /> : null}
      <Table
        pagination={{ total, pageSize: size, onChange: onChangePage }}
        columns={columns}
        dataSource={data}
      />
      {changeGroup ? (
        <ChangeGroup
          groups={loginData.currentTeam.groups}
          groupKey={groupKey}
          userKey={userKey}
          visible={changeGroup}
          fn={changeGroupCal}
        />
      ) : null}
    </div>
  ) : (
    <Spin size="large" />
  );
});
