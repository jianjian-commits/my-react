import React, { Component } from "react";
import { Select, Input, Tooltip, Icon, Button, Divider, message, Row, Col, DatePicker } from "antd";
import locale from 'antd/lib/date-picker/locale/zh_CN';
import {
  EQUALS, NOT_EQUALS, GREATER_THAN
  , GREATER_THAN_OR_EQUAL_TO,
  LESS_THAN, LESS_THAN_OR_EQUAL_TO,
  IN, NOT_IN, EXISTS, NOT_EXISTS, REGEX
} from "./operators.js";
import { instanceAxios } from "../../../../utils/tokenUtils";
import config from "../../../../config/config";
const ButtonGroup = Button.Group;
const numberLogicalOperators = [
  { type: "EQUALS", operator: EQUALS, label: "等于" },
  { type: "NOT_EQUALS", operator: NOT_EQUALS, label: "不等于" },
  { type: "GREATER_THAN", operator: GREATER_THAN, label: "大于" },
  { type: "GREATER_THAN_OR_EQUAL_TO", operator: GREATER_THAN_OR_EQUAL_TO, label: "大于等于" },
  { type: "LESS_THAN", operator: LESS_THAN, label: "小于" },
  { type: "LESS_THAN_OR_EQUAL_TO", operator: LESS_THAN_OR_EQUAL_TO, label: "小于等于" },
];

const stringLogicalOperators = [
  // 非空和空这里有问题 如果是空 是空字符串
  { type: "EQUALS", operator: EQUALS, label: "等于" },
  { type: "NOT_EQUALS", operator: NOT_EQUALS, label: "不等于" },
  { type: "IN", operator: `__regex=`, label: "包含" },
  { type: "NOT_IN", operator: NOT_IN, label: "不包含" },
  { type: "NOT_EXISTS", operator: `__regex=/^\\S/i`, label: "不为空" },
  { type: "EXISTS", operator: NOT_EXISTS, label: "为空" },
]

const fileLogicalOperators = [
  { type: "EXISTS", operator: EXISTS, label: "不为空" },
  { type: "EXISTS", operator: NOT_EXISTS, label: "为空" },
]

const formChildLogicalOperators = [
  { type: "FormChildEXISTS", operator: "__ne=null", label: "不为空" },
  { type: "FormChildEXISTS", operator: "__eq=null", label: "为空" },
]

const dateLogicalOperators = [
  { type: "EQUALS", operator: EQUALS, label: "等于" },
  { type: "NOT_EQUALS", operator: NOT_EQUALS, label: "不等于" },
  { type: "EXISTS", operator: EXISTS, label: "不为空" },
  { type: "EXISTS", operator: NOT_EXISTS, label: "为空" },
  { type: "GREATER_THAN", operator: GREATER_THAN, label: "大于" },
  { type: "GREATER_THAN_OR_EQUAL_TO", operator: GREATER_THAN_OR_EQUAL_TO, label: "大于等于" },
  { type: "LESS_THAN", operator: LESS_THAN, label: "小于" },
  { type: "LESS_THAN_OR_EQUAL_TO", operator: LESS_THAN_OR_EQUAL_TO, label: "小于等于" },
]
const checkBoxLogicalOperators = [
  { type: "CHECKBOX_IN", operator: IN, label: "包含" },
  { type: "CHECKBOX_NOT_IN", operator: NOT_IN, label: "不包含" },
  { type: "EXISTS", operator: EXISTS, label: "不为空" },
  { type: "EXISTS", operator: NOT_EXISTS, label: "为空" },
]

const radioOperators = [
  { type: "EQUALS", operator: EQUALS, label: "等于" },
  { type: "NOT_EQUALS", operator: NOT_EQUALS, label: "不等于" },
  { type: "RADIO_IN", operator: IN, label: "包含" },
  { type: "RADIO_NOT_IN", operator: NOT_IN, label: "不包含" },
  { type: "EXISTS", operator: EXISTS, label: "不为空" },
  { type: "EXISTS", operator: NOT_EXISTS, label: "为空" },
]
const positionLogicalOperators = [
  { type: "EQUALS", operator: EQUALS, label: "等于" },
  { type: "NOT_EQUALS", operator: NOT_EQUALS, label: "不等于" },
  { type: "IN", operator: IN, label: "包含" },
  { type: "NOT_IN", operator: NOT_IN, label: "不包含" },
  { type: "NOT_EXISTS", operator: NOT_EXISTS, label: "不为空" },
  { type: "EXISTS", operator: NOT_EXISTS, label: "为空" },
]

const addressLogicalOperators = [
  { type: "LIKE", operator: "__like", label: "包含" },
  { type: "NOT_LIKE", operator: "__nlike", label: "不包含" },
  { type: "NOT_EXISTS", operator: NOT_EXISTS, label: "不为空" },
  { type: "EXISTS", operator: NOT_EXISTS, label: "为空" },
]

const { Option } = Select;

class FilterItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logicalOperators: [],
      filed: {
        key: Math.random()
      },
      options:[],
      operator: "",
      filterMode: false
    }
  }

  // 如果存在回调数组，则遍历里面的函数执行
  handleChangeDate = (value) => {
    value._d.setUTCMilliseconds(0)
    this.props.setFilterAttr("costomValue", value._d.toISOString().match(/(\S*)Z/)[1], this.props.index);
  }

  getComponentSubmission = (formId, optionId) =>{
    let options =[];
    instanceAxios.get(config.apiUrl + `/form/${formId}/submission?selectInclude=data.${optionId}`)
    .then((res) =>{         
      options = res.data.map( data =>{
        return ({
          value: data.data[optionId],
          label: data.data[optionId],
          shortcut: ""
        })
      })
      this.setState({
        options
      })
    })
    .catch((err) =>{
      console.log("error", err)
    })
  }
  getOperatorArrayByFiledType = (type) => {
    switch (type) {
      case "FileUpload":
      case "HandWrittenSignature":
      case "ImageUpload":
        return fileLogicalOperators;
      case "Address":
        return addressLogicalOperators;
      case "NumberInput":
        return numberLogicalOperators;
      case "MultiDropDown":
      case "CheckboxInput":
        return checkBoxLogicalOperators;
      case "DateInput":
        return dateLogicalOperators;
      case "RadioButtons":
      case "DropDown":
        return radioOperators;
      case "FormChildTest":
        return formChildLogicalOperators;
      case "GetLocalPosition":
        return stringLogicalOperators;
      default: return stringLogicalOperators;
    }
  }


  renderInputByFiledType = (filed) => {
    switch (filed.type) {
      case "DateInput":
        if (this.state.operator === "IN" || this.state.operator === "NOT_IN") {
          return (<Input placeholder="请输入值"
            key={`${filed.key}${this.state.operator}`}
            style={{ width: "100%" }}
            onChange={this.changeCostomValue}
            disabled={this.state.disabledCostomValue} />)
        } else {
          return <DatePicker
            key={`${filed.key}${this.state.operator}`}
            disabled={this.state.disabledCostomValue}
            showTime locale={locale}
            placeholder="请选择时间/日期"
            onChange={this.handleChangeDate}
            style={{ width: "100%" }} />;
        }
      case "DropDown":
        if (this.state.operator === "RADIO_IN" || this.state.operator === "RADIO_NOT_IN") {
         return (
          <Select
            key={filed.key}
            mode="multiple"
            key={`${filed.key}${this.state.operator}`}
            placeholder="请选择"
            style={{ width: "100%" }}
            onChange={this.handleDropDown}
            disabled={this.state.disabledCostomValue}
            suffixIcon={<Icon type="caret-down" />}
            // getPopupContainer = {triggerNode => triggerNode.parentNode}
          >
            {this.state.options.map((item, index) => (
              <Select.Option key={index} value={item.value}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
         )
        } else {
          return (
            <Select
              key={filed.key}
              key={`${filed.key}${this.state.operator}`}
              placeholder="请选择"
              style={{ width: "100%" }}
              onChange={this.handleDropDown}
              disabled={this.state.disabledCostomValue}
              suffixIcon={<Icon type="caret-down" />}
              // getPopupContainer = {triggerNode => triggerNode.parentNode}
            >
              {this.state.options.map((item, index) => (
                <Select.Option key={index} value={item.value}>
                  {item.label}
                </Select.Option>
              ))}
            </Select>
          );
        }
      case "RadioButtons":
        if(this.state.operator === "RADIO_IN" || this.state.operator === "RADIO_NOT_IN") {
          return (
           <Select
             key={filed.key}
             mode="multiple"
             key={`${filed.key}${this.state.operator}`}
             placeholder="请选择"
             style={{ width: "100%" }}
             onChange={this.handleDropDown}
             disabled={this.state.disabledCostomValue}
             suffixIcon={<Icon type="caret-down" />}
            //  getPopupContainer = {triggerNode => triggerNode.parentNode}
           >
            {filed.values.map((item, index) => (
              <Select.Option key={index} value={item.value}>
                {item.label}
              </Select.Option>
            ))}
           </Select>
          )
         } else {
           return (
             <Select
               key={filed.key}
               key={`${filed.key}${this.state.operator}`}
               placeholder="请选择"
               style={{ width: "100%" }}
               onChange={this.handleDropDown}
               disabled={this.state.disabledCostomValue}
               suffixIcon={<Icon type="caret-down" />}
              // getPopupContainer = {triggerNode => triggerNode.parentNode}
             >
              {filed.values.map((item, index) => (
                <Select.Option key={index} value={item.value}>
                  {item.label}
                </Select.Option>
              ))}
             </Select>
           );
         }
      case "CheckboxInput":
        return (
          <Select
          key={filed.key}
          mode="multiple"
          placeholder="请选择"
          style={{ width: "100%" }}
          showArrow={true}
          onChange={this.handleMulDropDown}
          key={`${filed.key}${this.state.operator}`}
          disabled={this.state.disabledCostomValue}
          suffixIcon={<Icon type="caret-down" />}
        // getPopupContainer = {triggerNode => triggerNode.parentNode}
        >
          {filed.values.map((item, index) => (
            <Select.Option key={index} value={item.value}>
              {item.label}
            </Select.Option>
          ))}
        </Select>
        )
      case "MultiDropDown":
        return (
          <Select
            key={filed.key}
            mode="multiple"
            placeholder="请选择"
            style={{ width: "100%" }}
            showArrow={true}
            onChange={this.handleMulDropDown}
            key={`${filed.key}${this.state.operator}`}
            disabled={this.state.disabledCostomValue}
            suffixIcon={<Icon type="caret-down" />}
            // getPopupContainer = {triggerNode => triggerNode.parentNode}
          >
            {this.state.options.map((item, index) => (
              <Select.Option key={index} value={item.value}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        )
      default:
        return (<Input placeholder="请输入值"
          key={filed.key+this.state.operator}
          style={{ width: "100%" }}
          // value={this.props.filter.costomValue}
          onChange={this.changeCostomValue}
          disabled={this.state.disabledCostomValue} />)
    }
  };


  onSelectField = (value) => {
    const filed = this.props.fileds.filter(filter => {
      return filter.key === value
    })[0];

    if (filed.type === "GetLocalPosition") {
      value = `${value}.address`
    }
    const logicalOperators = this.getOperatorArrayByFiledType(filed.type);
    let options = [];
    if(filed.type === "DropDown" || filed.type === "MultiDropDown") {
        
      let {values} = filed.data;
      let type = filed.data.type;
      if(type != void 0){
        // 判断有没有type, 没有就是数据关联或者数据联动
          if(type === "DataLinkage") {
            // 数据联动  获取数据联动相关的数据
            // const {formId, linkComponentId} = values;
            this.getComponentSubmission(values.linkFormId, values.linkDataId)
          } else if(type === "otherFormData"){
            // 数据关联 获取数据关联的相关数据
            this.getComponentSubmission(values.formId, values.optionId)}
      }else {
        options = filed.data.values;
        this.setState({
          options
        })
      }
    }
    this.setState({
      logicalOperators,
      filed: filed,
    },()=>{
      this.props.setFilterAttr("selectedFiled", value, this.props.index);
      this.props.setFilterAttr("selectedFiledKey", filed.key, this.props.index);
      this.props.setFilterAttr("costomValue", "", this.props.index);
    })
  }

  onSelectOperator = (value) => {
    const operator = this.state.logicalOperators.filter(operator => {
      return operator.label === value
    })[0];
    this.props.setFilterAttr("selectedLogicalOperator", operator.operator, this.props.index);
    this.props.setFilterAttr("costomValue", "", this.props.index);
    this.props.setFilterAttr("filterType", operator.type, this.props.index);
    this.setState({
      disabledCostomValue: (operator.type === "EXISTS") || (operator.type === "NOT_EXISTS") ? true : false,
      operator: operator.type
    },()=>{
      this._setCostomValue("");
    });
  }

  _setCostomValue = (value) =>{
    if(this.state.operator === "EXISTS" || this.state.operator === "NOT_EXISTS") {
      this.props.setFilterAttr("costomValue", "emptyValue", this.props.index);
    } else {
      this.props.setFilterAttr("costomValue", value, this.props.index);
    }
  }

  changeCostomValue = (e) => {
    this._setCostomValue(e.target.value)
  }

  handleDropDown = (value) => {
    this._setCostomValue(value)
  }
  handleMulDropDown = (value) => {
    this._setCostomValue(value)
  }


  changeCondition = (value) => {
    this.props.setFilterAttr("connectCondition", value, this.props.index);
  }


  handleAddFilter = () => {
    // 添加一行条件
    this.props.addFilter();
  }

  handleDeleteFilter = () => {
    this.props.deleteFilter(this.props.index)
  }


  render() {
    const { selectedFiled, selectedLogicalOperator, costomValue, connectCondition } = this.props.filter;
    const { fileds } = this.props;
    const { logicalOperators } = this.state;

    return (
      <div className="filter-item">
        <Row type="flex" justify="start" gutter = { [ 0, 19]}>
          <Col span={12}>
            <Select style={{ width: "100%" }}
              placeholder="选择字段"
              onChange={this.onSelectField}
              suffixIcon={<Icon type="caret-down" />}
              // getPopupContainer = {triggerNode => triggerNode.parentNode} 
            >
              {fileds.map(component => (
                <Option value={component.key} key={component.id} >
                  {component.label}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={4} className="descBox">
            的值
            </Col>
          <Col span={6} className="logicSymbol">
            <Select style={{ width: "100%" }}
              key={this.state.filed.key}
              placeholder="运算符"
              onChange={this.onSelectOperator}
              suffixIcon={<Icon type="caret-down" />}
              // getPopupContainer = {triggerNode => triggerNode.parentNode}
            >
              {logicalOperators.map(operator => (
                <Option value={operator.label} key={operator.label}>
                  {operator.label}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={24} className="valueBox">
            {
              this.renderInputByFiledType(this.state.filed)
            }
          </Col>
          <Col span={24} >
            <div className="filter-action">
              <Icon type="plus-circle" onClick={this.handleAddFilter} style={{ marginRight: "12px" }} />
              <Icon className ="reduceBtn"type="minus-circle" onClick={this.handleDeleteFilter} />
            </div>
          </Col>
        </Row>
      </div>
    )
  }
}

export default class FilterComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterArray: [{
        selectedFiled: "",
        selectedLogicalOperator: "",
        costomValue: "",
        filterType: "",
        selectedFiledKey: "",
        key:Math.random(),
      }],
      isFilter: [],
      connectCondition: "&",
      conditionIsAll: true,
    }

  }

  addFilter = () => {

    if (this.state.filterArray.every(this.isAllFilled)) {
      const newFilter = {
        selectedFiled: "",
        selectedLogicalOperator: "",
        costomValue: "",
        filterType: "",
        selectedFiledKey: "",
        key:Math.random(),
      }
      this.setState({
        filterArray: [...this.state.filterArray, newFilter]
      })
    }
  }

  isAllFilled = (filter, index) => {
    if(filter.costomValue.constructor === Array && filter.costomValue.length === 0 ){
      return false;
    }
    if(filter.filterType=="EXISTS"){
      return true
    }
    return filter.selectedFiledKey !== "" && filter.costomValue !== "" && filter.selectedLogicalOperator !== ""
  }

  deleteFilter = (index) => {
    let newFilterArray = [...this.state.filterArray];
    if (newFilterArray.length > 1) {
      newFilterArray.splice(index, 1);
      this.setState({
        filterArray: newFilterArray
      })
    }else if(newFilterArray.length === 1){
      this.props.setFilterMode(null,null,false);
      this.setState({
        filterArray: [{
          selectedFiled: "",
          selectedLogicalOperator: "",
          costomValue: "",
          filterType: "",
          selectedFiledKey: "",
          key:Math.random()
        }]
      })
    }
  }

  changeFilterValue = (attr, value, indexInArray) => {
    const newFilterArray = this.state.filterArray.map((filter, index) => {
      if (indexInArray === index) {
        filter[attr] = value
      }
      return filter
    })
    this.setState({
      filterArray: newFilterArray
    })
  }


  filterSubmitData = () => { 
    let isAllFilled = this.state.filterArray.every(this.isAllFilled);
    let ISConditionalContradiction = this.ISConditionalContradiction();
    if(isAllFilled && !ISConditionalContradiction){
    const filterArray = this.state.filterArray.map(filter => {
      switch (filter.filterType) {
        case "EXISTS": return `data.${filter.selectedFiled}${filter.selectedLogicalOperator}`;
        case "NOT_EXISTS": return `data.${filter.selectedFiled}${filter.selectedLogicalOperator}`;
        case "EQUALS": return `data.${filter.selectedFiled}=${filter.costomValue}`;
        case "IN": return `data.${filter.selectedFiled}__regex=/${filter.costomValue}/`;
        case "NOT_IN": return `data.${filter.selectedFiled}__regex=/^((?!${filter.costomValue}).)*$/`;
        case "LIKE": return `data.${filter.selectedFiled}.xx${filter.selectedLogicalOperator}=${filter.costomValue}`;
        case "NOT_LIKE": return `data.${filter.selectedFiled}.xx${filter.selectedLogicalOperator}=${filter.costomValue}`;
        default: return `data.${filter.selectedFiled}${filter.selectedLogicalOperator}=${filter.costomValue}`;
      }
    })

    this.props.setFilterMode(filterArray, this.state.connectCondition, true);
    } else if(!isAllFilled){
      message.error("请填写完整的过滤条件", 1);
    } else if(ISConditionalContradiction){
      message.error("填写条件矛盾，请检查填写条件",1);
    }

  }

  ISConditionalContradiction(){
    let filterArray = this.state.filterArray;
    // 在条件为满足所有条件的时候才执行这个检查
    if(this.state.connectCondition !== "&"){
      return false;
    }

    filterArray = filterArray.filter((filter,index) => {
        for(let i = index + 1; i < filterArray.length; i++){
          if(filter.selectedFiled === filterArray[i].selectedFiled && filter.selectedLogicalOperator === filterArray[i].selectedLogicalOperator){
            return true
          }
        }
    })
    if(filterArray.length > 0){
      return true;
    }

    return false
  }

  onChangeConditionAnd = () => {
    this.setState({
      connectCondition: "&",
      conditionIsAll: true,
    })
  }

  onChangeConditionOr = () => {
    this.setState({
      connectCondition: "or",
      conditionIsAll: false,
    })
  }

  handleSelectCondition = (value) => {
    this.setState({
      connectCondition: value,
    })
  }


  render() {
    const fileds = this.props.fileds;
    const { conditionIsAll } = this.state;
    return (
      <>
        <div className="filter-container">
          <div className="filter-condition">
            <Select
              style={{ width: "281px", height: "36px" }}
              placeholder="满足所有条件"
              onChange={this.handleSelectCondition}
              className="filter-condition-option"
              // getPopupContainer={triggerNode => triggerNode.parentNode}
              suffixIcon={<Icon type="caret-down"
              />}
            >
              <Option value="&" key="and">
                满足所有条件
              </Option>
              <Option value="or" key="or">
                满足任一条件
              </Option>
            </Select>
          </div>

          {/* <Row type="flex" justify="center" gutter={19}>
            <Col span={8}>字段</Col>
            <Col span={7}>类型</Col>
            <Col span={7}>值</Col>
          </Row> */}
          <div className="filter-item-container">
            {this.state.filterArray.map(((filter, index) => {
              return <FilterItem
                filter={filter}
                key={filter.key}
                index={index}
                showMoreFilter={true}
                fileds={fileds}
                addFilter={this.addFilter}
                deleteFilter={this.deleteFilter}
                setFilterAttr={this.changeFilterValue}
              />
            }))}
          </div>
          <div className="filter-submit-container">
            <Button
              type="primary"
              onClick={this.filterSubmitData}>
              确定
            </Button>
            <Button
              type="default"
              onClick={()=>{this.props.clickExtendCallBack()}}>
              取消
            </Button>
          </div>
        </div>
      </>
    );
  }
}
