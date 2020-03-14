import React from "react";
import { connect } from "react-redux";
import { DndProvider } from "react-dnd";
import { Spin } from "antd";
import {
  setActiveIndex,
  setActiveInnerIndex
} from "./redux/utils/operateFormComponent";
import {
  saveForm,
  updateForm,
  initForm,
  getAllForms
} from "./redux/utils/operateForm";
import HTML5Backend from "react-dnd-html5-backend";
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
      appid:window.location.pathname.split("/")[2],
      extraProp:{user:{name:(JSON.parse(localStorage.getItem('userDetail'))).name,id:(JSON.parse(localStorage.getItem('userDetail'))).id}}
    };

    this.editModeOn = this.editModeOn.bind(this);
  }

  componentDidMount() {
    let { formId } = this.state;
    
    const { initForm } = this.props;
    if (formId) {
      initForm(formId);
    }
    this.props.getAllForms();
    // console.log(this.props);
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

    if (this.props.toolbarItems) {
      toolbarProps.items = this.props.toolbarItems;
    }
    return (
      <div className={"formBuilder"} key={Math.random()}>
        <Spin spinning={this.props.isInitForming} >
          <FormBuilderHeader appid={this.state.appid} extraProp={this.state.extraProp} editForm={this.props.localForm} />
          <DndProvider backend={HTML5Backend}>
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
          </DndProvider>
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
    isInitForming: store.formBuilder.isInitForming
  }),
  {
    saveForm,
    updateForm,
    initForm,
    getAllForms,
    setActiveIndex,
    setActiveInnerIndex
  }
)(ReactFormBuilder);
