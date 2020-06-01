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
import FilterModal from '../modal/FilterModal';
import { OPERATORS } from '../elements/Constant';
import { message } from 'antd';
import { processBind } from "../../utils/reqUtil";
import { getUUID, deepClone } from "../../utils/Util";
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

    const { bindDataObj } = props;
    let isExisted = false, isDimExceed = false, isForbidden = false, reOrder = false;
    const currentType = component.getType();
    const { dimensions, indexes, conditions } = bindDataObj;
    const dimCount = dimensions ? dimensions.length + (currentType == Types.DIMENSIONS ? 1 : 0) : 0;
    const idxCount = indexes ? indexes.length + (currentType == Types.INDEXES ? 1 : 0): 0;
    const filterCount = conditions ? conditions.length + (currentType == Types.CONDITIONS ? 1 : 0): 0;
    const targetArr = bindDataObj[currentType];
    isDimExceed = dimCount > 2 || (dimCount == 2 && idxCount > 1);
    const isExceed = (dimCount == 1 && idxCount > 10) || filterCount > 10;

    if(currentType == Types.DIMENSIONS || currentType == Types.CONDITIONS) {
      isExisted = targetArr.some((each) => {return each.fieldId == item.fieldId})
    }

    preProcessDrop(item, currentType);

    if(!reOrder) {
      if(isExisted) {
        message.warning("添加失败，同一字段不能重复添加！");
      }else if(isDimExceed){
        message.warning("添加失败，当前暂不支持此模式！");
      }else if(isExceed) {
        message.warning("添加失败，已超出系统限定字段数量！");
      }

      isForbidden = isExisted || isDimExceed || isExceed;
    }

    component.processDrop(item, isForbidden, currentType, component);
  }
}

function preProcessDrop(item, currentType) {
  if(currentType == Types.INDEXES) {
    item["currentGroup"] = item.bindType == Types.INDEXES ? GroupType.SUM : GroupType.COUNT;
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
  else if (currentType == Types.CONDITIONS) {
    item.bindType = Types.CONDITIONS;
    item["symbol"] = OPERATORS.EQUALS;
    item["value"] = "";
  }
  else if(currentType == Types.DIMENSIONS) {
    item["currentGroup"] = GroupType.DEFAULT;
  }

  if(item.type == DataType.DATETIME && currentType != Types.CONDITIONS) {
    item["currentGroup"] = currentType === Types.INDEXES ? GroupType.COUNT : TimeSumType.DAY;
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

    if(!visible) {
      this.setFilterItem({});
    }
  }

  setFilterItem = (filterItem) => {
    this.setState({filterItem});
  }

  changeFilter = (fieldId, symbol, value) => {
    let { bindDataObj, dataSource, changeBind, changeChartData, elemType, setElemType} = this.props;
    const arr = bindDataObj.conditions;

    const newArr = arr.map((each) => {
      if(fieldId == each.fieldId) {
        each["symbol"] = symbol;
        each["value"] = value;
      }

      return each;
    })

    bindDataObj.conditions = newArr;

    processBind({...bindDataObj}, dataSource.id, changeBind, changeChartData, elemType, setElemType);
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
    let { bindDataObj, dataSource, changeBind, changeChartData, elemType, setElemType } = this.props;
    const { dimensions, indexes, conditions } = bindDataObj;

    switch(item.bindType) {
      case Types.DIMENSIONS:
        dimensions.splice(item.index, 1)
        break;
      case Types.INDEXES:
        indexes.splice(item.index, 1)
        break;
      case Types.CONDITIONS:
        conditions.splice(item.index, 1)
        break;
    }

    // deepClone(item);

    processBind({...bindDataObj}, dataSource.id, changeBind, changeChartData, elemType, setElemType);
  }

  processDrop = (item, isForbidden, bindType, component) => {
    if(isForbidden) {
      this.clearSplit();
      return;
    }

    let { bindDataObj, dataSource, changeBind, changeChartData, elemType, setElemType } = this.props;
    let targetArr = bindDataObj[bindType]
    const { splitIdx } = this.state;

    if(Number.isInteger(item.idx)) {
      // When drag to reorder
      targetArr = targetArr.filter((each) => {
        return each.idx != item.idx;
      })

      targetArr.splice(splitIdx, 0, item);
    }
    else {
      // when drag to add
      const obj = deepClone(item);
      obj['idx'] = getUUID();
      obj.alias = obj.label;
      obj.bindType = bindType;
      targetArr.splice(splitIdx, 0, obj);

      if(bindType == Types.CONDITIONS) {
        component.changeModalVisible(true);
        component.setFilterItem(item);
        return;
      }
    }

    // @osborn 
    // if(bindDataArr.filter(item => item.bindType == Types.DIMENSIONS).length > 1){
    //   bindDataArr = bindDataArr.map(each => {
    //     if(each.bindType == Types.INDEXES){
    //       each.sort = {
    //         ...each.sort,
    //         value:SortType.DEFAULT.value
    //       }
    //     }
    //     return each;
    //   })
    // }
    bindDataObj[bindType] = targetArr;
    processBind({...bindDataObj}, dataSource.id, changeBind, changeChartData, elemType, setElemType);
    this.clearSplit();
  }

  processBegin = (idx) => {
    this.setState({dragingIdx: idx});
  }

  isUnavailable = (item) => {
    if(!item) {
      return false;
    }

    return Types.DIMENSIONS == this.getType() && Types.INDEXES == item.bindType;
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

  changeGroup = (currentGroup, idx, bindType) => {
    let { bindDataObj, dataSource, changeBind, changeChartData,  elemType, setElemType } = this.props;
    bindDataObj[bindType][idx].currentGroup = currentGroup;
    processBind({...bindDataObj}, dataSource.id, changeBind, changeChartData, elemType, setElemType);
  }

  revertSort(changeArr, revertArr, idx, fieldId) {
    changeArr.map((each, i) => {
      each.sort = i == idx ? each.sort : {fieldId, value:SortType.DEFAULT.value};
      return each;
    })

    revertArr.map((each, i) => {
      each.sort =  {fieldId, value:SortType.DEFAULT.value};
      return each;
    })
  }

  changeSortType = (sortType, idx, bindType) => {
    let { bindDataObj, dataSource, changeBind, changeChartData, elemType, setElemType } = this.props;
    const { dimensions, indexes } = bindDataObj;
    const dimCount = dimensions ? dimensions.length : 0;

    const target = bindType == Types.DIMENSIONS ? dimensions[idx] : indexes[idx];
    target.sort = {...sortType};

    if(dimCount <= 1) {
      if(bindType == Types.DIMENSIONS) {
        this.revertSort(dimensions, indexes, idx, sortType.fieldId)
      }
      else {
        this.revertSort(indexes, dimensions, idx, sortType.fieldId)
      }
    }

    processBind({...bindDataObj}, dataSource.id, changeBind, changeChartData, elemType, setElemType);
  }

  changeFieldName = (fieldName, index, bindType) => {
    let { bindDataObj, dataSource, changeBind, changeChartData, elemType, setElemType } = this.props;
    const targetArr = bindDataObj[bindType];
    targetArr[index].alias = fieldName;
    processBind({...bindDataObj}, dataSource.id, changeBind, changeChartData, elemType, setElemType);
  }

  changeDataFormat = (dataFormatObj, index) => {
    let { bindDataObj, dataSource, changeBind, changeChartData, elemType, setElemType } = this.props;
    const { indexes } = bindDataObj;
    indexes[index].dataFormat = dataFormatObj;
    processBind({...bindDataObj}, dataSource.id, changeBind, changeChartData, elemType, setElemType);
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

  getItem = (each, index, dimFiledCount) => {
    return {...each, index, dimFiledCount, changeFieldName:this.changeFieldName, changeDataFormat:this.changeDataFormat,
      removeField: this.removeField, changeGroup: this.changeGroup, changeSortType: this.changeSortType};
  }

  getItems = (bindType) => {
    const { bindDataObj } = this.props;
    const { dimensions } = bindDataObj;
    const ChildObj = {"dimensions": FieldDimension, "indexes": FieldMeasureSelect, "conditions": FilterField};
    const targetArr = bindDataObj[bindType];
    let dimFiledCount = dimensions ? dimensions.length : 0;
    const components = [];
    this.childRefs = [];
    const Child = ChildObj[bindType];

    targetArr.forEach((each, idx) => {
      const item = this.getItem(each, idx, dimFiledCount);

      if(bindType == Types.CONDITIONS) {
        item['handleFilter'] = this.handleFilter;
      }

      components.push(<DragItem ref={(ref) => { this.childRefs[idx] = ref}} item={item} Child={Child}
        key={each.fieldId + "_" + idx} processBegin={this.processBegin}/>)
    })

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
      <DropBindPane {...props} bindType={Types.DIMENSIONS} dashboardId={dashboardId} label="维度" />
      <DropBindPane {...props} bindType={Types.INDEXES} dashboardId={dashboardId} label="指标"/>
      <DropBindPane {...props} bindType={Types.CONDITIONS} dashboardId={dashboardId} label="过滤条件"/>
    </div>
  )
}

export default connect(store => ({
  bindDataObj: store.bi.bindDataObj,
  dataSource: store.bi.dataSource,
  elemType: store.bi.elemType}), {
  changeBind,
  changeChartData,
  setElemType
})(ChartBindPane);