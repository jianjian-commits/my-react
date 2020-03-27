import React from "react";
import { Tabs } from "antd";
import SingleTextInspector from "./component/singleTextInspector";
import PhoneInputInspector from "./component/phoneInputInspector";
import RadioInputInspector from "./component/radioInputInspector";
import NumberInputInspector from "./component/numberInputInspector";
import DropDownInspector from "./component/dropDownInspector";
import IdCardInspector from "./component/idCardInspector";
import CheckboxInspector from "./component/checkboxInspector";
import DateInputInspector from "./component/dateInputInspector";
import FileUploadInspector from "./component/fileUploadInspector";
import SignatureInspector from "./component/signatureInspector";
import SetFormName from "./component/setFormName";
import FormChildInspector from "./component/formChildInspector";
import FormVerification from "./formVerification/formVerification";
import TextAreaInspector from "./component/textAreaInspector";
import MultiDropDownInspector from "./component/multiDropDownInspector";
import SubmitBtnInspector from "./component/submitBtnInspector";

import ImageUploadInspector from "./component/imageUploadInspector";
import FormChildTestInspector from "./component/formChildTestInspector";
import GetLocalPositionInspector from "./component/getLocalPosition/getLocalPositionInspector";
import AddressInspector from "./component/addressInspector";

const { TabPane } = Tabs;

export default class Inspector extends React.Component {
  constructor(props) {
    super(props);

    this.editForm = React.createRef();
  }

  _manualEditModeOff = () => {
    const { editElement } = this.props;
    if (editElement && editElement.dirty) {
      editElement.dirty = false;
      this.updateElement(editElement);
    }
    this.props.manualEditModeOff();
  };

  editModeOff = e => {
    if (this.editForm.current && !this.editForm.current.contains(e.target)) {
      this._manualEditModeOff();
    }
  };

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.editModeOff);
  }

  renderComponentByType(editElement, editElementParent) {
    const { element, type } = editElement;

    switch (element || type) {
      case "SingleText":
        return (
          <SingleTextInspector
            key={editElement.key}
            elementParent={editElementParent}
            element={editElement}
          />
        );
      case "TextArea":
        return (
          <TextAreaInspector
            key={editElement.key}
            elementParent={editElementParent}
            element={editElement}
          />
        );
      case "EmailInput":
        return (
          <PhoneInputInspector
            key={editElement.key}
            elementParent={editElementParent}
            element={editElement}
          />
        );
      case "PhoneInput":
        return (
          <PhoneInputInspector
            key={editElement.key}
            elementParent={editElementParent}
            element={editElement}
          />
        );
      case "NumberInput":
        return (
          <NumberInputInspector
            key={editElement.key}
            elementParent={editElementParent}
            element={editElement}
          />
        );
      case "RadioButtons":
        return (
          <RadioInputInspector
            key={editElement.key}
            elementParent={editElementParent}
            element={editElement}
          />
        );
      case "DropDown":
        return (
          <DropDownInspector
            key={editElement.key}
            elementParent={editElementParent}
            element={editElement}
          />
        );
      case "CheckboxInput":
        return (
          <CheckboxInspector
            key={editElement.key}
            elementParent={editElementParent}
            element={editElement}
          />
        );
      case "IdCardInput":
        return (
          <IdCardInspector
            key={editElement.key}
            elementParent={editElementParent}
            element={editElement}
          />
        );
      case "DateInput":
        return (
          <DateInputInspector
            key={editElement.key}
            elementParent={editElementParent}
            element={editElement}
          />
        );
      case "FileUpload":
        return (
          <FileUploadInspector
            key={editElement.key}
            elementParent={editElementParent}
            element={editElement}
          />
        );
      case "MultiDropDown":
        return (
          <MultiDropDownInspector
            key={editElement.key}
            elementParent={editElementParent}
            element={editElement}
          />
        );
      case "ImageUpload":
        return (
          <ImageUploadInspector
            key={editElement.key}
            elementParent={editElementParent}
            element={editElement}
          />
        );
      case "GetLocalPosition":
        return (
          <GetLocalPositionInspector
            key={editElement.key}
            elementParent={editElementParent}
            element={editElement}
          />
        );
      case "FormChildTest":
        return (
          <FormChildTestInspector elementParent={editElementParent} key={editElement.key} element={editElement} />
        );
      case "SetFormName":
        return <SetFormName key={editElement.key} />;
      case "FormChild":
        return (
          <FormChildInspector key={editElement.key} element={editElement} />
        );
      case "HandWrittenSignature":
        return (
          <SignatureInspector key={editElement.key} element={editElement} />
        );
      case "Address":
        return (
          <AddressInspector element={editElement} elementParent={editElementParent} key={editElement.key} element={editElement} />
        );
      case "Button":
        return (
          <SubmitBtnInspector key={editElement.key} element={editElement} />
        );
      default:
        return <div></div>;
    }
  }

  render() {
    console.log("12ww", this.props.editElement)
    return (
      <div className="react-form-builder-inspector">
        <Tabs defaultActiveKey="1" className="tab-bar">
          <TabPane tab="字段属性" key="1">
            {this.props.editElement !== null &&
              this.renderComponentByType(
                this.props.editElement,
                this.props.editElementParent
              )}
            {this.props.editElement === null ? (
              <span className="NoChooseTag">请选择一个组件</span>
            ) : (
                <></>
              )}
          </TabPane>
          <TabPane tab="表单属性" key="2">
            <FormVerification defaultForm={this.props.defaultForm} />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

Inspector.defaultProps = {
  files: [],
  isEditMode: false,
  editElement: null
};
