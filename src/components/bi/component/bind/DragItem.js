import React, { PureComponent } from 'react';
import { DragSource } from 'react-dnd';
import {Types} from './Types';
import { Icon } from "antd";
import './bind.scss';

const spec = {
  beginDrag(props, monitor, component) {
    return props.item
  },
  canDrag(props) {
    return true;
  },
  isDragging(props, monitor) {
    return monitor.getItem().id === props.id
  },
  endDrag(props, monitor, component) {
    if (!monitor.didDrop()) {
      return
    }
    const item = monitor.getItem()
    const dropResult = monitor.getDropResult()
  },
}

class DragItem extends PureComponent {
  render() {
    const { isDragging, connectDragSource, item } = this.props;
    const icontype = () => {
      if(item.type == "NUMBER"){
        return "number"
      }else {
        return "tags"
      }
    } 

    return connectDragSource(
      <div>
        <li className="bind-item"><Icon type={item.type == "NUMBER" ? "number" : "tags"}
          className="data-icon" style={{color: "#2B81FF"}}/>{item ? item.label : ""}</li>
      </div>
    )
  }
}

export default DragSource(Types.BIND, spec, (connect, monitor) => {
    return {
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging(),
    }
})(DragItem)