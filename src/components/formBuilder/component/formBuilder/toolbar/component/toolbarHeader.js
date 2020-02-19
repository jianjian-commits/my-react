import React, { Component } from "react";
import FormIcon from "../../../base/FormIcon";

export default class toolbarHeader extends Component {
  render() {
    const { icon, text } = this.props;
    return (
      <div className="toolbar-title">
        <span className="header-icon">
         <FormIcon icon={icon} />
        </span>
        {text}
      </div>
    );
  }
}
