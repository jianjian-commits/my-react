import React from "react";
import { Layout } from "antd";
import clx from "classnames";
import classes from "./custom.module.scss";

const { Content } = Layout;

const CustomContent = props => {
  const { className, children, ...rest } = props;
  return (
    <Content {...rest} className={clx(classes.customContent, className)}>
      {children}
    </Content>
  );
};
export default CustomContent;
