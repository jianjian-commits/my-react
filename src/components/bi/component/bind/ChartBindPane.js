import React, {PureComponent} from "react";
import ReactDOM from 'react-dom';
import { connect } from "react-redux";
import { DropTarget } from 'react-dnd';
import { Types } from './Types';
import { ChartType } from '../elements/Constant';
import FieldMeasureSelect from "../elements/FieldMeasureSelect";
import FieldDimension from "../elements/FieldDimension";
import DragItem from './DragItem';
import { GroupType } from "../elements/Constant";
import { changeBind, changeChartData } from '../../redux/action';
import { useParams } from "react-router-dom";
import request from '../../utils/request';
import { getChartAttrs } from '../../utils/ChartUtil';
import { deepClone } from '../../utils/Util';
import classes from '../../scss/bind/bindPane.module.scss';
import { message } from 'antd';

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

    if(component.isUnavailable(monitor.getItem())) {
      return;
    }

    let rect = (ReactDOM.findDOMNode(component)).getBoundingClientRect();
    component.reOrder(clientOffset, rect);
  },

  drop(props, monitor, component) {
    if (monitor.didDrop()) {
      return
    }

    const item = monitor.getItem();

    if(component.isUnavailable(item)) {
      return;
    }

    const { bindDataArr } = props;
    let isExisted = false, isDimExceed = false, isMeaExceed = false, isForbidden = false, reOrder = false;
    const currentType = component.getType();

    if(bindDataArr.length != 0) {
      let dimCount = currentType == Types.DIMENSION ? 1 : 0;
      let meaCount = currentType == Types.MEASURE ? 1 : 0;
      bindDataArr.forEach((each, idx) => {
        if(item.idx && (item.idx == each.idx)) {
          reOrder = true;
        }

        if(each.bindType == Types.DIMENSION) {
          dimCount++;
        }

        if(each.bindType == Types.MEASURE) {
          meaCount++;
        }

        if(item.fieldId && (each.fieldId == item.fieldId) && (each.bindType == currentType) && currentType == Types.DIMENSION) {
          isExisted = true;
        }
      })

      isDimExceed = dimCount > 2 || (dimCount == 2 && meaCount > 1);
      isMeaExceed = dimCount == 1 && meaCount > 10;
    }

    if(!reOrder) {
      if(isExisted) {
        message.warning("添加失败，同一字段不能重复添加维度！");
      }else if(isDimExceed){
        message.warning("添加失败，当前暂不支持此模式！");
      }else if(isMeaExceed){
        message.warning("添加失败，已超出系统限定字段数量！");
      }

      isForbidden = isExisted || isDimExceed || isMeaExceed;
    }

    component.processDrop(item, isForbidden, currentType);
  }
}

function processBind(bindDataArr, formId, changeBind, changeChartData) {
  const { dimensions, indexes, conditions } = getChartAttrs(bindDataArr);
    const res = request(`/bi/charts/data`, {
      method: "POST",
      data: {
        formId,
        dimensions,
        indexes,
        conditions,
        chartType: ChartType.HISTOGRAM
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

    this.state = {
      splitDiv: null,
      splitIdx: -1,
      dragingIdx: -1
    }
  }

  componentDidUpdate() {
    if(!this.props.isOver) {
      this.clearSplit();
    }
  }

  render() {
    const { label, bindType, connectDropTarget } = this.props;
    const { splitIdx, splitDiv } = this.state;
    let items = this.getItems(bindType);

    if(splitIdx != -1) {
      items.splice(splitIdx, 0, splitDiv);
    }

    return connectDropTarget(
      <div className={classes.bindLine} key={label} ref={(ref)=> {this.line = ref}} >
        <div className={classes.bindLabel} ref={(ref)=>{this.labelRef = ref}}>{label}</div>
        <div className={classes.bindCols}>{items}</div>
      </div>
    )
  }

  getType() {
    return this.props.bindType;
  }

  removeField = (item) => {
    let { bindDataArr, dataSource, changeBind, changeChartData } = this.props;
    const newArr = bindDataArr.filter((each) => {
      return item.idx != each.idx;
    })
    processBind(newArr, dataSource.id, changeBind, changeChartData);
  }

  processDrop = (item, isForbidden, bindType) => {
    if(isForbidden) {
      this.clearSplit();
      return;
    }

    let { bindDataArr, dataSource, changeBind, changeChartData } = this.props;
    const { splitIdx } = this.state;

    if(Number.isInteger(item.idx)) {
      // When drag to reorder
      bindDataArr = bindDataArr.filter((each) => {
        return each.idx != item.idx;
      })

      bindDataArr.splice(splitIdx, 0, item);
    }
    else {
      // when drag to add
      const obj = deepClone(item);
      obj['idx'] = Date.now();
      obj.bindType = bindType;
      bindDataArr.splice(splitIdx, 0, obj);
    }

    processBind(bindDataArr, dataSource.id, changeBind, changeChartData);
    this.clearSplit();
  }

  processBegin = (idx) => {
    this.setState({dragingIdx: idx});
  }

  isUnavailable = (item) => {
    if(!item) {
      return false;
    }

    return Types.DIMENSION == this.getType() && Types.MEASURE == item.bindType;
  }

  reOrder = (pos, rect) => {
    const splitDiv = <div className={classes.bindSplitDiv} key={Date.now()}/>
    const labelRect = (ReactDOM.findDOMNode(this.labelRef)).getBoundingClientRect();
    
    const diff = pos.x - rect.x - labelRect.width;
    let offset = 0;
    let splitIdx = 0;

    if(this.childRefs.length == 0) {
      this.setState({splitIdx, splitDiv});
      return;
    }

    this.childRefs.forEach((ref, idx) => {
      const childRect = (ReactDOM.findDOMNode(ref)).getBoundingClientRect();
      const half = childRect.width / 2;

      if(diff > offset + half) {
        splitIdx++;
      }
      else if(diff < offset + half) {
        this.setState({splitIdx, splitDiv});
        return;
      }

      offset += childRect.width;
    })

    this.setState({splitIdx, splitDiv});
  }

  clearSplit = () => {
    this.setState({splitIdx: -1, splitDiv: null, dragingIdx: -1});
  }

  changeGroup = (currentGroup, fieldId) => {
    let { bindDataArr, dataSource, changeBind, changeChartData } = this.props;
    const newArr = bindDataArr.map((each) => {
      if(fieldId == each.fieldId) {
        each.option.currentGroup = currentGroup
      }
      return each;
    })
    processBind(newArr, dataSource.id, changeBind, changeChartData);
  }

  changeSortType = (sortType, fieldId) => {
    let { bindDataArr, dataSource, changeBind, changeChartData } = this.props;
    const newArr = bindDataArr.map((each) => {
      if(fieldId == each.fieldId) {
        each.option.sort = {
          "fieldId": fieldId,
          ...sortType
        }
      }else{
        each.option.sort = {
          "fieldId": fieldId,
          value:"DEFAULT"
        }
      }
      return each;
    })
    processBind(newArr, dataSource.id, changeBind, changeChartData);
  }

  getItems = (bindType) => {
    let { bindDataArr } = this.props;
    bindDataArr = bindDataArr || [];
    let cls = "bind-child-" + bindType;
    const components = [];
    this.childRefs = [];

    bindDataArr.forEach(
      (each, idx) => {
        if(each.bindType == bindType && bindType == Types.DIMENSION) {
          components.push(<DragItem ref={(ref) => { this.childRefs[idx] = ref}} item={{...each, removeField: this.removeField,
            className: cls,changeGroup: this.changeGroup,changeSortType:this.changeSortType}} Child={FieldDimension} key={each.fieldId + "_" + idx} processBegin={this.processBegin}/>)
        }

        if(each.bindType == bindType && bindType == Types.MEASURE) {
          let selectIndex = 0;

          for(let key in GroupType) {
            if(key == each.option.currentGroup.value) {
              break;
            }

            selectIndex++;
          }

          components.push(<DragItem ref={(ref) => { this.childRefs[idx] = ref }} item={{...each, removeField: this.removeField,
            changeGroup: this.changeGroup, className: cls, selectIndex,changeSortType:this.changeSortType}} Child={FieldMeasureSelect} key={each.fieldId + "_" + idx}
            processBegin={this.processBegin}/>)
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
  const { dashboardId } = useParams();

    return (
      <div className={classes.bindPane}>
        <DropBindPane {...props} bindType={Types.DIMENSION} dashboardId={dashboardId} label="维度" />
        <DropBindPane {...props} bindType={Types.MEASURE} dashboardId={dashboardId} label="指标"/>
      </div>
    )
}

export default connect(store => ({
  bindDataArr: store.bi.bindDataArr,
  dataSource: store.bi.dataSource,
   chartType: store.bi.chartType}), {
  changeBind,
  changeChartData
})(ChartBindPane);