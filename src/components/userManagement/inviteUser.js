import React, { useState } from "react";
import { connect } from "react-redux";
import { Input, Button, Modal, message } from "antd";
import copy from "copy-to-clipboard";
import request from "../../utils/request";

export default connect()(function InviteUser(props) {
  const { userId, currentTeam } = props;
  const [visible, setVisible] = useState(false);
  const [token, setToken] = useState(null);
  async function handleInviteUserBtn(teamId) {
    try {
      const res = await request(`/${teamId}/token`);
      if (res && res.status === "SUCCESS") {
        setToken(res.data);
        setVisible(true);
      } else {
        message.error("token获取失败");
      }
    } catch (err) {
      message.error("token获取失败");
    }
  }
  const registerUrl = `${window.location.origin}/register/${userId}/${token}`;
  return (
    <>
      <Button
        type="primary"
        onClick={() => handleInviteUserBtn(currentTeam.id)}
      >
        邀请用户
      </Button>
      <Modal
        title="邀请同事"
        visible={visible}
        footer={null}
        width="419px"
        onCancel={() => setVisible(false)}
      >
        <p> 将链接发给同事，即可通过注册的方式加入企业。</p>
        <div style={{ display: "flex" }}>
          <Input value={registerUrl} />
          <Button
            onClick={() => {
              copy(registerUrl);
              message.success("复制成功!");
            }}
          >
            复制链接
          </Button>
        </div>
        <p> 链接14天有效</p>
      </Modal>
    </>
  );
});
