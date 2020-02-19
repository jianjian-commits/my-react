import React from "react";
import { connect } from "react-redux";
import { Input, Button, Modal, message } from "antd";
import copy from "copy-to-clipboard";
import classes from "./user.module.scss";
class UserManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };
  }
  setModal(item) {
    this.setState({ modal: item });
  }
  render() {
    const { modal } = this.state;
    const { register_token } = this.props;
    const registerUrl = `${window.location.origin}/register/${register_token}`;
    return (
      <>
        <div className={classes.wrapper}>
          <div>
            <Button type="primary" onClick={() => this.setModal(true)}>
              邀请用户
            </Button>
          </div>
          <div>我是用户列表</div>
        </div>
        <Modal
          title="邀请同事"
          visible={modal}
          footer={null}
          width="419px"
          onCancel={() => this.setModal(false)}
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
  }
}

export default connect(({ login }) => ({
  register_token: login.register_token
}))(UserManagement);
