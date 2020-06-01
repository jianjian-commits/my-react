import React from "react";
import { Button } from "antd";
import clx from "classnames";
import classes from "./custom.module.scss";

const CustomButton = props => {
  const { type = "default", className } = props;
  return (
    <Button {...props} className={clx(classes.customButton, type, className)} />
  );
};
export default CustomButton;
