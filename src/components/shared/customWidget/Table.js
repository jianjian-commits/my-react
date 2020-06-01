import React from "react";
import { Table, Card } from "antd";
import classes from "./custom.module.scss";

const CustomTable = props => {
  return (
    <Card bodyStyle={{ padding: 0 }}>
      <Table className={classes.customTable} {...props} />
    </Card>
  );
};
export default CustomTable;
