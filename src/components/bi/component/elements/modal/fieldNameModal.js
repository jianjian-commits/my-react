import React, { useState } from "react";
import { Modal, Icon, Button, Input } from "antd";
import classes from "../../../scss/modal/fieldNameModal.module.scss";
export default function FieldNameModal(props) {
  const [fieldName, setFieldName] = useState(props.label);
  return (
    <Modal
      title={<span className={classes.modalTitle}>修改名称</span>}
      visible={true}
      closable={false}
      footer={null}
      width={410}
      bodyStyle={{ padding: 0 }}
      handleCancel={props.handleCancel}
      wrapClassName={classes.BIFileNameModal}
      centered
    >
      <div className={classes.modalContent}>
        <div className={classes.inputBox}>
          <Input
            value={fieldName}
            onChange={(e) => {
              setFieldName(e.target.value);
            }}
          />
        </div>
        <div className={classes.footBtns}>
          <Button onClick={props.handleCancel}>取消</Button>
          <Button
            onClick={() => {
              props.handleOK(fieldName);
            }}
          >
            确定
          </Button>
        </div>
      </div>
    </Modal>
  );
}
