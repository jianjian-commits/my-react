import React from "react";
import { Table } from "antd";
import classes from "./custom.module.scss"

const CustomTable = props => {
  return <Table
    { ... props }
    className={classes.customTable}
  />
}
export default CustomTable;
