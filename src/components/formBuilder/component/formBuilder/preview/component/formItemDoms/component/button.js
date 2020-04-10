import React, { Component } from "react";
import { connect } from "react-redux";
import { Button } from "antd";
import ComponentBox from '../componentBox';
import { ComponentHeader, ComponentLabel } from '../utils/commonDom';

export default class SubmitButton extends Component {
  render() {
    const props = {};
    props.type = 'text';
    props.className = 'form-control button';
    props.name = this.props.data.field_name;
    if (this.props.mutable) {
        props.defaultValue = this.props.defaultValue;
        props.ref = this.inputField;
    }

    let baseClasses = 'SortableItem rfb-item';
    if (this.props.data.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

    if (this.props.read_only) {
        props.disabled = 'disabled';
    }

    if(this.props.active) {
        baseClasses += " active";
      }
    const button = this.props.data;
    return (
        <ComponentBox
            {...this.props}
            className={baseClasses}
            content={
                <>
                    <ComponentHeader {...this.props} active={this.props.active} />
                    <div className="form-group">
                        <div className="submit-btn">
                          <Button type={button.buttonStyle} size={button.buttonSize}>
                            {button.label}
                          </Button>
                        </div>
                    </div>
                </>
            }
        />
    );
}

}
