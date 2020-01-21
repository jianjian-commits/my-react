import React from "react";
import { List } from "antd";
import { useHistory } from "react-router-dom";
import classes from "./approval.module.scss";

const items = history => [
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
  const history = useHistory();
  return (
    <div className={classes.sectionWrapper}>
      <div className={classes.sectionContent}>
        <List
          itemLayout="vertical"
          size="small"
          dataSource={items(history)}
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
