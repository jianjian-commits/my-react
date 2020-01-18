import React from "react";
import { Dropdown, Card, Icon, Avatar } from "antd";
const { Meta } = Card;
const UserDetail = (
  <Card style={{ width: 200, marginTop: 8, padding: 10 }} loading={false}>
    <Meta
      avatar={
        <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
      }
      title="Devinci"
      description="这么巧，你也叫Devinci"
    />
  </Card>
);

const User = () => {
  return (
    <Dropdown overlay={UserDetail}>
      <a className="ant-dropdown-link" href=";">
        Devinci <Icon type="down" />
      </a>
    </Dropdown>
  );
};
export default User;
