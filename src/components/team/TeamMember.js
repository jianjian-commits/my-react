import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Button, Row, Col, Table, Popconfirm, message, Spin } from "antd";
import Filter from "./Filter";
import ChangeGroup from "./ChangeGroup";
import classes from "./team.module.scss";
import request from "../../utils/request";
import InviteUser from "../userManagement/inviteUser";

export default connect(({ login }) => ({
  loginData: login
}))(function TeamMember({ loginData }) {
  const [teamId, setTeamId] = React.useState(loginData.currentTeam.id);
  const [isShow, setIsShow] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const [changeGroup, setChangeGroup] = React.useState(false);
  const [data, setData] = React.useState(null);
  const [userKey, setUserKey] = React.useState(null);
  const [onSwitch, setOnSwitch] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(null);
  //判断管理员的个数及是否有操作按钮
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
        // console.log(text)
        return text.groupName === "超级管理员" && onSwitch ? null : (
          <span>
            <Button
              type="link"
              onClick={handleChange.bind(this, text.name)}
              style={{ paddingLeft: "0" }}
            >
              变更分组
            </Button>
            <Popconfirm
              title="把改成员从团队中踢出?"
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
    request(`/team/${teamId}`, { method: "DELETE", data: { sysUserId } })
      .catch(err => {
        message.success("失败");
      })
      .then(async res => {
        console.log(data);
        const newData = await request(`/sysUser/team/${teamId}`, {
          method: "POST",
          data: { page: page, size: 2 }
        });
        if (Math.ceil(newData.data.total / 2) < page) {
          setPage(Math.ceil(newData.data.total / 2));
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
  // 邀请模态框
  const showModalInvite = () => {
    setVisible(true);
  };
  const handleCancel = () => {
    setVisible(false);
  };

  const handleChange = (value, e) => {
    setUserKey(value);
    setChangeGroup(!changeGroup);
  };

  const onChangePage = e => {
    setPage(e);
  };

  //获取成员
  useEffect(() => {
    const gainData = async (size = 2) => {
      const res = await request(`/sysUser/team/${teamId}`, {
        method: "POST",
        data: { page: page, size }
      });
      res.data.datas.forEach(item => {
        item.key = item.id;
        item.lastModifiedDate = new Date().toLocaleString(
          item.lastModifiedDate
        );
      });
      setOnSwitch(
        res.data.datas.filter(item => {
          return item.groupName === "超级管理员";
        }).length === 1
          ? true
          : false
      );
      setTotal(res.data.total);
      setData(res.data.datas);
    };
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
        pagination={{ total: total, pageSize: 2, onChange: onChangePage }}
        columns={columns}
        dataSource={data}
      />
      {changeGroup ? (
        <ChangeGroup
          userKey={userKey}
          visible={changeGroup}
          fn={handleChange}
        />
      ) : null}
    </div>
  ) : (
    <Spin size="large" />
  );
});
