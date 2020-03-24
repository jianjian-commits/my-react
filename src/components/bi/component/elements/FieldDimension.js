import React from "react";
import { Icon } from "antd";

export default function FieldDimension(props) {


  const handleDeleteDimension = () => {
    console.log("你删除了这个维度");
  };

  const { className, label } = props;
  return(
  <div className={className}>
    <Icon type="close-circle" onClick={handleDeleteDimension} theme="filled" />
    {label}
  </div>
  )
}
