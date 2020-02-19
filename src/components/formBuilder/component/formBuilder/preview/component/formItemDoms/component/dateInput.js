import React, { Component } from "react";
import { DatePicker } from "antd";
import ComponentBox from "../componentBox";
import { ComponentHeader } from "../utils/commonDom";

export default class DateInput extends Component {
  onChange = (value, dateString) => {
    console.log("Selected Time: ", value);
    console.log("Formatted Selected Time: ", dateString);
  };

  render() {
    const props = {};
    props.type = "text";
    props.className = "form-control";
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

    if(this.props.active) {
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
              <DatePicker showTime onChange={this.onChange} placeholder="请选择时间/日期" />
            </div>
          </>
        }
      />
    );
  }
}
