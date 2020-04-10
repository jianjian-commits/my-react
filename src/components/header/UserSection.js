import React, { useState, useEffect } from "react";
import { Dropdown, Menu, Modal } from "antd";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  signOut,
  initAllDetail,
  switchCurrentCompany
} from "../../store/loginReducer";
import Styles from "./header.module.scss";
import {
  WarningIcon,
  DownOutlinedIcon,
  CheckedIcon
} from "../../assets/icons/header";

const MenuItems = ({
  setVisible,
  allCompany,
  currentCompany,
  setSwitchCompany
}) => (
  <>
    <Menu>
      <Menu.Item>
        <span>所属公司</span>
      </Menu.Item>

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
  const { signOut, login, initAllDetail, switchCurrentCompany } = props;
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
    await switchCurrentCompany(switchCompany.companyId);
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
          switchCurrentCompany
        })}
      >
        <span
          className="ant-dropdown-link"
          style={{ color: "rgba(255, 255, 255, 0.9)", cursor: "default" }}
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
          >
            确定退出登录?
          </Modal>
          <Modal
            className={Styles.signoutModal}
            visible={switchCompany.visible}
            width="404px"
            title={<>切换公司</>}
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
        </span>
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
    initAllDetail,
    switchCurrentCompany
  }
)(User);
