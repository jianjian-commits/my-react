import React from "react";
import { Icon } from "antd";
export default function ToolbarBtns(props){
  const { chartId = "default" , iconBtnGroup , isBtnBlock} = props;

  if(!iconBtnGroup || iconBtnGroup.length == 0) {
    return null;
  }

  return (
    <span className="iconBtn" 
      style={ isBtnBlock ? { display:"block"} : {display:"none"}} 
      id={chartId + "btns"}
    >
      {iconBtnGroup.map((iconBtn,index) => 
        <Icon type={iconBtn.type} key={index} onClick={iconBtn.click} />
      )}
    </span>
  );
};
