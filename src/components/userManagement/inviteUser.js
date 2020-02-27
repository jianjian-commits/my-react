import React, { useState } from "react";
import { connect } from "react-redux";
import { Input, Button, Modal, message } from "antd";
import copy from "copy-to-clipboard";
import request from "../../utils/request";

export default connect()(function InviteUser(props) {
  const { userDetail, currentTeam } = props;
  const { id, teamId } = userDetail;
  const [visible, setVisible] = useState(false);
  const [token, setToken] = useState(null);
  async function handleInviteUserBtn() {
    try {
      const res = await request(`/team/${teamId}/invitedToken`);
      if (res && res.status === "SUCCESS") {
        setToken(res.data);
        setVisible(true);
      }
    } catch (err) {
      message.error("token获取失败");
    }
  }
  const inviteUrl = `${window.location.origin}/invite/${id}/${teamId}/${token}`;
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
          <Input value={inviteUrl} />
          <Button
            onClick={() => {
              copy(inviteUrl);
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
