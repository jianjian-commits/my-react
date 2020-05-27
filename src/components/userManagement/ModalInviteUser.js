import React, { useState } from "react";
import { Input, message } from "antd";
import { Modal } from "../shared/customWidget";
import { Button } from "../shared/customWidget";
import copy from "copy-to-clipboard";
import request from "../../utils/request";
import { catchError } from "../../utils";
import classes from "./inviteUser.module.scss";
import { CreateIcon } from "../../assets/icons/company";

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
      <Button type="primary" onClick={() => handleInviteUserBtn()}>
        <CreateIcon />
        邀请
      </Button>
      <Modal
        // title="邀请新成员加入"
        className={classes.inviteModal}
        visible={visible}
        footer={null}
        width="690px"
        closable={false}
        onCancel={() => setVisible(false)}
      >
        <p className={classes.title}>邀请新成员加入</p>
        <p className={classes.text}>
          发送以下链接给新成员，点击链接即可加入公司
        </p>
        <div style={{ display: "flex" }}>
          <Input value={inviteUrl} className={classes.input} />
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
