import React from "react";
import { Button, Modal } from "../../../../shared/customWidget";
import { Icon, Tooltip, Spin } from "antd";
import { setFormName, saveForm, updateForm } from "../redux/utils/operateForm";
import { HomeContentTitle } from "../../../../content/HomeContent";
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
      btnCanClick: true,
      isEditAuth: false,
    };
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

  componentWillReceiveProps(nextProps) {
    const { match, permissions, teamId } = nextProps;
    const { appId, formId } = match.params;
    let isEditAuth = editFormAuth(permissions, teamId, appId, formId);
    this.setState({
      isEditAuth
    });
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
    const saveHandle = e => {
      const checkRes = checkAndSaveForm(this.props);
      console.log(this.props);
      if (!checkRes.res) {
        return;
      }
      this.setState({ btnCanClick: false }, () => {
        console.log("我被执行了....");
        editForm || this.props.localForm !== null
          ? (() => {
            console.log("执行第一步");
              const checkRes = checkAndSaveForm(this.props);
              if (checkRes.res) {
                
                console.log(updateForm);
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
    };
    return (
      <HomeContentTitle title="编辑表单" btns={this.state.isEditAuth ? <Button
        disabled={!this.state.btnCanClick}
        loading={!this.state.btnCanClick}
        onClick={saveHandle}
        type="primary"
      >
        保存
      </Button> : null}/>
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
    teamId: store.login.currentCompany && store.login.currentCompany.id,
    permissions: (store.login.userDetail && store.login.userDetail.permissions) || []
  }),
  {
    setFormName,
    saveForm,
    updateForm,
    setErrorComponentIndex
  }
)(withRouter(ForBuilderHeader));
