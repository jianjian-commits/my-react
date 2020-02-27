import React, { useEffect } from "react";
import {
  Button,
  Row,
  Col,
  Table,
  Popconfirm,
  message,
  Modal,
  Input,
  Spin
} from "antd";
import Filter from "./Filter";
import ChangeGroup from "./ChangeGroup";
import classes from "./team.module.scss";
import request from "../../utils/request";

const TeamMember = () => {
  const [isShow, setIsShow] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const [changeGroup, setChangeGroup] = React.useState(false);
  const [data, setData] = React.useState(null);
  const [userKey, setUserKey] = React.useState(null);
  const [onSwitch, setOnSwitch] = React.useState(0)
  const [page, setPage] = React.useState(1)
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
      dataIndex: "group"
    },
    {
      title: "操作",
      key: "action",
      render: (text, record) => {
        console.log(text)
        return text.group === "管理员" && onSwitch ? null : (
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
    request('/team/5e578830149d3d1d6cb681b6', { method: 'DELETE', data: { sysUserId } })
      .catch(err => {message.success("失败")}).then(res => {message.success("成功")})
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

  const onChangePage = page => {
    setPage(page)
  }

  //获取成员
  useEffect(() => {
    const gainData = async (page, size = 10) => {
      const res = await request('/sysUser/team/5e578830149d3d1d6cb681b6', { method: 'POST', data: { page, size } })
      console.log(res)
      res.data.datas.forEach(item => {
        item.key = item.id
      })
      setOnSwitch(res.data.datas.filter(item => {
        return item.group === "管理员";
      }).length === 1
        ? true
        : false)
      setData(res.data.datas)
    }
    gainData()
  }, [page])
  return (
    data ? <div className={classes.container}>
      <Row type="flex" justify="space-between" className={classes.box}>
        <Col>
          <Button size="large" onClick={showModalInvite}>
            邀请
          </Button>
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
      <Table pagination={{ onChange: onChangePage.bind(this, page) }} columns={columns} dataSource={data} />
      {/* //邀请模态框 */}
      <Modal
        title="邀请新成员加入"
        visible={visible}
        footer={null}
        onCancel={handleCancel}
      >
        <p>发送以下链接给新成员，点击连接即可加入团队</p>
        <Row type="flex" gutter={10} style={{ padding: "15px 0" }}>
          <Col>
            <Input readOnly value="https://localhost/null" />
          </Col>
          <Col>
            <Button>复制链接</Button>
          </Col>
        </Row>
        <p>邀请链接14天有效</p>
      </Modal>
      {changeGroup ? (
        <ChangeGroup
          userKey={userKey}
          visible={changeGroup}
          fn={handleChange}
        />
      ) : null}
    </div> : <Spin size="large" />
  );
};
export default TeamMember;
