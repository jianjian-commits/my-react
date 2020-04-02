import React, { PureComponent } from 'react';
import { DragSource } from 'react-dnd';
import {Types} from './Types';
import { Icon } from "antd";

const spec = {
  // Necessary, return the pure javascript object that can be operated by monitor -- monitor.getItem().
  beginDrag(props, monitor, component) {
    return props.item;
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
    const { isDragging, connectDragSource, item, Child } = this.props;
    return connectDragSource(
      <div>
        <Child item={item}/>
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