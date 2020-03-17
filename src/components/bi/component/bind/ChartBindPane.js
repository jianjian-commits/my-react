import React, {PureComponent} from "react";
import { connect } from "react-redux";
import { DropTarget } from 'react-dnd';
import { Types } from './Types';
import { changeBind } from '../../redux/action';
import './bind.scss';

/**
 * Specifies the drop target contract.
 * All methods are optional.
 */
const spec = {
  canDrop(props, monitor, component) {
    return true;
  },

  hover(props, monitor, component) {
    // const clientOffset = monitor.getClientOffset()
    // const isOnlyThisOne = monitor.isOver({ shallow: true })
    // const canDrop = monitor.canDrop()
  },

  drop(props, monitor, component) {
    if (monitor.didDrop()) {
      return
    }

    const item = monitor.getItem();

    if(!item) {
      return;
    }

    const { dim, mea, changeBind } = props;
    const dropDim = component.getType() == Types.DIMENSION;

    if(dropDim && (item.type == Types.DIMENSION) && !dim.includes(item.text) && dim.length < 1) {
      dim.push(item.text);
    } else if(!dropDim && (item.type == Types.MEASURE) && !mea.includes(item.text)) {
      mea.push(item.text);
    } else {
      return;
    }

    changeBind(mea, dim);
  }
}

/**
 * Specifies which props to inject into your component.
 */
function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
    itemType: monitor.getItemType(),
    item: monitor.getItem()
  }
}

const getItems = (arr, type) => {
  arr = arr ? arr : [];
  let cls = "bind-child-" + type;

  return arr.map(
    (text) => {
      return <div className={cls} key={text}>{text}</div>
    }
  )
}

class BindPane extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { col, label, type, connectDropTarget } = this.props;

    return connectDropTarget(
      <div className="bind-line" key={label}>
        <div className="bind-label">{label}</div>
        {getItems(col, type)}
      </div>
    )
  }

  getType() {
    return this.props.type;
  }
}

const DropBindPane = DropTarget(
  Types.BIND,
  spec,
  collect,
)(BindPane)

class ChartBindPane extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { dim, mea } = this.props;
    return (
      <div className="bind-pane">
        <DropBindPane {...this.props} col={dim} type={Types.DIMENSION} label="维度"/>
        <DropBindPane {...this.props} col={mea} type={Types.MEASURE} label="指标"/>
      </div>
    )
  }
}

export default connect(store => ({
  dim: store.bi.dim,
  mea: store.bi.mea}),{
  changeBind
})(ChartBindPane);