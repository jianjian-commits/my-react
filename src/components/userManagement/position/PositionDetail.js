import React, { Component } from "react";
import { Button, Input, Radio, Table, message, Modal } from "antd";
import { EditIcon } from "../../../assets/icons";
import { CreateIcon } from "../../../assets/icons/company";
import proClass from "../../profileManagement/profile.module.scss";
import { Title } from "../../shared";
import request from "../../../utils/request";
import { catchError } from "../../../utils";

const noop = () => ({});

export const BaseInfo = ({
  positionInfo,
  editing,
  updateBaseInfo,
  updateEditing
}) => {
  const list = [
    { key: "value", label: "职位名称", value: positionInfo.value },
    { key: "superiorValue", label: "汇报上级", value: positionInfo.superiorValue },
    {
      key: "dataShare",
      label: "是否与同时共享数据",
      value: positionInfo.dataShare
    },
    { key: "description", label: "描述", value: positionInfo.description }
  ];
  const renderContent = item => {
    const editSwitchHandler = () => updateEditing(item.key, !editing[item.key]);
    const editUpdateHandler = value => updateBaseInfo(item.key, value);
    switch (item.key) {
      case "value":
        return editing[item.key] ? (
          <Input
            value={item.value}
            onBlur={editSwitchHandler}
            onChange={e => editUpdateHandler(e.target.value)}
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
            onChange={e =>
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
            onChange={e => editUpdateHandler(e.target.value)}
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
          {list.map(l => (
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
  marginTop: 15
};
const userTitleStyle = {
  flex: 1,
  fontSize: "15px",
  margin: "30px 8px 17px 0",
  display: "inline-block",
  color: "#777f97"
};
const userButtonStyle = {
  flex: 1,
  textAlign: "right",
  lineHeight: "69px",
  marginRight: 10
};

const RelateModal = ({ visible, onOk, onCancel }) => {
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
      nihao
    </Modal>
  );
};

const UserRelation = ({ open, openHandle }) => {
  return (
    <div>
      <div style={userSectionStyle}>
        <div style={userTitleStyle}>
          <span>分组</span>
        </div>
        <div style={userButtonStyle}>
          <Button
            style={{ border: "1px solid rgb(42, 127, 255)", color: "#2a7fff" }}
            onClick={() => openHandle(true)}
          >
            <CreateIcon />
            关联用户
          </Button>
        </div>
      </div>
      <Table
        columns={[]}
        loading={false}
        dataSource={[]}
        rowKey="roleId"
      ></Table>
      <RelateModal
        visible={open}
        onOk={noop}
        onCancel={() => openHandle(false)}
      />
    </div>
  );
};

class PositionDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      positionInfo: {
        value: "恐慌感",
        superiorValue: "开户行",
        dataShare: false,
        description: "科技化能发挥离开举报"
      },
      editing: {
        value: false,
        description: false
      },
      users: [],
      modalOpen: false
    };
  }
  updateEditing = (key, value) => {
    this.setState(state => {
      return {
        ...state,
        editing: {
          ...state.editing,
          [key]: value
        }
      };
    });
  };
  updateBaseInfo = (key, value) => {
    this.setState(state => {
      return {
        ...state,
        positionInfo: {
          ...state.positionInfo,
          [key]: value
        }
      };
    });
  };
  updateTargetState = key => value => {
    this.setState({ [key]: value });
  };
  fetchBaseInfo = async () => {
    try {
      const res = await request(`/position/${this.props.position.id}`);
      if (res && res.status === "SUCCESS" && res.data) {
        this.setState({
          positionInfo: res.data
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
          users: res.data || []
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
          name: value
        }
      });
      if (res && res.status === "SUCCESS") {
        this.props.returnTree();
        message.success("保存成功");
      } else {
        message.error(res.msg || "保存失败");
      }
    } catch (e) {
      console.log(e)
      catchError(e);
    }
  };
  componentDidMount() {
    this.fetchBaseInfo();
    this.fetchRelateUsers();
  }
  render() {
    const { returnTree, position } = this.props;
    const { positionInfo, editing, modalOpen } = this.state;
    const navigationList = [
      { key: 0, label: "职位", onClick: returnTree },
      { key: 1, label: position.value, disabled: true }
    ];
    return (
      <>
        <section>
          <Title navs={navigationList} />
          <Button
            type="primary"
            onClick={this.saveHandle}
            style={{ backgroundColor: "#2A7FFF", color: "#fff" }}
          >
            保存
          </Button>
        </section>
        <BaseInfo
          positionInfo={positionInfo}
          editing={editing}
          updateBaseInfo={this.updateBaseInfo}
          updateEditing={this.updateEditing}
        />
        <UserRelation
          open={modalOpen}
          openHandle={this.updateTargetState("modalOpen")}
        />
      </>
    );
  }
}

export default PositionDetail;
