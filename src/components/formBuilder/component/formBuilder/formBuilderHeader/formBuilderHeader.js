import React from "react";
import { Button, Icon, Modal, Tooltip, Spin } from "antd";
import { setFormName, saveForm, updateForm } from "../redux/utils/operateForm";
import { setErrorComponentIndex } from "../redux/utils/operateFormComponent";
import { connect } from "react-redux";
import checkAndSaveForm from "../utils/checkSaveFormUtils";
import { withRouter, params } from "react-router-dom";
import { editFormAuth } from "../../../utils/permissionUtils";
class ForBuilderHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      isTitleCanEdit: true,
      formTitleClass: "showFormTitle",
      btnCanClick: true,
      isEditAuth: false,
    };
    this.handleTitleEdit = this.handleTitleEdit.bind(this);
    this.handleChangeName = this.handleChangeName.bind(this);
    this.showModal = this.showModal.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  // 判断是否有编辑表单的权限
  componentDidMount() {
    const { match, permissions, teamId } = this.props;
    const { appId, formId } = match.params;
    let isEditAuth = editFormAuth(permissions, teamId, appId, formId);
    this.setState({
      isEditAuth
    });
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
    //如果没有表单编辑权限，则直接返回，不弹模态框
    if(!this.state.isEditAuth) {
      this.handleCancel()
      return;
    }

    if (!this.props.isFormChanged) {
      let appId = this.props.match.params.appId;
      this.props.history.push(`/app/${appId}/setting`);
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

    const checkRes = checkAndSaveForm(this.props);
    if (checkRes.res) {
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
          this.props.submissionAccess,
          this.props.name,
          this.props.verificationList,
          this.props.errMessage,
          "back"
        );
    }
  };
  handleCancel = e => {
    this.setState(state => ({
      ...state,
      visible: false
    }));
    let appId = this.props.match.params.appId;
    this.props.history.push(`/app/${appId}/setting`);
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
        {/* <Modal
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
        </Modal> */}

        {/* <div className="headerBarBack">
          <Button onClick={this.showModal} type="link">
            <Icon type="left" />
          </Button>
        </div> */}
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
          {/* {this.state.isTitleCanEdit === true ? (
            <Tooltip title="编辑">
              <img
                onClick={this.handleTitleEdit}
                src="/image/icons/editform.png"
              />
            </Tooltip>
          ) : (
            <></>
          )} */}
        </div>
        <div className="CreateFormStep" />
        <div className="CreateFormOperations">
          {/* <Button className="header-btn default">预览</Button> */}
          <Button
            disabled={!this.state.btnCanClick || !this.state.isEditAuth}
            loading={!this.state.btnCanClick || !this.state.isEditAuth}
            className="header-btn primary"
            onClick={e => {
              const checkRes = checkAndSaveForm(this.props);
              if (!checkRes.res) {
                return;
              }
              this.setState({ btnCanClick: false }, () => {
                editForm || this.props.localForm !== null
                  ? (() => {
                      const checkRes = checkAndSaveForm(this.props);
                      if (checkRes.res) {
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
                          },
                          this.props.appid,
                          this.props.extraProp,
                        );
                      } else {
                        this.props.setErrorComponentIndex(checkRes.componentsIndex);
                        this.setState({ btnCanClick: true });
                      }
                    })()
                  : (() => {
                      const checkRes = checkAndSaveForm(this.props);
                      if(checkRes.res){
                        this.props.saveForm(
                          this.props.submissionAccess,
                          this.props.name,
                          this.props.verificationList,
                          this.props.errMessage,
                          "save",
                          () => {
                            this.setState({ btnCanClick: true });
                          },
                          this.props.appid,
                          this.props.extraProp,
                        );
                      } else {
                        this.setState({ btnCanClick: true });
                      }
                    })();
              });
            }}
            type="primary"
          >
            { this.state.btnCanClick ? "保存" : "保存"}
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
    formArray: store.formBuilder.formArray,
    errMessage: store.formBuilder.errMessage,
    isFormChanged: store.formBuilder.isFormChanged,
    localForm: store.formBuilder.localForm,
    teamId: store.login.currentTeam && store.login.currentTeam.id,
    permissions: (store.login.userDetail && store.login.userDetail.permissions) || []
  }),
  {
    setFormName,
    saveForm,
    updateForm,
    setErrorComponentIndex
  }
)(withRouter(ForBuilderHeader));
