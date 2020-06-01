import React from "react";
import { Spin } from "antd";

const Loading = (props) => (
  <Spin tip="Loading..." spinning={props.spinning} style={{ top: "450px" }} delay={1000}>
    {props.children}
  </Spin>
);

export const FullLoading = (props) => (
  <div style={{ height: "100vh", textAlign: "center", position: "relative" }}>
    <Spin
      size="large"
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translateX(-50%) translateY(-50%)",
      }}
    />
  </div>
);

export default Loading;
