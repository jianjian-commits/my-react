import React from "react";
import { Menu } from "antd";
import { useHistory, useParams } from "react-router-dom";
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
  const { appId } = useParams();
  const { todos, submits, dones } = props.approveListCount;

  React.useEffect(()=>{
    props.getApproveCount(appId)
  },[appId])

  const items = history => [
    {
      key: "myPending",
      icon: <PendingIcon/>,
      label: "我的待办",
      tagNumber: todos,
      onClick: () => {
        // history.push(`${baseUrl(history.location.pathname)}/myPending`);
        props.fn("myPending");
      }
    },
    {
      key: "mySubmitted",
      icon: <SubmittedIcon style={{top: 3}}/>,
      label: "我发起的",
      // tagNumber: submits,
      onClick: () => {
        // history.push(`${baseUrl(history.location.pathname)}/mySubmitted`);
        props.fn("mySubmitted");
      }
    },
    {
      key: "myHandled",
      icon: <HandledIcon style={{top: 3}}/>,
      label: "我处理的",
      // tagNumber: dones,
      onClick: () => {
        // history.push(`${baseUrl(history.location.pathname)}/myHandled`);
        props.fn("myHandled");
      }
    }
  ];

  const getMenuItems = items =>
    items.map(item=>(
      <Menu.Item
        className={`${classes.item}`}
        key={item.key}
        onClick={item.onClick}
        style={
          props.approvalKey === item.key
            ? {
                backgroundColor: "#DDEAFF"
              }
            : {}
        }
        >
        {item.icon}
        {item.label}
        {item.tagNumber !== undefined && item.tagNumber > 0 ? <span className={classes.tag}>{item.tagNumber}</span> : null }
      </Menu.Item>
    ))
  return (
    <div className={classes.sectionWrapper}>
      <div className={classes.sectionContent}>
        <Menu
          selectedKeys={props.approvalKey}
         >{getMenuItems(items(history))}</Menu>
      </div>
    </div>
  );
};
