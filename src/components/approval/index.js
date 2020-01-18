import React from "react";
import { List } from "antd";
import { history } from "../../store";
import classes from "./approval.module.scss";

const items = [
  {
    key: "myPending",
    icon: "setting",
    label: "我的待办",
    onClick: () => history.push("/backlog")
  },
  {
    key: "mySubmitted",
    icon: "setting",
    label: "我发起的",
    onClick: () => history.push("/backlog")
  },
  {
    key: "myHandled",
    icon: "setting",
    label: "我处理的",
    onClick: () => history.push("/backlog")
  }
];

export const ApprovalSection = () => {
  return (
    <div className={classes.sectionWrapper}>
      <div className={classes.sectionContent}>
        <List
          itemLayout="vertical"
          size="small"
          dataSource={items}
          renderItem={item => (
            <List.Item
              className={classes.item}
              key={item.key}
              onClick={item.onClick}
            >
              {item.label}
              <span className={classes.tag}>2</span>
            </List.Item>
          )}
        ></List>
      </div>
    </div>
  );
};
