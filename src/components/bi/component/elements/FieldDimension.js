import React ,{useState}from "react";
import { Icon } from "antd";
import classes from "../../scss/bind/optionSelect.module.scss"
export default function FieldDimension(props) {
  const [btnVisible,setBtnVisible] = useState(false);
  const handleDeleteDimension = () => {
    props.item.removeField(props.item);
  };

  const { item } = props;
  
  const handlMouseEnter = () => {
    setBtnVisible(true);
  };

  const handlMouseLeave = () => {
    setBtnVisible(false);
  };

  return(
  <div className={classes.dimContainer} onMouseEnter={handlMouseEnter} onMouseLeave={handlMouseLeave}>
    {item.label}
    {btnVisible && <Icon type="close-circle" id={"dim"+item.id} onClick={handleDeleteDimension} theme="filled" />}
  </div>
  )
}