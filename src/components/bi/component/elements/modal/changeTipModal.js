import React from "react";
import { Icon, Button } from "antd";
import { Modal } from "../../../../shared/customWidget"
import classes from "../../../scss/modal/tipModal.module.scss"
const title = "更改数据源";

const content = "更改数据源将清空当前图表配置，是否确认修改？";

export function ModalTitle(props) {
  return (
    <div className={classes.normalModalTitle}>
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
      wrapClassName={classes.BITipModal}
      centered
    >
      <div className={classes.normalModalContainer}>
        <div className={classes.normalModalContent}>{content}</div>
        <div className={classes.warningBtnGroup}>
          <Button onClick={props.handleCancel}>取消</Button>
          <Button onClick={props.handleOK}>确定</Button>
        </div>
      </div>
    </Modal>
  );
}
