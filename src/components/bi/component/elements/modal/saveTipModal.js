import React from "react";
import { Modal, Icon, Button } from "antd";
import {ModalTitle} from "./changeTipModal";
import classes from "../../../scss/modal/tipModal.module.scss";
const title = "图表设计有修改是否保存";

const content = "您修改了图表设计但没有保存，是否需要保存图表设计并继续？";


export default function ChartPreservationTip(props) {
  return (
    <Modal
      title={<ModalTitle>{title}</ModalTitle>}
      visible={props.visible}
      closable={false}
      footer={null}
      width={400}
      bodyStyle={{padding:0}}
      handleCancel={props.handleCancel}
      wrapClassName={classes.BITipModal}
      centered
    >
      <div className={classes.normalModalContainer}>
        <div className={classes.normalModalContent}>{content}</div>
        <div className={classes.tipBtnGroup}>
          <Button onClick={props.handleCancel}>取消</Button>
          <Button onClick={props.saveNoChart}>不保存</Button>
          <Button onClick={props.saveChart}>保存</Button>
        </div>
      </div>
    </Modal>
  );
}
