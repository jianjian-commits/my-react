import React from "react";
import { Icon } from "antd";

export default function FieldDimension(props) {
  const handleDeleteDimension = () => {
    props.removeField(props.item);
  };

  const { className, item } = props;
  return(
  <div className={className}>
    <Icon type="close-circle" onClick={handleDeleteDimension} theme="filled" />
    {item.label}
  </div>
  )
}
