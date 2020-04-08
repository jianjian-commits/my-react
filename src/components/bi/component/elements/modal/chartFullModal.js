import React from "react";
import { Modal } from "antd";

export default function ChartFullScreenModal(props) {
  return (
    <Modal
      visible={true}
      closable={false}
      footer={null}
      width={"100%"}
      height={"100%"}
      bodyStyle={{padding:0}}
      wrapClassName="BIChartmodal"
      centered
    >
      <div className="modalChartContainer">
        {props.chart}
      </div>
    </Modal>
  );
}
