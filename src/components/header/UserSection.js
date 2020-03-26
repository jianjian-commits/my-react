import React, { useState } from "react";
import { Dropdown, Icon, Menu, Modal } from "antd";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  signOut,
  switchCurrentTeam,
  initAllDetail
} from "../../store/loginReducer";
import Styles from "./header.module.scss";

const MenuItems = (allTeam, setVisible, currentTeam, switchCurrentTeam) => (
  <>
    <Menu>
      <Menu.Item>
        <span>我的团队</span>
      </Menu.Item>
      
      {allTeam.map(team => {
        const check = team.id === currentTeam.id;
        return (
          <Menu.Item key={team.id}>
            <Link
              onClick={check ? () => "" : () => switchCurrentTeam(team.id)}
              to="#"
            >
              {team.name}
              &nbsp;&nbsp;&nbsp;&nbsp;
              {check && <Icon type="check" />}
            </Link>
          </Menu.Item>
        );
      })}
      <Menu.Divider />
      <Menu.Item>
        <Link to="/userDetail">个人信息</Link>
      </Menu.Item>
      <Menu.Item>
        <div
          style={{ width: "100%", height: "100%" }}
          onClick={() => setVisible(true)}
        >
          退出登录
        </div>
      </Menu.Item>
    </Menu>
  </>
);

const User = props => {
  const { signOut, login, switchCurrentTeam, initAllDetail } = props;
  const { userDetail, allTeam, currentTeam } = login;
  const [init, setInit] = useState(false);
  const [visible, setVisible] = useState(false);
  if (!init) {
    initAllDetail();
    setInit(true);
  }
  return (
    <>
      <Dropdown
        overlayClassName={Styles.overlay}
        overlay={MenuItems(allTeam, setVisible, currentTeam, switchCurrentTeam)}
      >
        <Link className="ant-dropdown-link" to="#" style={{ color: "#ffffff" }}>
          {userDetail.name}
          <Icon type="down" style={{ margin: "0 0 0 5px" }} />
          <Modal
            visible={visible}
            width="419px"
            title={"退出登录"}
            cancelText={"取消"}
            okText={"确定"}
            onCancel={() => setVisible(false)}
            onOk={signOut}
          >
            确定退出登录?
          </Modal>
        </Link>
      </Dropdown>
    </>
  );
};
export default connect(
  ({ login }) => ({
    login
  }),
  {
    signOut,
    switchCurrentTeam,
    initAllDetail
  }
)(User);
