import React, { Component } from "react";
import { Button, Input, Radio, message, Modal, Popconfirm } from "antd";
import { Table } from "../../shared/customWidget";
import moment from "moment";
import { EditIcon } from "../../../assets/icons";
import { CreateIcon } from "../../../assets/icons/company";
import proClass from "../../profileManagement/profile.module.scss";
import { HomeContentTitle } from "../../shared";
import request from "../../../utils/request";
import { catchError } from "../../../utils";
import RelateWidage from "./RelateWidage";

export const BaseInfo = ({
  positionInfo,
  editing,
  updateBaseInfo,
  updateEditing,
}) => {
  const list = [
    { key: "value", label: "职位名称", value: positionInfo.value },
    {
      key: "superiorValue",
      label: "汇报上级",
      value: positionInfo.superiorValue,
    },
    {
      key: "dataShare",
      label: "是否与同时共享数据",
      value: positionInfo.dataShare,
    },
    { key: "description", label: "描述", value: positionInfo.description },
  ];
  const renderContent = (item) => {
    const editSwitchHandler = () => updateEditing(item.key, !editing[item.key]);
    const editUpdateHandler = (value) => updateBaseInfo(item.key, value);
    switch (item.key) {
      case "value":
        return editing[item.key] ? (
          <Input
            value={item.value}
            onBlur={editSwitchHandler}
            onChange={(e) => editUpdateHandler(e.target.value)}
          />
        ) : (
          <>
            <span>{item.value}</span>
            <EditIcon onClick={editSwitchHandler} />
          </>
        );
      case "dataShare":
        return (
          <Radio.Group
            onChange={(e) =>
              editUpdateHandler(e.target.value === 1 ? true : false)
            }
            value={item.value ? 1 : 2}
          >
            <Radio value={1}>共享</Radio>
            <Radio value={2}>不共享</Radio>
          </Radio.Group>
        );
      case "description":
        return editing[item.key] ? (
          <Input
            value={item.value}
            onBlur={editSwitchHandler}
            onChange={(e) => editUpdateHandler(e.target.value)}
          />
        ) : (
          <>
            <span>{item.value}</span>
            <EditIcon onClick={editSwitchHandler} />
          </>
        );
      default:
        return <span>{item.value}</span>;
    }
  };
  return (
    <div className={proClass.groupBasic}>
      <table>
        <tbody>
          {list.map((l) => (
            <tr key={l.key}>
              <td>{l.label}</td>
              <td>{renderContent(l)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const userSectionStyle = {
  display: "flex",
  marginTop: 15,
};
const userTitleStyle = {
  flex: 1,
  fontSize: "15px",
  margin: "30px 8px 17px 0",
  display: "inline-block",
  color: "#777f97",
};
const userButtonStyle = {
  flex: 1,
  textAlign: "right",
  lineHeight: "69px",
  marginRight: 10,
};

const RelateModal = ({
  visible,
  onOk,
  onCancel,
  positionId,
  allUsers,
  selectedKeys,
  updateSelectedKeys,
}) => {
  return (
    <Modal
      destroyOnClose={true}
      visible={visible}
      width="500px"
      title="关联用户"
      okText="确定"
      cancelText="取消"
      onOk={onOk}
      onCancel={onCancel}
      maskClosable={false}
      // className={classes.appModalStyles}
      closable={false}
    >
      <RelateWidage
        positionId={positionId}
        allUsers={allUsers}
        selectedKeys={selectedKeys}
        updateSelectedKeys={updateSelectedKeys}
      />
    </Modal>
  );
};

const UserRelation = ({
  open,
  openHandle,
  onOK,
  onCancel,
  users,
  positionId,
  allUsers,
  selectedKeys,
  updateSelectedKeys,
  removeUser,
}) => {
  const columns = [
    {
      title: "姓名",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "邮箱",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "加入时间",
      dataIndex: "entryDate",
      key: "entryDate",
    },
    {
      title: "操作",
      key: "action",
      render: (text, record) => (
        <div>
          <Popconfirm
            title="把该成员从公司中踢出?"
            onConfirm={() => removeUser(record.id)}
            okText="确认"
            cancelText="取消"
            placement="top"
          >
            <Button type="link">踢出</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];
  return (
    <div>
      <div style={userSectionStyle}>
        <div style={userTitleStyle}>
          <span>关联用户</span>
        </div>
        <div style={userButtonStyle}>
          <Button
            style={{ border: "1px solid rgb(42, 127, 255)", color: "#2a7fff" }}
            onClick={() => openHandle(true)}
          >
            <CreateIcon />
            添加关联
          </Button>
        </div>
      </div>
      <Table
        columns={columns}
        loading={false}
        dataSource={users}
        rowKey="id"
        pagination={false}
      ></Table>
      <RelateModal
        visible={open}
        positionId={positionId}
        allUsers={allUsers}
        onOk={onOK}
        onCancel={onCancel}
        updateSelectedKeys={updateSelectedKeys}
        selectedKeys={selectedKeys}
      />
    </div>
  );
};

class PositionDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      positionInfo: {
        value: "",
        superiorValue: "",
        dataShare: false,
        description: "",
      },
      editing: {
        value: false,
        description: false,
      },
      users: [],
      modalOpen: false,
      modalSelectedKeys: [],
    };
  }
  updateEditing = (key, value) => {
    this.setState((state) => {
      return {
        ...state,
        editing: {
          ...state.editing,
          [key]: value,
        },
      };
    });
  };
  updateBaseInfo = (key, value) => {
    this.setState((state) => {
      return {
        ...state,
        positionInfo: {
          ...state.positionInfo,
          [key]: value,
        },
      };
    });
  };
  updateTargetState = (key) => (value) => {
    this.setState({ [key]: value });
  };
  fetchBaseInfo = async () => {
    try {
      const res = await request(`/position/${this.props.position.id}`);
      if (res && res.status === "SUCCESS" && res.data) {
        this.setState({
          positionInfo: res.data,
        });
      } else {
        message.error(res.msg || "获取职位详情失败");
      }
    } catch (e) {
      catchError(e);
    }
  };
  fetchRelateUsers = async () => {
    try {
      const res = await request(`/position/${this.props.position.id}/user`);
      if (res && res.status === "SUCCESS") {
        this.setState({
          users: (res.data || []).map((e) => ({
            ...e,
            entryDate: moment(e.entryDate).format("YYYY/MM/DD H:mm"),
          })),
          modalSelectedKeys: (res.data || []).map((e) => e.id),
        });
      } else {
        message.error(res.msg || "获取职位用户列表失败");
      }
    } catch (e) {
      catchError(e);
    }
  };
  saveHandle = async () => {
    const { value, description, dataShare } = this.state.positionInfo;
    try {
      const res = await request(`/position/${this.props.position.id}`, {
        method: "PUT",
        data: {
          dataShare,
          description,
          name: value,
        },
      });
      if (res && res.status === "SUCCESS") {
        this.props.returnTree();
        message.success("保存成功");
      } else {
        message.error(res.msg || "保存失败");
      }
    } catch (e) {
      catchError(e);
    }
  };
  modalConfirmHandle = async () => {
    const { modalSelectedKeys } = this.state;
    const { isTop } = this.props;
    if (isTop && modalSelectedKeys.length > 1)
      return message.error("顶级职位只能关联一位用户");
    try {
      const res = await request(`/position/${this.props.position.id}/user`, {
        method: "PUT",
        data: modalSelectedKeys,
      });
      if (res && res.status === "SUCCESS") {
        message.success("保存成功");
        this.setState({ modalOpen: false });
        this.fetchRelateUsers();
        this.fetchAllUsers();
      } else {
        message.error(res.msg || "保存失败");
      }
    } catch (e) {
      catchError(e);
    }
  };
  modalCancelHandle = () => {
    this.setState((state) => ({
      ...state,
      modalOpen: false,
      modalSelectedKeys: state.users.map((e) => e.id),
    }));
  };
  fetchAllUsers = async () => {
    try {
      const res = await request("/sysUser/currentCompany/all", {
        method: "POST",
        data: {
          page: 0,
          size: 1000000,
        },
      });
      if (res && res.status === "SUCCESS") {
        this.setState({ allUsers: res.data.datas });
      } else {
        message.error(res.msg || "获取公司数据出错");
      }
    } catch (e) {
      catchError(e);
    }
  };
  removeUserHandle = async (userId) => {
    const { id } = this.state.positionInfo;
    try {
      const res = await request(`/position/${id}/user/${userId}`, {
        method: "DELETE",
      });
      if (res && res.status === "SUCCESS") {
        message.success("踢出成功");
        this.fetchRelateUsers();
        this.fetchAllUsers();
      } else {
        message.error(res.msg || "踢出失败");
      }
    } catch (e) {
      catchError(e);
    }
  };
  componentDidMount() {
    this.fetchBaseInfo();
    this.fetchRelateUsers();
    this.fetchAllUsers();
  }
  render() {
    const { returnTree, position } = this.props;
    const {
      positionInfo,
      editing,
      modalOpen,
      users,
      allUsers,
      modalSelectedKeys,
    } = this.state;
    const navigationList = [
      { key: 0, label: "职位", onClick: returnTree },
      { key: 1, label: position.value, disabled: true },
    ];
    return (
      <>
        <HomeContentTitle
          navs={navigationList}
          title="职位"
          btns={
            <Button
              type="primary"
              onClick={this.saveHandle}
              style={{ backgroundColor: "#2A7FFF", color: "#fff" }}
            >
              保存
            </Button>
          }
        />
        <BaseInfo
          positionInfo={positionInfo}
          editing={editing}
          updateBaseInfo={this.updateBaseInfo}
          updateEditing={this.updateEditing}
        />
        <UserRelation
          open={modalOpen}
          users={users}
          positionId={position.id}
          allUsers={allUsers}
          openHandle={this.updateTargetState("modalOpen")}
          onOK={this.modalConfirmHandle}
          onCancel={this.modalCancelHandle}
          selectedKeys={modalSelectedKeys}
          updateSelectedKeys={this.updateTargetState("modalSelectedKeys")}
          removeUser={this.removeUserHandle}
        />
      </>
    );
  }
}

export default PositionDetail;
