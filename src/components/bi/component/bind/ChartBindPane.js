import React, {PureComponent} from "react";
import { connect } from "react-redux";
import { DropTarget } from 'react-dnd';
import { Types } from './Types';
import { ChartType } from '../elements/Constant';
import { changeBind } from '../../redux/action';
import { useParams } from "react-router-dom";
import request from '../../utils/request';
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

    const { dim, mea, changeBind, dashboardId, elementId } = props;
    const dropDim = component.getType() == Types.DIMENSION;
// console.log("=======component=======", component, dashboardId, elementId);
    if(dropDim && (item.type == Types.DIMENSION) && !dim.includes(item.label) && dim.length < 1) {
      dim.push(item.label);
    } else if(!dropDim && (item.type == Types.MEASURE) && !mea.includes(item.label)) {
      mea.push(item.label);
    } else {
      return;
    }

    const res = request(`/bi/charts/data`, {
      method: "POST",
      data: {
        chartType: ChartType.Bar,
        // dimensions,
        // condations,
        // indexes,
        // sort
      }
    });

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
    (label) => {
      return <div className={cls} key={label}>{label}</div>
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

const ChartBindPane = (props)=> {
  const { dim, mea } = props;
  const { dashboardId, elementId } = useParams();
    return (
      <div className="bind-pane">
        <DropBindPane {...props} col={dim} type={Types.DIMENSION} dashboardId={dashboardId} elementId={elementId} label="维度" />
        <DropBindPane {...props} col={mea} type={Types.MEASURE} dashboardId={dashboardId} elementId={elementId} label="指标"/>
      </div>
    )
}

export default connect(store => ({
  dim: store.bi.dim,
  mea: store.bi.mea}),{
  changeBind
})(ChartBindPane);