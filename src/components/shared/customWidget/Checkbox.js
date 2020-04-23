import React from "react";
import { Checkbox } from "antd";
import classes from "./custom.module.scss"

const CustomCheckbox = props => {
  return <Checkbox
    { ... props }
    className={classes.customCheckbox}
  />
}
export default CustomCheckbox;
