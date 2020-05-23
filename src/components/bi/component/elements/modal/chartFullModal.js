import React from "react";
import { Modal } from "../../../../shared/customWidget"
import ChartContainer from '../../elements/chart/ChartContainer';
import classes from "../../../scss/modal/chartModal.module.scss";
import ExitFullScreenAction from '../../elements/action/ExitFullScreenAction';
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
        <ChartContainer modalNarrowBtn={ new ExitFullScreenAction(() => {props.handleFullChart(null)})}
          {...props.fullScrenObj}/>
      </div>
    </Modal>
  );
}
