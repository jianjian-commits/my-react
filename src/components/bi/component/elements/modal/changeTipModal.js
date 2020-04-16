import React from "react";
import { Modal, Icon, Button } from "antd";
const title = "更改数据源";

const content = "更改数据源将清空当前图表配置，是否确认修改？";

export function ModalTitle(props) {
  return (
    <div className="normalModalTitle">
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
      wrapClassName="BITipModal"
      centered
    >
      <div className="normalModalContainer">
        <div className="normalModalContent">{content}</div>
        <div className="warningBtnGroup">
          <Button onClick={props.handleCancel}>取消</Button>
          <Button onClick={props.handleOK}>确定</Button>
        </div>
      </div>
    </Modal>
  );
}
