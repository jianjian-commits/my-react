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
    const { item, index } = this.props;
    return (
      <div className="VerificationItem">
        <Input
          value={item.name}
          disabled={true}
        />
        <Tooltip title="编辑">
          <img src="/image/icons/edit.png" onClick={() => {
            this.props.editFunc(item, index);
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
        verificationValue: "",
        index: -1,
      }
    };
    this.showModal = this.showModal.bind(this);
    this.showEditModal = this.showEditModal.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleOk = this.handleOk.bind(this);
  }

  componentDidMount() {
    let formValidation = this.props.verificationList;
    let errMessage = this.props.errMessage;

    if (formValidation != void 0) {
      this.props.setVerification(formValidation)
      this.props.setVerificationMsg(errMessage, 'init');
    }

  }

  showModal = () => {
    this.setState(state => ({
      ...state,
      visible: true
    }));
  };
  showEditModal = (validate, index) => {
    const {name, value} = validate;
    this.setState(state => ({
      ...state,
      visible: true,
      modalProps: {
        verificationStr: name,
        verificationValue : value,
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
        verificationValue : "",
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
        verificationValue: "",
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
                item={item}
                showModal={this.showModal}
              />
            </div>
          ))}
          <Button type="primary" onClick={this.showModal}>
            <Icon type="plus-circle" theme="filled" style={{    position: "absolute", left: 125, top: 6.5,}}/>添加校验条件
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
