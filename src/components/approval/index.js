import React from "react";
import { List, Icon } from "antd";
import { useHistory } from "react-router-dom";
import {  HandledIcon, PendingIcon, SubmittedIcon } from './svg/index'
import classes from "./approval.module.scss";

const baseUrl = path => {
  let arr = path.split("/");
  arr.forEach((item, index, arr) => {
    if (item === "detail") {
      arr.length = index + 1;
    }
  });
  return arr.join("/");
};
export const ApprovalSection = props => {
  const history = useHistory();
  const items = history => [
    {
      key: "myPending",
      icon: <PendingIcon style={{marginRight: 5}}/>,
      label: "我的待办",
      onClick: () => {
        history.push(`${baseUrl(history.location.pathname)}/myPending`);
        props.fn("myPending");
      }
    },
    {
      key: "mySubmitted",
      icon: <SubmittedIcon style={{marginRight: 5}}/>,
      label: "我发起的",
      onClick: () => {
        history.push(`${baseUrl(history.location.pathname)}/mySubmitted`);
        props.fn("mySubmitted");
      }
    },
    {
      key: "myHandled",
      icon: <HandledIcon style={{marginRight: 5}}/>,
      label: "我处理的",
      onClick: () => {
        history.push(`${baseUrl(history.location.pathname)}/myHandled`);
        props.fn("myHandled");
      }
    }
  ];
  return (
    <div className={classes.sectionWrapper}>
      <div className={classes.sectionContent}>
        <List
          split={false}
          itemLayout="vertical"
          size="small"
          dataSource={items(history)}
          renderItem={item => (
            <List.Item
              className={classes.item}
              key={item.key}
              onClick={item.onClick}
            >
            {item.icon}
            {item.label}
            <span className={classes.tag}>2</span>
          </List.Item>
          )}
        ></List>
      </div>
    </div>
  );
};
