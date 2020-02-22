import React from "react";
import {
  Button,
  Row,
  Col,
  Table,
  Popconfirm,
  message,
  Modal,
  Input
} from "antd";
import initData from "./mockMember";
import Filter from "./Filter";
import ChangeGroup from "./ChangeGroup";
import classes from "./team.module.scss";

const TeamMember = () => {
  const [isShow, setIsShow] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const [changeGroup, setChangeGroup] = React.useState(false);
  const [data, setData] = React.useState(initData);
  const [userKey, setUserKey] = React.useState(null);
  //判断管理员的个数及是否有操作按钮
  const onSwitch =
    initData.filter(item => {
      return item.group === "管理员";
    }).length === 1
      ? true
      : false;
  const columns = [
    {
      title: "姓名",
      dataIndex: "name"
    },
    {
      title: "用户名",
      dataIndex: "nickname"
    },
    {
      title: "邮箱",
      dataIndex: "mail"
    },
    {
      title: "最后登录时间",
      dataIndex: "lastLogin"
    },
    {
      title: "分组",
      dataIndex: "group"
    },
    {
      title: "操作",
      key: "action",
      render: (text, record) => {
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
              onConfirm={confirm}
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
  const confirm = e => {
    message.success("成功");
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
    // console.log(e)
    // console.log(value)
    setUserKey(value);
    setChangeGroup(!changeGroup);
  };

  return (
    <div className={classes.container}>
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
      <Table pagination={false} columns={columns} dataSource={data} />
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
    </div>
  );
};
export default TeamMember;
