import React, { Component } from 'react';
import { connect } from "react-redux";

class PreviewHeader extends Component {

  render() {
    return (
      <div className="header-title" onClick={this.props.onClick}>
        {this.props.name}
      </div>
    )
  }
}

export default connect(
  store => ({
    name: store.formBuilder.name
  })
)(PreviewHeader);
