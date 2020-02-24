import React from "react";
import { Modal, Button, Select } from "antd";
class LayoutModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <Modal
        title="选择操作"
        visible={this.props.modalVisible}
        onOk={this.props.handleOk}
        onCancel={this.props.handleCancel}
        closable={false}
        footer={null}
        okText="保存"
        cancelText="取消"
        centered
      >
        <div className="layout-modal-container">
          <Button
            type="primary"
            onClick={() => {
              this.props.setCurrentLayout(
                this.props.defaultLayout,
                "creat",
                new String((Math.random() * 1000000000) | 0),
                "新的布局"
              );
              this.props.handleOk();
            }}
          >
            新建布局
          </Button>
          <Button
            type="primary"
            onClick={() => {
              const currentLayoutObj =
                this.props.currentLayoutId === ""
                  ? this.props.formLayoutList[0]
                  : this.props.formLayoutList.filter(
                      item => item.id === this.props.currentLayoutId
                    )[0];
              this.props.setCurrentLayout(
                this.props._handlNewComponentLayout(
                  currentLayoutObj.layout,
                  this.props.defaultLayout
                ),
                "edit",
                currentLayoutObj.id,
                currentLayoutObj.name
              );
              this.props.handleOk();
            }}
            disabled={this.props.formLayoutList.length === 0}
          >
            更改已存在的布局
          </Button>
        </div>
      </Modal>
    );
  }
}

export default LayoutModal;
