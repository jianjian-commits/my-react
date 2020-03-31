import React, { useState, useCallback } from "react";
import { Dropdown, Menu, Modal } from "antd";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  signOut,
  switchCurrentTeam,
  initAllDetail
} from "../../store/loginReducer";
import Styles from "./header.module.scss";
import {
  WarningIcon,
  DownOutlinedIcon,
  CheckedIcon
} from "../../assets/icons/header";

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
              {check && <CheckedIcon style={{ floatRight: "0px" }} />}
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
  const { userDetail, allTeam, currentTeam, fetchRequestSent } = login;
  const [visible, setVisible] = useState(false);
  const loadData = useCallback(() => {
    if (!fetchRequestSent) initAllDetail()
  }, [fetchRequestSent, initAllDetail])
  loadData();

  return (
    <>
      <Dropdown
        overlayClassName={Styles.overlay}
        overlay={MenuItems(allTeam, setVisible, currentTeam, switchCurrentTeam)}
      >
        <Link
          className="ant-dropdown-link"
          to="#"
          style={{ color: "rgba(255, 255, 255, 0.9)" }}
        >
          {userDetail.name}
          <DownOutlinedIcon
            style={{ margin: "0 0 0 5px", color: "rgba(255, 255, 255, 0.9)" }}
          />
          <Modal
            className={Styles.signoutModal}
            visible={visible}
            width="404px"
            title={
              <>
                <WarningIcon />
                退出登录
              </>
            }
            cancelText={<span style={{ color: "#777F97" }}>取消</span>}
            okText={"确定"}
            onCancel={() => setVisible(false)}
            onOk={signOut}
            closable={false}
            mask={false}
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
