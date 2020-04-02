import React, { PureComponent } from 'react';
import { DragSource } from 'react-dnd';
import {Types} from './Types';
import { Icon } from "antd";

const spec = {
  // Necessary, return the pure javascript object that can be operated by monitor -- monitor.getItem().
  beginDrag(props, monitor, component) {
    const item = props.item;

    if(props.processBegin && item) {
      props.processBegin(item.idx);
    }

    return item;
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

class DragItemComp extends PureComponent {
  render() {
    const { isDragging, connectDragSource, item, Child } = this.props;
    return connectDragSource(
      <div>
        <Child item={item}/>
      </div>
    )
  }
}

const DimDragItem = DragSource(Types.DIMENSION, spec, (connect, monitor) => {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  }
})(DragItemComp)

const MeaDragItem = DragSource(Types.MEASURE, spec, (connect, monitor) => {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  }
})(DragItemComp)

export {DimDragItem, MeaDragItem}