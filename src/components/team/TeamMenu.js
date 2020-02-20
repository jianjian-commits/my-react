import React from "react";
import { List, Icon } from "antd";
import { useHistory } from "react-router-dom";

import classes from "./teamMenu.module.scss";

const baseUrl = path => {
  let arr = path.split("/");
  arr.forEach((item, index, arr) => {
    if (item === "team") {
      arr.length = index + 1;
    }
  });
  return arr.join("/");
};
const TeamMenu = props => {
  const history = useHistory();
  const items = history => [
    {
      key: "teamMessage",
      icon: "exclamation-circle",
      label: "团队信息",
      onClick: () => {
        history.push(`${baseUrl(history.location.pathname)}/0`);
        props.fn(0);
      }
    },
    {
      key: "teamMember",
      icon: "user",
      label: "团队成员",
      onClick: () => {
        history.push(`${baseUrl(history.location.pathname)}/1`);
        props.fn(1);
      }
    },
    {
      key: "groups",
      icon: "team",
      label: "分组",
      onClick: () => {
        history.push(`${baseUrl(history.location.pathname)}/2`);
        props.fn(2);
      }
    }
  ];
  return (
    <div>
      <div className={classes.menuBox}>
        <div className={classes.title}>团队管理</div>
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
              <Icon className={classes.tag} type={item.icon} />
              {item.label}
            </List.Item>
          )}
        ></List>
      </div>
    </div>
  );
};
export default TeamMenu;
