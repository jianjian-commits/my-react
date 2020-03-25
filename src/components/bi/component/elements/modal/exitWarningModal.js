import React from "react";
import { Modal, Icon, Button } from "antd";
import "./modal.scss";
const title = "更改数据源";

const content = "更改数据源将清空当前图表配置，是否确认修改？";

export function ModalTitle(props) {
  return (
    <div className="warningModalTitle">
      <Icon type="exclamation-circle" theme="filled" />
      {props.children}
    </div>
  );
}

export default function ExitWaringTip(props) {
  return (
    <Modal
      title={<ModalTitle>{title}</ModalTitle>}
      visible={props.visible}
      closable={false}
      footer={null}
      width={400}
      bodyStyle={{padding:0}}
      wrapClassName="BImodal"
      centered
      handleCancel={props.handleCancel}
    >
      <div className="warningModalContainer">
        <div className="warningModalContent">{content}</div>
        <div className="warningBtnGroups">
          <Button onClick={props.handleCancel}>取消</Button>
          <Button>确定</Button>
        </div>
      </div>
    </Modal>
  );
}
