import React, {PureComponent} from "react";
import { connect } from "react-redux";
import { DropTarget } from 'react-dnd';
import { Types } from './Types';
import FieldTargetSelect from "./FieldTargetSelect";
import { ChartType } from '../elements/Constant';
import { changeBind, changeChartData } from '../../redux/action';
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

    const { bindDataArr, dataSource, changeBind, changeChartData, dashboardId, elementId } = props;
    const dropDim = component.getType() == Types.DIMENSION;
    let dimensions = [], indexes = [];

    if(dropDim && (item.bindType == Types.DIMENSION) || (!dropDim && (item.bindType == Types.MEASURE))) {
      bindDataArr.push(item);
    }

    const currentGroup = { name: "", value: "COUNT" };
    const groups = [{ name: "", value: "COUNT" }];
    const sort = { id: "", value: "DEFAULT" };
    const conditions = [];

    bindDataArr.forEach((each) => {
      const field = Object.assign({}, each);
      delete field.bindType;

      switch(each.bindType) {
        case Types.DIMENSION:
          dimensions.push({field, currentGroup, groups, sort});
          break;
        case Types.MEASURE:
          indexes.push({currentGroup: {name: "求和", value: "SUM"}, field, groups, sort});
          break;
        default:
          console.log("wrong type!")
      }
    })
    const res = request(`/bi/charts/data`, {
      method: "POST",
      data: {
        formId: dataSource.id,
        dimensions,
        indexes,
        conditions
}
    }).then((res) => {
      if(res && res.msg === "success") {
        const dataObj = res.data;
        const data = dataObj.data;

        if(data) {
          const xaxisList = data.xaxisList;
          changeChartData(xaxisList);
        }
      }
    })

    changeBind(bindDataArr);
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
      return type == "dim" ?
      <div className={cls} key={text}>{text}</div>:
      <FieldTargetSelect label = {text} className={cls} key={text}/> 
    }
  )
}

class BindPane extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { col, label, bindType, connectDropTarget } = this.props;

    return connectDropTarget(
      <div className="bind-line" key={label}>
        <div className="bind-label">{label}</div>
        {this.getItems(bindType)}
      </div>
    )
  }

  getType() {
    return this.props.bindType;
  }

  getItems = (bindType) => {
    let { bindDataArr } = this.props;
    bindDataArr = bindDataArr || [];
    let cls = "bind-child-" + bindType;
    const components = [];

    bindDataArr.forEach(
      (item) => {
        if(item.bindType == bindType) {
          components.push(<div className={cls} key={item.id}>{item.label}</div>)
        }
      }
    )

    return components;
  }
}

const DropBindPane = DropTarget(
  Types.BIND,
  spec,
  collect,
)(BindPane)

const ChartBindPane = (props)=> {
  const { dashboardId, elementId } = useParams();

    return (
      <div className="bind-pane">
        <DropBindPane {...props} bindType={Types.DIMENSION} dashboardId={dashboardId} elementId={elementId} label="维度" />
        <DropBindPane {...props} bindType={Types.MEASURE} dashboardId={dashboardId} elementId={elementId} label="指标"/>
      </div>
    )
}

export default connect(store => ({
  bindDataArr: store.bi.bindDataArr,
  dataSource: store.bi.dataSource}), {
  changeBind,
  changeChartData
})(ChartBindPane);