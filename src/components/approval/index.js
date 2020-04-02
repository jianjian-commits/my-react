import React, { useEffect } from "react";
import { List, Icon, message, Menu } from "antd";
import { useHistory, useParams } from "react-router-dom";
import request from "../../utils/request"
import {  HandledIcon, PendingIcon, SubmittedIcon } from './svg/index'
import classes from "./approval.module.scss";

const MyHandled = () =>{
  return(
    <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.01793 5.00249H8.09416C8.34345 5.00249 8.54739 4.79853 8.54739 4.54926V4.45862C8.54739 4.20933 8.34343 4.00537 8.09416 4.00537H3.01793C2.76864 4.00537 2.5647 4.20933 2.5647 4.45862V4.54926C2.5647 4.79853 2.76866 5.00249 3.01793 5.00249Z" fill="#00CFA6"/>
      <path d="M2.5647 6.54778C2.5647 6.79706 2.76866 7.001 3.01793 7.001H8.09416C8.34345 7.001 8.54739 6.79705 8.54739 6.54778V6.45713C8.54739 6.20785 8.34343 6.00391 8.09416 6.00391H3.01793C2.76864 6.00391 2.5647 6.20786 2.5647 6.45713V6.54778Z" fill="#00CFA6"/>
      <path d="M10.5161 0.980469H1.51521C0.690484 0.980469 0.0195312 1.65142 0.0195312 2.47614V13.4604C0.0195312 14.2852 0.690484 14.9561 1.51521 14.9561H7.56945C7.25069 14.7781 6.95456 14.555 6.6893 14.2898C6.58379 14.1843 6.48518 14.0737 6.39316 13.959H1.51519C1.24029 13.959 1.01663 13.7353 1.01663 13.4604V2.47616C1.01663 2.20126 1.24029 1.9776 1.51519 1.9776H10.5161C10.791 1.9776 11.0147 2.20126 11.0147 2.47616V7.77382C11.3717 7.9192 11.7073 8.11702 12.0118 8.36329V2.47616C12.0118 1.65144 11.3408 0.980469 10.5161 0.980469Z" fill="#00CFA6"/>
      <path d="M13.0018 10.6347L9.82902 13.8075C9.63511 14.0014 9.31784 14.0014 9.12394 13.8075C8.93004 13.6136 8.93004 13.2963 9.12394 13.1024L12.2968 9.9296C12.4907 9.7357 12.8079 9.7357 13.0018 9.9296C13.1957 10.1235 13.1957 10.4408 13.0018 10.6347Z" fill="#00CFA6"/>
      <path d="M9.11122 13.807L7.70109 12.3969C7.50719 12.203 7.50719 11.8857 7.70109 11.6918C7.89499 11.4979 8.21226 11.4979 8.40616 11.6918L9.81629 13.1019C10.0102 13.2958 10.0102 13.6131 9.81629 13.807C9.62239 14.0009 9.30512 14.0009 9.11122 13.807Z" fill="#00CFA6"/>
    </svg>
  )
}

const MyPending = () =>{
  return(
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1.88696 13.9459V1.99455C1.88696 1.92811 1.94083 1.87402 2.00727 1.87402H12.0624C12.1288 1.87402 12.1829 1.92811 12.1829 1.99455V6.8163H13.0551V1.99455C13.0551 1.4473 12.6099 1.00183 12.0624 1.00183H2.00727C1.46002 1.00183 1.01477 1.4473 1.01477 1.99455V13.9459C1.01477 14.4931 1.46002 14.9386 2.00727 14.9386H7.63648V14.0664H2.00727C1.94083 14.0664 1.88696 14.0123 1.88696 13.9459Z" fill="#2B81FF"/>
      <path d="M4.49481 8.6373C4.25397 8.6373 4.05872 8.83235 4.05872 9.0734C4.05872 9.31444 4.25397 9.50949 4.49481 9.50949H6.23622C6.47705 9.50949 6.67231 9.31444 6.67231 9.0734C6.67231 8.83235 6.47705 8.6373 6.23622 8.6373H4.49481ZM9.94601 6.71406C9.94601 6.47302 9.75075 6.27797 9.50991 6.27797H4.49481C4.25397 6.27797 4.05872 6.47302 4.05872 6.71406C4.05872 6.95511 4.25397 7.15016 4.49481 7.15016H9.50991C9.75075 7.15016 9.94601 6.95511 9.94601 6.71406ZM9.50991 4.00464H4.49481C4.25397 4.00464 4.05872 4.19969 4.05872 4.44073C4.05872 4.68178 4.25397 4.87683 4.49481 4.87683H9.50991C9.75075 4.87683 9.94601 4.68178 9.94601 4.44073C9.94601 4.19969 9.75075 4.00464 9.50991 4.00464ZM12.8187 11.2305H11.9493V9.81996C11.9493 9.57891 11.7541 9.38386 11.5132 9.38386C11.2724 9.38386 11.0771 9.57891 11.0771 9.81996V11.6665C11.0771 11.9076 11.2724 12.1026 11.5132 12.1026H12.8188C13.0596 12.1026 13.2549 11.9076 13.2549 11.6665C13.2548 11.4255 13.0596 11.2305 12.8187 11.2305Z" fill="#2B81FF"/>
      <path d="M11.5416 8.04883C9.64698 8.04883 8.11102 9.58477 8.11102 11.4795C8.11102 13.3741 9.64696 14.9101 11.5416 14.9101C13.4363 14.9101 14.9723 13.3742 14.9723 11.4795C14.9723 9.58477 13.4363 8.04883 11.5416 8.04883ZM11.5416 14.0379C10.1309 14.0379 8.98321 12.8902 8.98321 11.4794C8.98321 10.0687 10.1309 8.921 11.5416 8.921C12.9524 8.921 14.1001 10.0687 14.1001 11.4794C14.1001 12.8902 12.9524 14.0379 11.5416 14.0379Z" fill="#2B81FF"/>
    </svg>
  )
}

const MySubmitted = () =>{
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4.48584 14.6045H0.23584V1.60449H12.7358V8.10449H11.7358V2.60449H1.23584V13.6045H4.48584V14.6045Z" fill="#FFA728"/>
    <path d="M3.23584 5.10449H9.73584V6.10449H3.23584V5.10449ZM3.2499 7.85449H6.7499V8.85449H3.2499V7.85449ZM12.278 9.92012L14.3999 12.0404L12.278 14.1623L11.5718 13.4545L12.9858 12.0404L11.5718 10.6264L12.278 9.92012Z" fill="#FFA728"/>
    <path d="M6.73584 11.6045H13.2358V12.6045H6.73584V11.6045Z" fill="#FFA728"/>
    </svg>
  )
}
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
  const [selectedKey, setSelectedKey] = React.useState("");
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
      tagNumber: props.todosNumber || todos,
      onClick: () => {
        // history.push(`${baseUrl(history.location.pathname)}/myPending`);
        props.fn("myPending");
      }
    },
    {
      key: "mySubmitted",
      icon: <SubmittedIcon style={{marginRight: 5, position: "relative", top: 3}}/>,
      label: "我发起的",
      // tagNumber: submits,
      onClick: () => {
        // history.push(`${baseUrl(history.location.pathname)}/mySubmitted`);
        props.fn("mySubmitted");
      }
    },
    {
      key: "myHandled",
      icon: <HandledIcon style={{marginRight: 5, position: "relative", top: 3}}/>,
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
                backgroundColor: "#E7F0FF"
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
