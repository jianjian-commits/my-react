import React, {PureComponent} from "react";
import ReactDOM from 'react-dom';
import { connect } from "react-redux";
import { DropTarget } from 'react-dnd';
import { Types } from './Types';
import { DataType, TimeSumType } from '../elements/Constant';
import FieldMeasureSelect from "../elements/FieldMeasureSelect";
import FieldDimension from "../elements/FieldDimension";
import FilterField from '../bind/field/FilterField';
import DragItem from './DragItem';
import { GroupType,SortType } from "../elements/Constant";
import { changeBind, changeChartData, setElemType } from '../../redux/action';
import { useParams } from "react-router-dom";
import { deepClone } from '../../utils/Util';
import FilterModal from '../modal/FilterModal';
import { OPERATORS } from '../elements/Constant';
import { message } from 'antd';
import { processBind } from "../../utils/reqUtil";
import { getUUID } from "../../utils/Util";
import classes from '../../scss/bind/bindPane.module.scss';

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
    let isExisted = false, isDimExceed = false, isFilterExceed = false, isMeaExceed = false, isForbidden = false, reOrder = false;
    const currentType = component.getType();

    preProcessDrop(item, currentType);

    if(bindDataArr.length != 0) {
      let dimCount = currentType == Types.DIMENSION ? 1 : 0;
      let meaCount = currentType == Types.MEASURE ? 1 : 0;
      let filterCount = currentType == Types.FILTER ? 1 : 0;
      bindDataArr.forEach((each, idx) => {
        const fieldExisted = item.fieldId && (each.fieldId == item.fieldId);
        if(item.idx && (item.idx == each.idx)) {
          reOrder = true;
        }

        if(each.bindType == Types.DIMENSION) {
          isExisted = fieldExisted && (currentType == Types.DIMENSION)
          dimCount++;
        } else if(each.bindType == Types.MEASURE) {
          meaCount++;
        } else if(each.bindType == Types.FILTER) {
          filterCount++;
          isExisted = fieldExisted && (currentType == Types.FILTER)
        }
      })

      isDimExceed = dimCount > 2 || (dimCount == 2 && meaCount > 1);
      isMeaExceed = dimCount == 1 && meaCount > 10;
      isFilterExceed = filterCount > 10;
    }

    if(!reOrder) {
      if(isExisted) {
        message.warning("添加失败，同一字段不能重复添加维度！");
      }else if(isDimExceed){
        message.warning("添加失败，当前暂不支持此模式！");
      }else if(isMeaExceed || isFilterExceed) {
        message.warning("添加失败，已超出系统限定字段数量！");
      }

      isForbidden = isExisted || isDimExceed || isMeaExceed || isFilterExceed;
    }

    component.processDrop(item, isForbidden, currentType, component);
  }
}

function preProcessDrop(item, currentType) {
  if(currentType == Types.MEASURE) {
    item["currentGroup"] = item.bindType == Types.MEASURE ? GroupType.SUM : GroupType.COUNT;
    item["dataFormat"]  = {
      custom: {
        "format": "string"
      },
      predefine: {
        "decimals": 0,
        "percent": false,
        "thousandSymbols": true
      },
      selectType: "PREDEFINE"
    };
  }
  else if (currentType == Types.FILTER) {
    item.bindType = Types.FILTER;
    item["symbol"] = OPERATORS.EQUALS;
    item["value"] = "";
  }
  else if(currentType == Types.DIMENSION) {
    item["currentGroup"] = GroupType.DEFAULT;
  }

  if(item.type == DataType.DATETIME && currentType != Types.FILTER) {
    item["currentGroup"] = currentType === Types.MEASURE ? GroupType.COUNT : TimeSumType.DAY;
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

class BindPane extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      splitDiv: null,
      splitIdx: -1,
      dragingIdx: -1,
      visible: false,
      filterItem: {}
    }
  }

  componentDidUpdate() {
    if(!this.props.isOver) {
      this.clearSplit();
    }
  }

  changeModalVisible = (visible) => {
    this.setState({visible});
    this.setFilterItem({});
  }

  setFilterItem = (filterItem) => {
    this.setState({filterItem});
  }

  changeFilter = (fieldId, symbol, value) => {
    let { bindDataArr, dataSource, changeBind, changeChartData, elemType, setElemType} = this.props;
    const newArr = bindDataArr.map((each) => {
      if(fieldId == each.fieldId && each.bindType == Types.FILTER) {
        each["symbol"] = symbol;
        each["value"] = value;
      }

      return each;
    })

    processBind(newArr, dataSource.id, changeBind, changeChartData, elemType, setElemType);
  }

  render() {
    const { label, bindType, connectDropTarget } = this.props;
    const { splitIdx, splitDiv, visible, filterItem } = this.state;
    let items = this.getItems(bindType);

    if(splitIdx != -1) {
      items.splice(splitIdx, 0, splitDiv);
    }

    return connectDropTarget(
      <div className={classes.bindLine} key={label} ref={(ref)=> {this.line = ref}} >
        {visible ? <FilterModal key="FilterModal" visible={visible} setVisible={this.changeModalVisible}
          item={filterItem} changeFilter={this.changeFilter} /> : null}
        <div className={classes.bindLabel} ref={(ref)=>{this.labelRef = ref}}>{label}</div>
        <div className={classes.bindCols}>{items}</div>
      </div>
    )
  }

  getType() {
    return this.props.bindType;
  }

  removeField = (item) => {
    let { bindDataArr, dataSource, changeBind, changeChartData, elemType, setElemType } = this.props;

    const newArr = bindDataArr.filter((each) => {
      return item.idx != each.idx;
    })

    processBind(newArr, dataSource.id, changeBind, changeChartData, elemType, setElemType);
  }

  processDrop = (item, isForbidden, bindType, component) => {
    if(isForbidden) {
      this.clearSplit();
      return;
    }

    let { bindDataArr, dataSource, changeBind, changeChartData, elemType, setElemType } = this.props;
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
      obj['idx'] = getUUID();
      obj.alias = obj.label;
      obj.bindType = bindType;
      bindDataArr.splice(splitIdx, 0, obj);
      if(bindType == Types.FILTER) {
        component.changeModalVisible(true);
        component.setFilterItem(item);
        return;
      }
    }
    if(bindDataArr.filter(item => item.bindType == Types.DIMENSION).length > 1){
      bindDataArr = bindDataArr.map(each => {
        if(each.bindType == Types.MEASURE){
          each.sort = {
            ...each.sort,
            value:SortType.DEFAULT.value
          }
        }
        return each;
      })
    }
    processBind(bindDataArr, dataSource.id, changeBind, changeChartData, elemType, setElemType);
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
    let { bindDataArr, dataSource, changeBind, changeChartData,  elemType, setElemType } = this.props;
    const newArr = bindDataArr.map((each) => {
      if(fieldId == each.fieldId && each.bindType != Types.FILTER) {
        each.currentGroup = currentGroup
      }

      return each;
    })

    processBind(newArr, dataSource.id, changeBind, changeChartData, elemType, setElemType);
  }

  changeSortType = (sortType, fieldId) => {
    let { bindDataArr, dataSource, changeBind, changeChartData, elemType, setElemType } = this.props;
    const meaFiledCount = bindDataArr.filter(item => item.bindType == Types.MEASURE).length;
    const dimFiledCount = bindDataArr.filter(item => item.bindType == Types.DIMENSION).length;
    let newArr = [];
    if(dimFiledCount <= 1){
      newArr = bindDataArr.map((each) => {
        if(fieldId == each.fieldId) {
          each.sort = {
            fieldId,
            ...sortType
          }
        }else{
          each.sort = {
            fieldId,
            value:SortType.DEFAULT.value
          }
        }
        return each;
      })
    }else{
      newArr = bindDataArr.map((each) => {
        if(fieldId == each.fieldId) {
          each.sort = {
            fieldId,
            ...sortType
        }
      }
        return each;
      })
    }
    processBind(newArr, dataSource.id, changeBind, changeChartData, elemType, setElemType);
  }

  changeFieldName = (fieldName , fieldId) => {
    let { bindDataArr, dataSource, changeBind, changeChartData, elemType, setElemType } = this.props;
    const newArr = bindDataArr.map((each) => {
        if(fieldId == each.fieldId) {
          each = {
            ...each,
            alias:fieldName
          }
        }
        return each;
      })
    processBind(newArr, dataSource.id, changeBind, changeChartData, elemType, setElemType);
  }

  changeDataFormat = (dataFormatObj,fieldId) => {
    let { bindDataArr, dataSource, changeBind, changeChartData, elemType, setElemType } = this.props;
    const newArr = bindDataArr.map((each) => {
        if(fieldId == each.fieldId) {
          each.dataFormat = {...dataFormatObj}
        }
        return each;
      })
    processBind(newArr, dataSource.id, changeBind, changeChartData, elemType, setElemType);
  }

  handleFilter = (type, item) => {
    if(type == "remove") {
      this.setFilterItem({});
      this.removeField(item);
    }
    else if(type == "modify") {
      this.setFilterItem(item);
      this.changeModalVisible(true);
    }
  }

  getItems = (bindType) => {
    let { bindDataArr } = this.props;
    bindDataArr = bindDataArr || [];
    const components = [];
    this.childRefs = [];
    const dimFiledCount = bindDataArr.filter(item => item.bindType == "dim").length;
    bindDataArr.forEach(
      (each, idx) => {
        if(each.bindType == bindType) {
          const item = {...each, changeFieldName:this.changeFieldName, changeDataFormat:this.changeDataFormat,removeField: this.removeField, changeGroup: this.changeGroup, changeSortType: this.changeSortType,dimFiledCount};
          const key = each.fieldId + "_" + idx;
          
          if(bindType == Types.DIMENSION) {
            components.push(<DragItem ref={(ref) => { this.childRefs[idx] = ref}} item={item} key={key} Child={FieldDimension}
              processBegin={this.processBegin}/>)
          }
          else if(bindType == Types.MEASURE) {
            components.push(<DragItem ref={(ref) => { this.childRefs[idx] = ref }} item={item} key={key} Child={FieldMeasureSelect} 
              processBegin={this.processBegin}/>)
          }
          else if(bindType == Types.FILTER) {
            item['handleFilter'] = this.handleFilter;
            components.push(<DragItem ref={(ref) => { this.childRefs[idx] = ref}} item={item} key={key} Child={FilterField}
              processBegin={this.processBegin}/>)
          }
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
        <DropBindPane {...props} bindType={Types.FILTER} dashboardId={dashboardId} label="过滤条件"/>
      </div>
    )
}

export default connect(store => ({
  bindDataArr: store.bi.bindDataArr,
  dataSource: store.bi.dataSource,
  elemType: store.bi.elemType}), {
  changeBind,
  changeChartData,
  setElemType
})(ChartBindPane);