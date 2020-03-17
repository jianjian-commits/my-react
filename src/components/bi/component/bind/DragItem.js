import React, { PureComponent } from 'react';
import { DragSource } from 'react-dnd';
import {Types} from './Types';

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

    return connectDragSource(
      <li className="bind-item">{item ? item.text : ""}</li>
    )
  }
}

export default DragSource(Types.BIND, spec, (connect, monitor) => {
    return {
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging(),
    }
})(DragItem)