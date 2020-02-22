import React, { Component } from 'react'
import { lengthTip } from "./getLengthTip"
export default class LabelUtils extends Component {
  isTextInput = (type) => {
    let isNeed = false;
    switch (type) {
      case "SingleText": isNeed = true; break;
      case "TextArea": isNeed = true; break;
      case "NumberInput": isNeed = true; break;
      case "MultiDropDown": isNeed = true; break;
      case "FileUpload": isNeed = true; break;
      case "ImageUpload": isNeed = true; break;
      case "CheckboxInput": isNeed = true; break;
      default: isNeed = false;
    }
    return isNeed;
  }

  isRadio = (type) => {
    let isRadio = false;
    switch (type) {
      case "SingleText": isRadio = true; break;
      case "TextArea": isRadio = true; break;
      case "NumberInput": isRadio = true; break;
      case "EmailInput": isRadio = true; break;
      case "CheckboxInput": isRadio = true; break;
      case "PhoneInput": isRadio = true; break;
      case "IdCardInput": isRadio = true; break;
      case "MultiDropDown": isRadio = true; break;
      case "DropDown": isRadio = true; break;
      case "RadioButtons": isRadio = true; break;
      case "FileUpload": isRadio = true; break;
      case "ImageUpload": isRadio = true; break;
      case "DateInput": isRadio = true; break;
      case "HandWrittenSignature": isRadio = true; break;
      case "FormChildTest": isRadio = true; break;
      case "GetLocalPosition": isRadio = true; break;
      default: isRadio = false;
    }
    return isRadio;
  }
  render() {
    const { data } = this.props;
    return (
      <React.Fragment>
        <div id={data.key + "Title"}>
          <span className="label label-default">{data.label}
            {
              data.validate.required ? <span className="red-star">*</span> : null
            }
          </span>
          <span className="lengthTip">
            {
              this.isTextInput(data.type) ? lengthTip(data) : null
            }
          </span>
            {
              (this.isRadio(data.type) && data.tooltip && data.tooltip !== "") ?<span className="radio-tooltip"> {data.tooltip}</span> : null
            }
        </div>
      </React.Fragment>
    )
  }
}
