import React from "react";
import ComponentBox from "../componentBox";
import { ComponentHeader } from "../utils/commonDom";
import { Button } from "antd";

export default class FileUpload extends React.Component {
  constructor(props) {
    super(props);
    this.inputField = React.createRef();
  }

  render() {
    const props = {};
    props.type = "text";
    props.className = "form-control fileUpload";
    props.name = this.props.data.field_name;
    if (this.props.mutable) {
      props.defaultValue = this.props.defaultValue;
      props.ref = this.inputField;
    }

    let baseClasses = "SortableItem rfb-item";
    if (this.props.data.pageBreakBefore) {
      baseClasses += " alwaysbreak";
    }

    if (this.props.read_only) {
      props.disabled = "disabled";
    }

    if (this.props.active) {
      baseClasses += " active";
    }

    return (
      <ComponentBox
        {...this.props}
        className={baseClasses}
        content={
          <>
            <ComponentHeader {...this.props} active={this.props.active} />
            <div className="form-group">
              <div className="localposition-container">
                <Button type="dashed">
                  <img src="/image/icons/file2.png" alt="" />
                  上传附件
                </Button>
              </div>
            </div>
          </>
        }
      />
    );
  }
}
