import React, { useEffect } from "react";
import { List, Icon, message } from "antd";
import { useHistory, useParams } from "react-router-dom";
import request from "../../utils/request"
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
  const appId = useParams().appId;
  const [todos, setTodos] = React.useState(0);
  const [submits, setSubmits] = React.useState(0);
  const [dones, setDones] = React.useState(0);
  useEffect(()=>{
    getTagsCount()
  },[todos,submits,dones])
  async function getTagsCount() {
    try {
      const res = await request(`/flow/history/approval/count`,{
        headers:{
          appid: appId
        },
      });
      if (res && res.status === "SUCCESS") {
        const {todos, submits, dones} = res.data;
        setDones(dones);
        setSubmits(submits);
        setTodos(todos);
      } else {
        message.error("获取列表个数失败");
      }
    } catch (err) {
      message.error("获取列表个数失败");
    }
  }
  const items = history => [
    {
      key: "myPending",
      icon: <PendingIcon style={{marginRight: 5}}/>,
      label: "我的待办",
      tagNumber: todos,
      onClick: () => {
        history.push(`${baseUrl(history.location.pathname)}/myPending`);
        props.fn("myPending");
      }
    },
    {
      key: "mySubmitted",
      icon: <SubmittedIcon style={{marginRight: 5}}/>,
      label: "我发起的",
      tagNumber: submits,
      onClick: () => {
        history.push(`${baseUrl(history.location.pathname)}/mySubmitted`);
        props.fn("mySubmitted");
      }
    },
    {
      key: "myHandled",
      icon: <HandledIcon style={{marginRight: 5}}/>,
      label: "我处理的",
      tagNumber: dones,
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
          <span className={classes.tag}>{item.tagNumber}</span>
          </List.Item>
          )}
        ></List>
      </div>
    </div>
  );
};
