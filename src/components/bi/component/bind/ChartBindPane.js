import React, {PureComponent} from "react";
import ReactDOM from 'react-dom';
import { connect } from "react-redux";
import { DropTarget } from 'react-dnd';
import { Types } from './Types';
import FieldMeasureSelect from "../elements/FieldMeasureSelect";
import FieldDimension from "../elements/FieldDimension";
import DragItem from './DragItem';
import { changeBind, changeChartData } from '../../redux/action';
import { useParams } from "react-router-dom";
import request from '../../utils/request';
import { getChartAttrs } from '../../utils/ChartUtil';

/**
 * Specifies the drop target contract.
 * All methods are optional.
 */
const spec = {
  canDrop(props, monitor, component) {
    return true;
  },
  hover(props, monitor, component) {
    // Calculate the position of hover bar.
    const clientOffset = monitor.getClientOffset()
    const isOnlyThisOne = monitor.isOver({ shallow: true })
    const canDrop = monitor.canDrop()
    let dom = (ReactDOM.findDOMNode(component)).getBoundingClientRect();
  },

  drop(props, monitor, component) {
    if (monitor.didDrop()) {
      return
    }

    const item = monitor.getItem();

    if(!item) {
      return;
    }

    const { bindDataArr, dataSource, changeBind, changeChartData, elementId } = props;
    let isExisted = false, isDimExceed = false, isMeaExceed = false;

    if(bindDataArr.length != 0) {
      let dimCount = item.bindType == Types.DIMENSION ? 1 : 0;
      let meaCount = item.bindType == Types.MEASURE ? 1 : 0;
      bindDataArr.forEach((each, idx) => {
        if(each.bindType == Types.DIMENSION) {
          dimCount++;
        }

        if(each.bindType == Types.MEASURE) {
          meaCount++;
        }

        if(each.id == item.id) {
          isExisted = true;
        }
      })

      isDimExceed = dimCount > 2 || (dimCount == 2 && meaCount > 1);
      isMeaExceed = dimCount == 1 && meaCount >= 10;
    }

    if(isExisted || isDimExceed || isMeaExceed) {
      return;
    }

    const dropDim = component.getType() == Types.DIMENSION;

    if(dropDim && (item.bindType == Types.DIMENSION) || (!dropDim && (item.bindType == Types.MEASURE))) {
      bindDataArr.push(item);
    }

    processBind(bindDataArr, dataSource.id, changeBind, changeChartData, elementId);
  }
}

function processBind(bindDataArr, formId, changeBind, changeChartData, chartId) {
  const { dimensions, indexes, conditions } = getChartAttrs(bindDataArr);
    const res = request(`/bi/charts/data`, {
      method: "POST",
      data: {
        chartId,
        formId,
        dimensions,
        indexes,
        conditions
      }
    }).then((res) => {
      if(res && res.msg === "success") {
        const dataObj = res.data;
        const data = dataObj.data;
        changeChartData(data);
      }
    })

    changeBind(bindDataArr);
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

class BindPane extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { label, bindType, connectDropTarget } = this.props;

    return connectDropTarget(
      <div className="bind-line" key={label} ref={(ref)=> {this.line = ref}}>
        <div className="bind-label">{label}</div>
        {this.getItems(bindType)}
      </div>
    )
  }

  getType() {
    return this.props.bindType;
  }

  removeField = (item) => {
    let { bindDataArr, dataSource, changeBind, changeChartData, elementId } = this.props;

    const newArr = bindDataArr.filter((each)=>{
      return item.id != each.id;
    })

    processBind(newArr, dataSource.id, changeBind, changeChartData, elementId);
  }

  changeGroup = (currentGroup, id) => {
    let { bindDataArr, dataSource, changeBind, changeChartData, elementId } = this.props;
    const newArr = bindDataArr.map((each) => {
      if(id == each.id) {
        each.option.currentGroup = currentGroup
      }
      
      return each;
    })

    processBind(newArr, dataSource.id, changeBind, changeChartData, elementId);
  }

  getItems = (bindType) => {
    let { bindDataArr } = this.props;
    bindDataArr = bindDataArr || [];
    let cls = "bind-child-" + bindType;
    const components = [];

    bindDataArr.forEach(
      (each, idx) => {
        if(each.bindType == bindType && bindType == Types.DIMENSION) {
          components.push(<DragItem item={{...each, removeField: this.removeField, className: cls}} Child={FieldDimension} key={each.id}/>)
        }

        if(each.bindType == bindType && bindType == Types.MEASURE) {
          components.push(<DragItem item={{...each, removeField: this.removeField, changeGroup: this.changeGroup, className: cls}} Child={FieldMeasureSelect} key={each.id}/>)
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