import React from "react";
import { connect } from "react-redux";
import { Dropdown, Icon, Popconfirm, Menu } from "antd";
import { Link } from "react-router-dom";
import { signOut } from "../../store/_loginReducer";
// const { Meta } = Card;
// const UserDetail = (
//   <Card style={{ width: 200, marginTop: 8, padding: 10 }} loading={false}>
//     <Meta
//       avatar={
//         <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
//       }
//       title="Devinci"
//       description="这么巧，你也叫Devinci"
//     />
//   </Card>
// );

const MenuItems = signOut => (
  <Menu>
    <span>我的团队</span>
    <Menu.Item>
      <Link to="/">占位</Link>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item>
      <Link to="/userDetail">个人信息</Link>
    </Menu.Item>
    <Menu.Item>
      <Popconfirm
        title="确定退出登录?"
        onConfirm={signOut}
        onCancel={() => ""}
        okText="确定"
        cancelText="取消"
        placement="left"
      >
        <span>退出登录</span>
      </Popconfirm>
    </Menu.Item>
  </Menu>
);

const User = ({ signOut, userDatas = {} }) => {
  const { username } = userDatas;
  return (
    <Dropdown overlay={MenuItems(signOut)}>
      <Link className="ant-dropdown-link" to="#">
        <div style={{ display: "flex", alignItems: "center" }}>
          {username} <Icon type="down" style={{ margin: "0 0 0 5px" }} />
        </div>
      </Link>
    </Dropdown>
  );
};
export default connect(({ login }) => ({ userDatas: login.userDatas }), {
  signOut
})(User);
