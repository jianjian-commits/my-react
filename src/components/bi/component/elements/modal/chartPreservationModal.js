import React from "react";
import { Modal, Icon, Button } from "antd";
import {ModalTitle} from "./exitWarningModal";
const title = "图表设计有修改是否保存";

const content = "您修改了图表设计但没有保存，是否保存并继续";


export default function ChartPreservationTip(props) {

  const saveChart = () => {
    //.....保存图表api
      props.handleOK();
  }

  const saveNoChart = () => {
      props.handleOK();
  }

  return (
    <Modal
      title={<ModalTitle>{title}</ModalTitle>}
      visible={true}
      closable={false}
      footer={null}
      width={400}
      bodyStyle={{padding:0}}
      handleCancel={props.handleCancel}
      wrapClassName="BImodal"
      centered
    >
      <div className="warningModalContainer">
        <div className="warningModalContent">{content}</div>
        <div className="tipBtnGroups">
          <Button onClick={props.handleCancel}>取消</Button>
          <Button onClick={saveNoChart}>不保存</Button>
          <Button onClick={saveChart}>保存</Button>
        </div>
      </div>
    </Modal>
  );
}
