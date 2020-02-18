import React, { Component } from 'react'
import { Icon, Tooltip } from 'antd'

export default class PositionCenterItem extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  handleEdit = () => {
    this.props.showEditModal(this.props.index);
  }
  handleDelete = () => {

    this.props.deleteItem(this.props.index);
  }
  render() {
    const { center, latitude, longitude, orientationRange } = this.props.item;
    // console.log("item index", this.props.index)
    return (
      <div className="position-center-item">
        <div className="address-text">
          {center}
        </div>
        <div className="action-btn-container">
        <Tooltip title="编辑">
          <img
            onClick={this.handleEdit}
            src="/image/icons/editform.png"
          />
        </Tooltip>
        </div>
        <div className="action-btn-container">
        <Tooltip title="删除">
          <img
            src="/image/icons/delete2_hover.png"
            onClick={this.handleDelete}
          />
        </Tooltip>
        </div>
      </div>
    )
  }
}
