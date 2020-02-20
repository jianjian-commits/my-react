import React from "react";
import { Button, Icon, Modal, Tooltip, message, Spin } from "antd";
import { setFormName, saveForm, updateForm } from "../redux/utils/operateForm";
import { connect } from "react-redux";
import config from "../../../config/config";
class ForBuilderHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      isTitleCanEdit: true,
      formTitleClass: "showFormTitle",
      btnCanClick: true
    };
    this.handleTitleEdit = this.handleTitleEdit.bind(this);
    this.handleChangeName = this.handleChangeName.bind(this);
    this.showModal = this.showModal.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }
  handleTitleEdit() {
    this.setState(state => ({
      ...state,
      isTitleCanEdit: !this.state.isTitleCanEdit,
      formTitleClass:
        this.state.isTitleCanEdit === true ? "editFormTitle" : "showFormTitle"
    }));
    if (this.props.name.trim() === "") {
      this.props.setFormName("表单名字");
    }
  }
  handleChangeName = ev => {
    let { value } = ev.target;
    this.props.setFormName(value);
  };
  showModal = () => {
    if (!this.props.isFormChanged) {
      window.location.href = config.hostUrl;
    } else {
      this.setState(state => ({
        ...state,
        visible: true
      }));
    }
  };
  handleOk = editForm => {
    this.setState(state => ({
      ...state,
      visible: false
    }));

    if (this.handleIsRightConditions()) {
      editForm || this.props.localForm !== null
        ? this.props.updateForm(
            this.props.formData,
            this.props.submissionAccess,
            this.props.name,
            this.props.verificationList,
            this.props.localForm,
            this.props.errMessage,
            "back"
          )
        : this.props.saveForm(
            this.props.formData,
            this.props.submissionAccess,
            this.props.name,
            this.props.verificationList,
            this.props.errMessage,
            "back"
          );
    } else {
      message.error("联动条件失效，请重新设置！", 2);
    }
  };
  handleCancel = e => {
    this.setState(state => ({
      ...state,
      visible: false
    }));
    window.location.href = config.hostUrl;
  };

  /*
   * 检查数据联动是否合理 合理返回true
   * 完成数据联动前驱校验
   */
  handleIsRightConditions = () => {
    const { formData } = this.props;
    let linkIdArray = [];
    let allComponentsId = formData.map(item => {
      if (item.data && item.data.type === "DataLinkage") {
        linkIdArray.push(item.data.values.conditionId);
      }
      return item.id;
    });
    let isMeetingConditions = true;
    linkIdArray.forEach(item => {
      if (allComponentsId.includes(item) === false) {
        isMeetingConditions = false;
      }
    });
    return isMeetingConditions;
  };
  _truncateValue(value) {
    if (value == void 0) {
      return "";
    }

    if (value) {
      if (value.length > 11) {
        return value.substr(0, 11) + "...";
      } else {
        return value;
      }
    }
  }
  render() {
    let editForm = this.props.editForm;
    return (
      <div className="react-form-builder-header">
        <Modal
          title=""
          visible={this.state.visible}
          closable={false}
          footer={null}
          centered
          width="350"
          style={{
            height: 160
          }}
        >
          <div className="backModalContent">
            <div className="header">
              <img src="/image/icons/tip.png" alt="图片加载出错" />
              <span>提醒</span>
            </div>
            <div className="body">
              <p>是否保存当前更改</p>
            </div>
            <div className="footer">
              <Button onClick={this.handleCancel}>取消</Button>
              <Button
                onClick={() => {
                  this.handleOk(editForm);
                }}
              >
                确认
              </Button>
            </div>
          </div>
        </Modal>

        <div className="headerBarBack">
          <Button onClick={this.showModal} type="link">
            <Icon type="left" />
          </Button>
        </div>
        <div className="FormTitle">
          {this.state.isTitleCanEdit === true ? (
            <span>{this._truncateValue(this.props.name)}</span>
          ) : (
            <input
              disabled={this.state.isTitleCanEdit}
              maxLength="20"
              className={this.state.formTitleClass}
              onBlur={this.handleTitleEdit}
              onChange={this.handleChangeName}
              value={this.props.name}
            />
          )}
          {this.state.isTitleCanEdit === true ? (
            <Tooltip title="编辑">
              <img
                onClick={this.handleTitleEdit}
                src="/image/icons/editform.png"
              />
            </Tooltip>
          ) : (
            <></>
          )}
        </div>
        <div className="CreateFormStep" />
        <div className="CreateFormOperations">
          <Button
            disabled={!this.state.btnCanClick}
            onClick={e => {
              this.setState({ btnCanClick: false }, () => {
                editForm || this.props.localForm !== null
                  ? (() => {
                      if (this.handleIsRightConditions()) {
                        this.props.updateForm(
                          this.props.formData,
                          this.props.submissionAccess,
                          this.props.name,
                          this.props.verificationList,
                          this.props.localForm,
                          this.props.errMessage,
                          "save",
                          () => {
                            this.setState({ btnCanClick: true });
                          }
                        );
                      } else {
                        message.error("联动条件失效，请重新设置！", 2);
                      }
                    })()
                  : (() => {
                      if (this.handleIsRightConditions()) {
                        this.props.saveForm(
                          this.props.formData,
                          this.props.submissionAccess,
                          this.props.name,
                          this.props.verificationList,
                          this.props.errMessage,
                          "save",
                          () => {
                            this.setState({ btnCanClick: true });
                          }
                        );
                      } else {
                        message.error("联动条件失效，请重新设置！", 2);
                      }
                    })();
              });
            }}
            type="primary"
          >
            {this.state.btnCanClick === false ? <Spin /> : ""}保存
          </Button>
        </div>
      </div>
    );
  }
}
export default connect(
  store => ({
    formData: store.formBuilder.data,
    submissionAccess: store.rootData.submissionAccess,
    verificationList: store.formBuilder.verificationList,
    name: store.formBuilder.name,
    formArray: store.forms.formArray,
    errMessage: store.formBuilder.errMessage,
    isFormChanged: store.formBuilder.isFormChanged,
    localForm: store.formBuilder.localForm
  }),
  {
    setFormName,
    saveForm,
    updateForm
  }
)(ForBuilderHeader);
