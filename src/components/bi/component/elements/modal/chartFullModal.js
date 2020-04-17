import React from "react";
import { Modal } from "antd";
import classes from "../../../scss/modal/chartModal.module.scss";
export default function ChartFullScreenModal(props) {
  return (
    <Modal
      visible={true}
      closable={false}
      footer={null}
      width={"100%"}
      height={"100%"}
      bodyStyle={{padding:0}}
      wrapClassName={classes.BIChartModal}
      centered
    >
      <div className={classes.modalChartContainer}>
        {props.chart}
      </div>
    </Modal>
  );
}
