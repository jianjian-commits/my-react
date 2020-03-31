import React from "react";
import { Icon } from "antd";

export default function FieldDimension(props) {
  const handleDeleteDimension = () => {
    props.item.removeField(props.item);
  };

  const { item } = props;
  const handlMouseEnter = () => {
    document.getElementById("dim"+item.id).style.display = "block";
  };

  const handlMouseLeave = () => {
    document.getElementById("dim"+item.id).style.display = "none";
  };

  return(
  <div className={item.className} onMouseEnter={handlMouseEnter} onMouseLeave={handlMouseLeave}>
    <Icon type="close-circle" id={"dim"+item.id} onClick={handleDeleteDimension} theme="filled" />
    {item.label}
  </div>
  )
}