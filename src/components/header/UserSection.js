import React, { useState, useEffect } from "react";
import { Dropdown, Menu } from "antd";
import { Modal } from "../shared/customWidget";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  signOut,
  initAllDetail,
  switchcurrentCompany
} from "../../store/loginReducer";
import Styles from "./header.module.scss";
import {
  WarningIcon,
  DownOutlinedIcon,
  CheckedIcon
} from "../../assets/icons/header";
import classes from "./header.module.scss";

const MenuItems = ({
  setVisible,
  allCompany,
  currentCompany,
  setSwitchCompany
}) => (
  <>
    <Menu>
      {allCompany && allCompany.length > 0 && (
        <Menu.Item>
          <span>所属公司</span>
        </Menu.Item>
      )}

      {allCompany.map(company => {
        const check = company.id === currentCompany.id;
        return (
          <Menu.Item key={company.id}>
            <Link
              onClick={
                check
                  ? () => ""
                  : () =>
                      setSwitchCompany({
                        companyName: company.companyName,
                        visible: true,
                        companyId: company.id
                      })
              }
              to="#"
            >
              <div style={{ marginRight: "40px" }}>{company.companyName}</div>
              {check && (
                <CheckedIcon
                  style={{ floatRight: "0px", marginLeft: "10px" }}
                />
              )}
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
  const { signOut, login, initAllDetail, switchcurrentCompany } = props;
  const { userDetail, fetchRequestSent, allCompany, currentCompany } = login;
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    !fetchRequestSent && initAllDetail();
  }, [fetchRequestSent, initAllDetail]);
  const [switchCompany, setSwitchCompany] = useState({
    companyName: null,
    visible: false,
    companyId: null
  });
  const handleSwitchCompanyConfirm = async () => {
    await switchcurrentCompany(switchCompany.companyId);
    await initAllDetail();
    setSwitchCompany({
      companyName: null,
      visible: false,
      companyId: null
    });
  };

  return (
    <>
      <Dropdown
        overlayClassName={Styles.overlay}
        overlay={MenuItems({
          setVisible,
          setSwitchCompany,
          allCompany,
          currentCompany,
          switchcurrentCompany
        })}
      >
        <div
          className={classes.userSection}
          style={{
            color: props.theme === "white" ? "" : "rgba(255, 255, 255, 0.9)"
          }}
        >
          {userDetail.name}
          <DownOutlinedIcon
            style={{ margin: "0 0 0 5px", color: "rgba(255, 255, 255, 0.9)" }}
          />
        </div>
      </Dropdown>
      <Modal
        className={Styles.signoutModal}
        visible={visible}
        width="404px"
        title={
          <>
            <WarningIcon style={{marginRight: "9.49px"}} />
            退出登录
          </>
        }
        cancelText={<span style={{ color: "#777F97" }}>取消</span>}
        okText={"确定"}
        onCancel={() => setVisible(false)}
        onOk={signOut}
        closable={false}
      >
        确定退出登录?
      </Modal>
      <Modal
        className={Styles.signoutModal}
        visible={switchCompany.visible}
        width="404px"
        title={"切换公司"}
        cancelText={<span style={{ color: "#777F97" }}>取消</span>}
        okText={"确定"}
        onCancel={() =>
          setSwitchCompany({
            companyName: null,
            visible: false,
            companyId: null
          })
        }
        onOk={handleSwitchCompanyConfirm}
        closable={false}
      >
        {`切换至公司：${switchCompany.companyName}`}
      </Modal>
    </>
  );
};
export default connect(
  ({ login }) => ({
    login
  }),
  {
    signOut,
    initAllDetail,
    switchcurrentCompany
  }
)(User);
