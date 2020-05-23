import React from "react";
import { Modal } from "antd";
import clx from "classnames";
import classes from "./custom.module.scss";
import { CloseIcon } from "../../../assets/icons/header";

const CustomModal = props => {
  const { className, title, ...rest } = props;
  console.log(title, !title, !!title)
  return (
    <Modal
      closeIcon={<CloseIcon />}
      {...rest}
      className={clx(
        classes.customModal,
        { [classes.hrColor]: !!title },
        className
      )}
      title={title && <span className={classes.titleSpan}>{title}</span>}
    />
  );
};
export default CustomModal;
