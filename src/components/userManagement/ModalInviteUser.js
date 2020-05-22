import React, { useState } from "react";
import { Input, Modal, message } from "antd";
// import {Modal} from "../shared/customWidget"
import { Button } from "../shared/customWidget";
import copy from "copy-to-clipboard";
import request from "../../utils/request";
import { catchError } from "../../utils";
import classes from "./inviteUser.module.scss";
import { CreateIcon } from "../../assets/icons/company"
import { CloseIcon } from "../../assets/icons/header";
const customCss = {
  bodyStyle: {
    padding: "46px 30px 182px",
    boxShadow: "0px 4px 26px rgba(46, 106, 162, 0.25)",
    borderRadius: "5px"
  },
  input: { marginRight: "10px", backgroundColor: "#F3F4F6" }
};

export default function InviteUser(props) {
  const { currentCompany, userDetail } = props;
  const [visible, setVisible] = useState(false);
  const [token, setToken] = useState(null);
  async function handleInviteUserBtn() {
    try {
      const res = await request(`/company/invitedToken`);
      if (res && res.status === "SUCCESS") {
        setToken(res.data);
        setVisible(true);
      } else {
        message.error(res.msg || "invitedToken获取失败");
      }
    } catch (err) {
      catchError(err);
    }
  }
  const inviteUrl = `${window.location.origin}/invite/${userDetail.id}/${currentCompany.id}/${token}`;
  return (
    <>
      <Button
        type="primary"
        onClick={() => handleInviteUserBtn()}
      >
        <CreateIcon />
        邀请
      </Button>
      <Modal
        // title="邀请新成员加入"
        bodyStyle={customCss.bodyStyle}
        visible={visible}
        footer={null}
        width="690px"
        onCancel={() => setVisible(false)}
        closeIcon={<CloseIcon />}
      >
        <p className={classes.title}>邀请新成员加入</p>
        <p className={classes.text}>
          发送以下链接给新成员，点击链接即可加入公司
        </p>
        <div style={{ display: "flex" }}>
          <Input value={inviteUrl} style={customCss.input} />
          <Button
            type="primary"
            onClick={() => {
              copy(inviteUrl);
              message.success("复制成功!");
            }}
          >
            复制链接
          </Button>
        </div>
        <p className={classes.warn}> 邀请链接14天有效</p>
      </Modal>
    </>
  );
}
