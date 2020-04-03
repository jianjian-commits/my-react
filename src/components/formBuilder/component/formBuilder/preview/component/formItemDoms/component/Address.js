import React, { Component } from "react";
import ComponentBox from '../componentBox';
import { ComponentHeader } from '../utils/commonDom';
import { Select, Input } from "antd";

const { Option } = Select;
const { TextArea } = Input;

export default class Address extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const props = {};
    props.type = "text";
    props.className = "form-control address";
    props.name = this.props.data.field_name;

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
            <div className="form-address">
              <div className="row">
                <Select defaultValue="none">
                  <Option value="none">-请选择省-</Option>
                </Select>
                <Select defaultValue="none">
                  <Option value="none">-请选择市-</Option>
                </Select>
                <Select defaultValue="none">
                  <Option value="none">-请选择县-</Option>
                </Select>
              </div>
              {
                this.props.data.addressType === "noDetail" ?
                  <></> :
                  <div className="row">
                    <TextArea style={{resize: "none"}} rows={2} />
                  </div>
              }
            </div>
          </>
        }
      />
    );
  }
}
