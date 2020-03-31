import React from "react";
import { Icon } from "antd";
export default function ToolbarBtns(props){
  const {iconBtnGroup , isBtnBlock} = props;

  return (
    <span className="iconBtn">
      {iconBtnGroup.map((iconBtn,index) => 
        <Icon type={iconBtn.type} key={index} onClick={iconBtn.click} />
      )}
    </span>
  );
};
