import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Spin } from "antd";
import {
  setActiveIndex,
  setActiveInnerIndex
} from "./redux/utils/operateFormComponent";
import { getFormsAll } from "../homePage/redux/utils/operateFormUtils";
import {
  saveForm,
  updateForm,
  initForm,
  getAllForms
} from "./redux/utils/operateForm";
import { setAllForms } from "./redux/utils/operateFormComponent";
import Preview from "./preview/preview";
import Toolbar from "./toolbar/toolbar";
import Inspector from "./inspector/inspector";
import locationUtils from "../../utils/locationUtils";
import FormBuilderHeader from "./formBuilderHeader/formBuilderHeader";
import "../../scss/index.scss";

class ReactFormBuilder extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isEditMode: false,
      editElement: null,
      editElementParent: null,
      formId: locationUtils.getUrlParamObj().formId,
      appid: window.location.pathname.split("/")[2],
      extraProp: { user: { name: this.props.userDetail.name, id: this.props.userDetail.id } }
    };

    this.editModeOn = this.editModeOn.bind(this);
  }

  componentDidMount() {
    let { formId } = this.state;
    const { initForm, setAllForms, formArray, match } = this.props;
    const { appId } = match.params;
    if (formId) {
      initForm(formId);
    }
    if (formArray.length === 0) {
      getFormsAll(appId).then(res => {
        setAllForms(res);
      });
    }
    // this.props.getAllForms();
  }
  //增加一个形参判断是否点击的是子组件里面的元素
  editModeOn(editElement, e, formChildInnerElement) {
    if (editElement == void 0) return;
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (formChildInnerElement) {
      this.setState(state => ({
        ...state,
        isEditMode: !this.state.isEditMode,
        editElement: formChildInnerElement,
        editElementParent: editElement
      }));
    } else {
      // console.log("fc", editElement)
      this.setState(state => ({
        ...state,
        isEditMode: !this.state.isEditMode,
        editElement,
        editElementParent: null
      }));
    }
    const { formData, setActiveIndex } = this.props;

    if (editElement.type === "SubmitBtn") {
      setActiveIndex(-2);
    } else {
      setActiveIndex(formData.indexOf(editElement));
    }
  }

  manualEditModeOff() {
    if (this.state.isEditMode) {
      this.setState(state => ({
        ...state,
        isEditMode: false,
        editElement: null
      }));
    }
  }

  render() {
    const toolbarProps = {};

    // console.log("fccc", this.state.editElement)
    if (this.props.toolbarItems) {
      toolbarProps.items = this.props.toolbarItems;
    }
    return (
      <div className={"formBuilder"} >
        <Spin spinning={this.props.isInitForming} >
          <FormBuilderHeader appid={this.state.appid} extraProp={this.state.extraProp} editForm={this.props.localForm} />
          <div>
            <div className="react-form-builder clearfix">
              <Toolbar {...toolbarProps} />

              <Preview
                manualEditModeOff={this.manualEditModeOff.bind(this)}
                showCorrectColumn={this.props.showCorrectColumn}
                parent={this}
                editModeOn={this.editModeOn}
                setActiveInnerIndex={this.props.setActiveInnerIndex}
                isEditMode={this.state.isEditMode}
                editElement={this.state.editElement}
                defaultForm={
                  //  this.props.localForm? this.props.localForm:null
                  null
                }
              />

              <Inspector
                key="formBuilder-inspector"
                editModeOn={this.editModeOn}
                isEditMode={this.state.isEditMode}
                editElement={this.state.editElement}
                editElementParent={this.state.editElementParent}
                defaultForm={
                  //  this.props.localForm? this.props.localForm:null
                  null
                }
              />
            </div>
          </div>
        </Spin>
      </div>
    );
  }
}

export default connect(
  store => ({
    formData: store.formBuilder.data,
    submissionAccess: store.rootData.submissionAccess,
    name: store.formBuilder.name,
    formArray: store.forms.formArray,
    verificationList: store.formBuilder.verificationList,
    errMessage: store.formBuilder.errMessage,
    localForm: store.formBuilder.localForm,
    isInitForming: store.formBuilder.isInitForming,
    userDetail: store.login.userDetail
  }),
  {
    saveForm,
    updateForm,
    initForm,
    getAllForms,
    setActiveIndex,
    setActiveInnerIndex,
    setAllForms
  }
)(withRouter(ReactFormBuilder));
