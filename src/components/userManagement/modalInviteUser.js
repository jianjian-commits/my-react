import React, { useState } from "react";
import { Input, Button, Modal, message } from "antd";
import copy from "copy-to-clipboard";
import request from "../../utils/request";
import classes from "./inviteUser.module.scss";

const bodyStyle = {
  padding: "46px 30px 182px",
  boxShadow: "0px 4px 26px rgba(46, 106, 162, 0.25)",
  borderRadius: "5px"
};

export default function InviteUser(props) {
  const { currentTeam, userDetail } = props;
  const [visible, setVisible] = useState(false);
  const [token, setToken] = useState(null);
  async function handleInviteUserBtn() {
    try {
      const res = await request(`/team/invitedToken`);
      if (res && res.status === "SUCCESS") {
        setToken(res.data);
        setVisible(true);
      }
    } catch (err) {
      message.error("token获取失败");
    }
  }
  const inviteUrl = `${window.location.origin}/invite/${userDetail.id}/${currentTeam.id}/${token}`;
  return (
    <>
      <Button
        icon="plus-circle"
        type="primary"
        onClick={() => handleInviteUserBtn()}
      >
        邀请
      </Button>
      <Modal
        // title="邀请新成员加入"
        bodyStyle={bodyStyle}
        visible={visible}
        footer={null}
        width="690px"
        onCancel={() => setVisible(false)}
      >
        <p className={classes.title}>邀请新成员加入</p>
        <p className={classes.text}>
          发送以下链接给新成员，点击链接即可加入团队
        </p>
        <div style={{ display: "flex" }}>
          <Input
            value={inviteUrl}
            style={{ marginRight: "10px", backgroundColor: "#F3F4F6" }}
          />
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
