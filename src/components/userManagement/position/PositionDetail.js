import React, { Component } from "react";
import { Button, Input, Radio ,Table } from "antd";
import { EditIcon } from "../../../assets/icons";
import { CreateIcon } from "../../../assets/icons/company";
import proClass from "../../profileManagement/profile.module.scss";
import { Title } from "../../shared";

const noop = () => ({});

export const BaseInfo = ({ positionInfo }) => {
  // const formatDate = date => moment(date).format("YYYY/MM/DD H:mm");
  console.log(positionInfo);
  const list = [
    { key: "name", title: "职位名称", value: positionInfo.name },
    { key: "superior", title: "汇报上级", value: positionInfo.superior },
    {
      key: "dataShare",
      title: "是否与同时共享数据",
      value: positionInfo.dataShare
    },
    { key: "description", title: "描述", value: positionInfo.description }
  ];
  const renderContent = item => {
    switch (item.key) {
      case "name":
        return (
          <>
            <Input value={item.value} onBlur={noop} onChange={noop} />
            <span>{item.value}</span>
            <EditIcon onClick={noop} />
          </>
        );
        case "dataShare":
          return (
            <>
              <Radio.Group onChange={noop} value={item.value ? 1: 2}>
                <Radio value={1}>共享</Radio>
                <Radio value={2}>不共享</Radio>
              </Radio.Group>
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
              <td>{l.title}</td>
              <td>{renderContent(l)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const UserRelation = props => {
  return (
    <div style={{ marginTop: 10 }}>
      <span>分组</span>
      <Button onClick={noop}>
        <CreateIcon />
        关联用户
      </Button>
      <Table
        columns={[]}
        loading={false}
        dataSource={[]}
        rowKey="roleId"
      ></Table>
      {/* <ModalCreation
        title={title}
        visible={visible}
        onOk={onOk}
        onCancel={onCancel}
      /> */}
    </div>
  );
};

class PositionDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      positionId: null,
      positionInfo: {
        name: "恐慌感",
        superior: "开户行",
        dataShare: false,
        description: "科技化能发挥离开举报"
      }
    };
  }
  render() {
    const { returnTree } = this.props;
    const { positionInfo } = this.state;
    const navigationList = [
      { key: 0, label: "职位", onClick: returnTree },
      { key: 1, label: positionInfo.name, disabled: true }
    ];
    return (
      <>
        <section>
          <Title navs={navigationList} />
          <Button
            type="primary"
            onClick={returnTree}
            style={{ backgroundColor: "#2A7FFF", color: "#fff" }}
          >
            保存
          </Button>
          <Button
            onClick={returnTree}
            style={{
              border: "1px solid #2A7FFF",
              backgroundColor: "transparent"
            }}
          >
            取消
          </Button>
        </section>
        <BaseInfo positionInfo={positionInfo} />
        <UserRelation />
      </>
    );
  }
  static getDerivedStateFromProps(props, state) {
    const { positionId } = props;
    if (positionId !== state.positionId) {
      return {
        ...state,
        positionId
      };
    }
    return null;
  }
}

export default PositionDetail;
