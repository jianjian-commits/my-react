import React from "react";
import { Icon, Tooltip } from "antd";

/*
    tip: 提示内容 String
    show: 是否显示tip提示 Bool
*/

const QuestionTip = (props) => {
  return (
    <Tooltip title={props.show ? props.tip : null}>
      <Icon type="question-circle" style={{marginLeft: "6px", color: "#D6D8DE"}} />
    </Tooltip>
  );
};

export default QuestionTip;
