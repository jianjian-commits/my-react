import React from "react";
import { connect } from "react-redux";
import {
  setVerification,
  deleteVerification,
  setVerificationMsg
} from "../../redux/utils/operateVerification";
import { Input, Button, Icon, Tooltip } from "antd";
import ConditionModal from "./conditionModal";
class VerificationItem extends React.Component {
  render() {
    const { span, index } = this.props;
    return (
      <div className="VerificationItem">
        <Input
          value={span}
          disabled={true}
        />
        <Tooltip title="编辑">
          <img src="/image/icons/edit.png" onClick={() => {
            this.props.editFunc(span, index);
          }} />
        </Tooltip>
        <Tooltip title="删除">
          <img
            src="/image/icons/delete.png"
            onClick={ev => {
              this.props.deleteFunc(index);
            }}
          />
        </Tooltip>
      </div>
    );
  }
}

class FormVerification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      customValue: null,
      modalProps: {
        verificationStr: "",
        index: -1,
      }
    };
    this.showModal = this.showModal.bind(this);
    this.showEditModal = this.showEditModal.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleOk = this.handleOk.bind(this);
  }

  componentDidMount() {
    // let customValue = this.state.customValue;

    let customValue = this.props.data.filter(item => {
      return item.type === "CustomValue";
    })[0];

    if (customValue  != void 0) {
      this.props.setVerification(customValue.validate)
      this.props.setVerificationMsg(customValue.errMessage, 'init');
    }

  }

  showModal = () => {
    this.setState(state => ({
      ...state,
      visible: true
    }));
  };
  showEditModal = (verificationStr, index) => {
    this.setState(state => ({
      ...state,
      visible: true,
      modalProps: {
        verificationStr,
        index
      }
    }));
  }
  handleOk = e => {
    this.setState(state => ({
      ...state,
      visible: false,
      modalProps: {
        verificationStr: "",
        index: -1,
      }
    }));
  };
  handleCancel = e => {
    this.setState(state => ({
      ...state,
      visible: false,
      modalProps: {
        verificationStr: "",
        index: -1,
      }
    }));
  };

  handleChangeInput = e => {
    let value = e.target.value;
    this.props.setVerificationMsg(value, 'edit');
  };
  render() {
    return (
      <>
        <div className="FormVerification-container">
          <p>不满足校验时提示文字</p>
          <Input value={this.props.errMessage} onChange={this.handleChangeInput} autoComplete="off" />
          <p>表单校验条件</p>
          {this.props.verificationList.map((item, index) => (
            <div key={index}>
              <VerificationItem
                index={index}
                deleteFunc={this.props.deleteVerification}
                editFunc={()=>{this.showEditModal(item,index);;
                }}
                span={item}
                showModal={this.showModal}
              />
            </div>
          ))}
          <Button type="primary" onClick={this.showModal}>
            <Icon type="plus-circle" theme="filled" />添加校验条件
          </Button>
        </div>
        <ConditionModal
          key={Math.random()}
          visible={this.state.visible}
          handleOk={this.handleOk}
          handleCancel={this.handleCancel}
          {...this.state.modalProps}
        />
      </>
    );
  }
}

export default connect(
  store => ({
    forms: store.forms.formArray,
    data: store.formBuilder.data,
    errMessage: store.formBuilder.errMessage,
    verificationList: store.formBuilder.verificationList
  }),
  {
    deleteVerification,
    setVerification,
    setVerificationMsg
  }
)(FormVerification);
