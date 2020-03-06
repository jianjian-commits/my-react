import React from "react";
import { Spin } from "antd";

export default function Loading(props) {
  return (
    <Spin
      tip="Loading..."
      spinning={props.spinning}
      style={{ top: "450px" }}
      delay={1000}
    >
      {props.children}
    </Spin>
  );
}
