import React, { Component } from "react";
import {
  Select,
  Input,
  Tooltip,
  Icon,
  Button,
  Divider,
  message,
  Row,
  Col,
  DatePicker,
  TimePicker
} from "antd";
import locale from "antd/lib/date-picker/locale/zh_CN";
import moment from 'moment';
import { utcDate } from "../../../../utils/coverTimeUtils"
import {
  EQUALS,
  NOT_EQUALS,
  GREATER_THAN,
  GREATER_THAN_OR_EQUAL_TO,
  LESS_THAN,
  LESS_THAN_OR_EQUAL_TO,
  IN,
  NOT_IN,
  EXISTS,
  NOT_EXISTS,
  REGEX
} from "./operators.js";
import { instanceAxios } from "../../../../utils/tokenUtils";
import config from "../../../../config/config";
const ButtonGroup = Button.Group;
const numberLogicalOperators = [
  { type: "EQUALS", operator: EQUALS, label: "等于" },
  { type: "NOT_EQUALS", operator: NOT_EQUALS, label: "不等于" },
  { type: "GREATER_THAN", operator: GREATER_THAN, label: "大于" },
  {
    type: "GREATER_THAN_OR_EQUAL_TO",
    operator: GREATER_THAN_OR_EQUAL_TO,
    label: "大于等于"
  },
  { type: "LESS_THAN", operator: LESS_THAN, label: "小于" },
  {
    type: "LESS_THAN_OR_EQUAL_TO",
    operator: LESS_THAN_OR_EQUAL_TO,
    label: "小于等于"
  }
];

const pureTimeLogicalOperators =[
  { type: "EQUALS", operator: EQUALS, label: "等于" },
  { type: "NOT_EQUALS", operator: NOT_EQUALS, label: "不等于" },
  { type: "GREATER_THAN", operator: GREATER_THAN, label: "之后" },
  { type: "LESS_THAN", operator: LESS_THAN, label: "之前" },
  { type: "NOT_EXISTS", operator: `__regex=/^\\S/i`, label: "不为空" },
  { type: "EXISTS", operator: NOT_EXISTS, label: "为空" },
  { type: "IN", operator: `__regex=`, label: "包含" },
  { type: "NOT_IN", operator: NOT_IN, label: "不包含" },
]

const stringLogicalOperators = [
  // 非空和空这里有问题 如果是空 是空字符串
  { type: "EQUALS", operator: EQUALS, label: "等于" },
  { type: "NOT_EQUALS", operator: NOT_EQUALS, label: "不等于" },
  { type: "IN", operator: `__regex=`, label: "包含" },
  { type: "NOT_IN", operator: NOT_IN, label: "不包含" },
  { type: "NOT_EXISTS", operator: `__regex=/^\\S/i`, label: "不为空" },
  { type: "EXISTS", operator: NOT_EXISTS, label: "为空" }
];

const fileLogicalOperators = [
  { type: "EXISTS", operator: EXISTS, label: "不为空" },
  { type: "EXISTS", operator: NOT_EXISTS, label: "为空" }
];

const formChildLogicalOperators = [
  { type: "FormChildEXISTS", operator: "__ne=null", label: "不为空" },
  { type: "FormChildEXISTS", operator: "__eq=null", label: "为空" }
];

const dateLogicalOperators = [
  { type: "EQUALS", operator: EQUALS, label: "等于" },
  { type: "NOT_EQUALS", operator: NOT_EQUALS, label: "不等于" },
  { type: "EXISTS", operator: EXISTS, label: "不为空" },
  { type: "EXISTS", operator: NOT_EXISTS, label: "为空" },
  { type: "GREATER_THAN", operator: GREATER_THAN, label: "之后" },
  { type: "LESS_THAN", operator: LESS_THAN, label: "之前" },
];
const checkBoxLogicalOperators = [
  { type: "CHECKBOX_IN", operator: IN, label: "包含" },
  { type: "CHECKBOX_NOT_IN", operator: NOT_IN, label: "不包含" },
  { type: "EXISTS", operator: EXISTS, label: "不为空" },
  { type: "EXISTS", operator: NOT_EXISTS, label: "为空" }
];

const radioOperators = [
  { type: "EQUALS", operator: EQUALS, label: "等于" },
  { type: "NOT_EQUALS", operator: NOT_EQUALS, label: "不等于" },
  { type: "RADIO_IN", operator: IN, label: "包含" },
  { type: "RADIO_NOT_IN", operator: NOT_IN, label: "不包含" },
  { type: "EXISTS", operator: EXISTS, label: "不为空" },
  { type: "EXISTS", operator: NOT_EXISTS, label: "为空" }
];
const positionLogicalOperators = [
  { type: "EQUALS", operator: EQUALS, label: "等于" },
  { type: "NOT_EQUALS", operator: NOT_EQUALS, label: "不等于" },
  { type: "IN", operator: IN, label: "包含" },
  { type: "NOT_IN", operator: NOT_IN, label: "不包含" },
  { type: "NOT_EXISTS", operator: NOT_EXISTS, label: "不为空" },
  { type: "EXISTS", operator: NOT_EXISTS, label: "为空" }
];

const addressLogicalOperators = [
  { type: "LIKE", operator: "__like", label: "包含" },
  { type: "NOT_LIKE", operator: "__nlike", label: "不包含" },
  { type: "NOT_EXISTS", operator: NOT_EXISTS, label: "不为空" },
  { type: "EXISTS", operator: NOT_EXISTS, label: "为空" }
];

const { Option } = Select;

class FilterItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logicalOperators: [],
      filed: {
        key: Math.random()
      },
      options: [],
      operator: "",
    };
  }

  // 如果存在回调数组，则遍历里面的函数执行
  handleChangeDate = value => {
    if(value){
      value._d.setUTCMilliseconds(0);
      this.props.setFilterAttr(
        "costomValue",
        value._d.toISOString(),
        this.props.index
      );
    }
  };

  getComponentSubmission = (formId, optionId) => {
    let options = [];
    instanceAxios
      .get(
        config.apiUrl +
          `/form/${formId}/submission?selectInclude=data.${optionId}`,{
            header:{
              "isDataPage": true,
            }
          }
      )
      .then(res => {
        options = res.data.map(data => {
          return {
            value: data.data[optionId],
            label: data.data[optionId],
            shortcut: ""
          };
        });
        this.setState({
          options
        });
      })
      .catch(err => {
        console.log("error", err);
      });
  };
  getOperatorArrayByFiledType = type => {
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
      case "PureTime":
      case "PureDate":
        return pureTimeLogicalOperators;
      default:
        return stringLogicalOperators;
    }
  };

  renderInputByFiledType = (filed, value, options, isDisabled) => {
    const defaultValueOpt = {};
    if(value !== ""){
      defaultValueOpt.defaultValue = value
    }
    switch (filed && filed.type) {
      case "NumberInput":
        return (
        <Input
          type="number"
          width="100%"
          defaultValue={value !=="" ? Number(value): null}
          placeholder="请输入值"
          key={`${filed.key}${this.state.operator}`}
          style={{ width: "100%" }}
          onChange={this.changeCostomValue}
          disabled={isDisabled || this.state.disabledCostomValue}
        />)
      case "DateInput":
        if (this.state.operator === "IN" || this.state.operator === "NOT_IN") {
          return (
            <Input
              width="100%"
              defaultValue={value}
              placeholder="请输入值"
              key={`${filed.key}${this.state.operator}`}
              style={{ width: "100%" }}
              onChange={this.changeCostomValue}
              disabled={isDisabled || this.state.disabledCostomValue}
            />
          );
        } else {
          let options = {};
          if(value!==""){
            let date = new Date(value);
            if(value.indexOf("Z") === -1){
              let currentTimeZoneOffsetInHours = new Date().getTimezoneOffset()/60;
              date.setHours(date.getHours()-currentTimeZoneOffsetInHours);
              options.defaultValue = moment(date);
            }else{
              let currentTimeZoneOffsetInHours = new Date().getTimezoneOffset()/60;
              date.setHours(date.getHours()-currentTimeZoneOffsetInHours);
              options.defaultValue = moment(value);
            }
        }
          return (
            <DatePicker
              key={`${filed.key}${this.state.operator}`}
              disabled={isDisabled || this.state.disabledCostomValue}
              {...options}
              showTime
              locale={locale}
              placeholder="请选择时间日期"
              onChange={this.handleChangeDate}
              style={{ width: "100%" }}
            />
          );
        }
      case "PureTime":
        return(
          <TimePicker
          key={`${filed.key}${this.state.operator}`}
          disabled={isDisabled || this.state.disabledCostomValue}
          {...options}
          showTime
          locale={locale}
          placeholder="请选择时间"
          onChange={this.handleChangeDate}
          style={{ width: "100%" }}
        />
        )
      case "PureDate":
        return(
          <DatePicker
          key={`${filed.key}${this.state.operator}`}
          disabled={isDisabled || this.state.disabledCostomValue}
          {...options}
          locale={locale}
          placeholder="请选择日期"
          onChange={this.handleChangeDate}
          style={{ width: "100%" }}
        />
        )
      case "DropDown":
        if (
          this.state.operator === "RADIO_IN" ||
          this.state.operator === "RADIO_NOT_IN"
        ) {
          return (
            <Select
              key={filed.key}
              {...defaultValueOpt}
              mode="multiple"
              key={`${filed.key}${this.state.operator}`}
              placeholder="请选择"
              style={{ width: "100%" }}
              onChange={this.handleDropDown}
              disabled={isDisabled || this.state.disabledCostomValue}
              suffixIcon={<Icon type="caret-down" />}
              // getPopupContainer = {triggerNode => triggerNode.parentNode}
            >
              {options.map((item, index) => (
                <Select.Option key={index} value={item.value}>
                  {item.label}
                </Select.Option>
              ))}
            </Select>
          );
        } else {
          return (
            <Select
              key={filed.key}
              key={`${filed.key}${this.state.operator}`}
              {...defaultValueOpt}
              placeholder="请选择"
              style={{ width: "100%" }}
              onChange={this.handleDropDown}
              disabled={isDisabled || this.state.disabledCostomValue}
              suffixIcon={<Icon type="caret-down" />}
              // getPopupContainer = {triggerNode => triggerNode.parentNode}
            >
              {options.map((item, index) => (
                <Select.Option key={index} value={item.value}>
                  {item.label}
                </Select.Option>
              ))}
            </Select>
          );
        }
      case "RadioButtons":
        if (
          this.state.operator === "RADIO_IN" ||
          this.state.operator === "RADIO_NOT_IN"
        ) {
          return (
            <Select
              key={filed.key}
              mode="multiple"
              {...defaultValueOpt}
              key={`${filed.key}${this.state.operator}`}
              placeholder="请选择"
              // style={{ width: "100%" }}
              onChange={this.handleDropDown}
              disabled={isDisabled || this.state.disabledCostomValue}
              suffixIcon={<Icon type="caret-down" />}
              //  getPopupContainer = {triggerNode => triggerNode.parentNode}
            >
              {filed.values.map((item, index) => (
                <Select.Option key={index} value={item.value}>
                  {item.label}
                </Select.Option>
              ))}
            </Select>
          );
        } else {
          return (
            <Select
              key={filed.key}
              key={`${filed.key}${this.state.operator}`}
              {...defaultValueOpt}
              placeholder="请选择"
              style={{ width: "100%" }}
              onChange={this.handleDropDown}
              disabled={isDisabled || this.state.disabledCostomValue}
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
            {...defaultValueOpt}
            placeholder="请选择"
            style={{ width: "100%" }}
            showArrow={true}
            onChange={this.handleMulDropDown}
            key={`${filed.key}${this.state.operator}`}
            disabled={isDisabled || this.state.disabledCostomValue}
            suffixIcon={<Icon type="caret-down" />}
          >
            {filed.values.map((item, index) => (
              <Select.Option key={index} value={item.value}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        );
      case "MultiDropDown":
        return (
          <Select
            key={filed.key}
            mode="multiple"
            {...defaultValueOpt}
            placeholder="请选择"
            style={{ width: "100%" }}
            showArrow={true}
            onChange={this.handleMulDropDown}
            key={`${filed.key}${this.state.operator}`}
            disabled={isDisabled || this.state.disabledCostomValue}
            suffixIcon={<Icon type="caret-down" />}
          >
            {options.map((item, index) => (
              <Select.Option key={index} value={item.value}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        );
      default:
        return (
          <Input
            placeholder="请输入值"
            key={filed.key + this.state.operator}
            style={{ width: "100%" }}
            defaultValue={value}
            onChange={this.changeCostomValue}
            disabled={isDisabled || this.state.disabledCostomValue}
          />
        );
    }
  };

  onSelectField = value => {
    const filed = this.props.fileds.filter(filter => {
      return filter.key === value;
    })[0];

    if (filed.type === "GetLocalPosition") {
      value = `${value}.address`;
    }
    const logicalOperators = this.getOperatorArrayByFiledType(filed.type);
    let options = [];
    if (filed.type === "DropDown" || filed.type === "MultiDropDown") {
      let { values } = filed.data;
      let type = filed.data.type;
      if (type != void 0) {
        // 判断有没有type, 没有就是数据关联或者数据联动
        if (type === "DataLinkage") {
          // 数据联动  获取数据联动相关的数据
          // const {formId, linkComponentId} = values;
          this.getComponentSubmission(values.linkFormId, values.linkDataId);
        } else if (type === "otherFormData") {
          // 数据关联 获取数据关联的相关数据
          this.getComponentSubmission(values.formId, values.optionId);
        }
      } else {
        options = filed.data.values;
        this.props.setFilterAttr("options", options, this.props.index);
      }
    }
    this.props.setFilterAttr("field", filed, this.props.index);
    this.props.setFilterAttr("selectedFiled", value, this.props.index);
    this.props.setFilterAttr(
      "selectedFiledKey",
      filed.key,
      this.props.index
    );
    this.props.setFilterAttr("logicalOperators",logicalOperators,this.props.index);
    this.props.setFilterAttr("costomValue", "", this.props.index);
  };

  onSelectOperator = value => {
    const operator = this.props.filter.logicalOperators.filter(operator => {
      return operator.label === value;
    })[0];
    this.props.setFilterAttr(
      "selectedLogicalOperator",
      operator,
      this.props.index
    );
    // this.props.setFilterAttr("costomValue", null, this.props.index);
  };

  _setCostomValue = value => {
      this.props.setFilterAttr("costomValue", value, this.props.index);
  };

  changeCostomValue = e => {
    this._setCostomValue(e.target.value);
  };

  handleDropDown = value => {
    this._setCostomValue(value);
  };
  handleMulDropDown = value => {
    this._setCostomValue(value);
  };


  handleAddFilter = () => {
    // 添加一行条件
    this.props.addFilter();
  };

  handleDeleteFilter = () => {
    this.props.deleteFilter(this.props.index);
  };

  render() {
    const {
      selectedFiled,
      selectedLogicalOperator,
      costomValue,
      connectCondition,
      selectedFiledKey,
      logicalOperators,
      field,
      options
    } = this.props.filter;
    const { fileds } = this.props;
    let  isDisabled = false;
    if(selectedLogicalOperator != void 0){
      if(selectedLogicalOperator.type === "EXISTS" || selectedLogicalOperator.type === "NOT_EXISTS") {
        isDisabled= true;
      }
    }
    
    const fieldDefaultValueOpt={};
    if(selectedFiledKey !== ""){
      fieldDefaultValueOpt.defaultValue = selectedFiledKey;
    }
    const OptDefaultValueOpt={};
    if(selectedLogicalOperator !=  void 0 ){
      OptDefaultValueOpt.defaultValue = selectedLogicalOperator.label;
    }
    return (
      <div className="filter-item">
        <Row type="flex" justify="start" gutter={[0, 19]}>
          <Col span={12}>
            <Select
              // value={selectedFiledKey}
              {...fieldDefaultValueOpt}
              style={{ width: "100%" }}
              placeholder="选择字段"
              onChange={this.onSelectField}
              suffixIcon={<Icon type="caret-down" />}
            >
              {fileds.map(component => (
                <Option value={component.key} key={component.id}>
                  {component.label}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={4} className="descBox">
            的值
          </Col>
          <Col span={7} className="logicSymbol">
            <Select
              {...OptDefaultValueOpt}
              style={{ width: "100%" }}
              key={this.state.filed.key}
              placeholder="运算符"
              onChange={this.onSelectOperator}
              suffixIcon={<Icon type="caret-down" />}
            >
              {logicalOperators.map(operator => (
                <Option value={operator.label} key={operator.label}>
                  {operator.label}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={23} className="valueBox">
            {this.renderInputByFiledType(field, costomValue, options, isDisabled)}
          </Col>
          <Col span={24}>
            <div className="filter-action">
              <Icon
                type="plus-circle"
                onClick={this.handleAddFilter}
                style={{ marginRight: "12px" }}
              />
              <Icon
                className="reduceBtn"
                type="minus-circle"
                onClick={this.handleDeleteFilter}
              />
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default class FilterComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterArray: props.selectArray,
      connectCondition: "&"
    };
  }

  addFilter = () => {
    if (this.state.filterArray.every(this.isAllFilled)) {
      const newFilter = {
        selectedFiled: "",
        selectedLogicalOperator: null,
        logicalOperators: [],
        costomValue: "",
        selectedFiledKey: "",
        field: {type:"", key: Math.random()},
        options: [],
        key: Math.random()
      };
      this.props.changeFilterArray([...this.state.filterArray, newFilter]);
      this.setState({
        filterArray: [...this.state.filterArray, newFilter]
      });
    }
  };

  isAllFilled = (filter, index) => {
    if (
      index > 0 &&
      filter.costomValue.constructor === Array &&
      filter.costomValue.length === 0
    ) {
      return false;
    } else if(index === 0 && filter.selectedFiled === ""){
      return true;
    }
    if(filter.selectedLogicalOperator != void 0){
      if (filter.selectedLogicalOperator.type === "EXISTS" || filter.selectedLogicalOperator.type === "NOT_EXISTS") {
        return true;
      }
    }
    return (
      filter.selectedFiledKey !== "" &&
      filter.costomValue !== "" &&
      filter.selectedLogicalOperator !== null
    );
  };

  isFilterMode = (filterArray) =>{
    if(filterArray.length === 1 && filterArray[0].selectedFiled === ""){
      return false
    }
    return true;
  }

  deleteFilter = index => {
    let newFilterArray = [...this.state.filterArray];
    if (newFilterArray.length > 1) {
      newFilterArray.splice(index, 1);
      this.props.changeFilterArray(newFilterArray);
      this.setState({
        filterArray: newFilterArray
      });
    }else{
      const defaultFilterArray = [{
        selectedFiled: "",
        selectedLogicalOperator: null,
        logicalOperators: [],
        costomValue: "",
        selectedFiledKey: "",
        field: {type:"", key: Math.random()},
        options: [],
        key: Math.random()
      }]
      this.props.changeFilterArray(defaultFilterArray);
      this.setState({
        filterArray: defaultFilterArray
      });
    }
  };

  changeFilterValue = (attr, value, indexInArray) => {
    const newFilterArray = this.state.filterArray.map((filter, index) => {
      if (indexInArray === index) {
        filter[attr] = value;
      }
      return filter;
    });
    this.props.changeFilterArray(newFilterArray);
    this.setState({
      filterArray: newFilterArray
    });
  };

  _handleDateTypeData(filterArray) {
    return filterArray.map(filter=>{
      const dateTypes = ["DateInput", "PureTime", "PureDate"]
      if(dateTypes.includes(filter.field.type)){
        filter.costomValue = utcDate(filter.costomValue, filter.field.type)
        return filter
      }
      return filter;
    })
  }

  filterSubmitData = () => {
    let isAllFilled = this.props.selectArray.every(this.isAllFilled);
    let isFilterMode = this.isFilterMode(this.props.selectArray);
    let ISConditionalContradiction = this.ISConditionalContradiction();
    if (isAllFilled && !ISConditionalContradiction) {
      const filterArray = this._handleDateTypeData([...this.props.selectArray]).map(filter => {
        switch (filter.selectedLogicalOperator.type) {
          case "EXISTS":
            return `data.${filter.selectedFiled}${filter.selectedLogicalOperator.operator}`;
          case "NOT_EXISTS":
            return `data.${filter.selectedFiled}${filter.selectedLogicalOperator.operator}`;
          case "EQUALS":
            return `data.${filter.selectedFiled}=${filter.costomValue}`;
          case "IN":
            return `data.${filter.selectedFiled}__regex=/${filter.costomValue}/`;
          case "NOT_IN":
            return `data.${filter.selectedFiled}__regex=/^((?!${filter.costomValue}).)*$/`;
          case "LIKE":
            return `data.${filter.selectedFiled}.completeAddress${filter.selectedLogicalOperator.operator}=${filter.costomValue}`;
          case "NOT_LIKE":
            return `data.${filter.selectedFiled}.completeAddress${filter.selectedLogicalOperator.operator}=${filter.costomValue}`;
          default:
            return `data.${filter.selectedFiled}${filter.selectedLogicalOperator.operator}=${filter.costomValue}`;
        }
      });

      this.props.setFilterMode(filterArray, this.props.connectCondition, isFilterMode);
    } else if (!isAllFilled) {
      message.error("请填写完整的过滤条件", 1);
    } else if (ISConditionalContradiction) {
      message.error("填写条件矛盾，请检查填写条件", 1);
    }
  };

  ISConditionalContradiction() {
    let filterArray = this.state.filterArray;
    // 在条件为满足所有条件的时候才执行这个检查
    if (this.state.connectCondition !== "&") {
      return false;
    }

    filterArray = filterArray.filter((filter, index) => {
      for (let i = index + 1; i < filterArray.length; i++) {
        if (
          filter.selectedFiled === filterArray[i].selectedFiled &&
          filter.selectedLogicalOperator.operator ===
            filterArray[i].selectedLogicalOperator.operator
        ) {
          return true;
        }
      }
    });
    if (filterArray.length > 0) {
      return true;
    }

    return false;
  }


  handleSelectCondition = value => {
    this.props.setConnectCondition(value);
    this.setState({
      connectCondition: value
    });
  };

  handleClearFilter = () => {
    const defaultFilterArray = [{
      selectedFiled: "",
      selectedLogicalOperator: null,
      logicalOperators: [],
      costomValue: "",
      selectedFiledKey: "",
      field: {type:"", key: Math.random()},
      options: [],
      key: Math.random()
    }]
    this.props.setFilterMode(defaultFilterArray, this.props.connectCondition, false);
    this.props.changeFilterArray(defaultFilterArray)
    this.setState({
      filterArray: defaultFilterArray
    });
  };

  render() {
    const fileds = this.props.fileds;

    return (
      <>
        <div
          className="filter-container"
          onMouseLeave={() => this.props.canClick()}
          onMouseEnter={() => this.props.canNotClick()}
        >
          <div className="filter-condition">
            <Select
              defaultValue={this.props.connectCondition}
              placeholder="满足所有条件"
              onChange={this.handleSelectCondition}
              className="filter-condition-option"
              // getPopupContainer={triggerNode => triggerNode.parentNode}
              suffixIcon={<Icon type="caret-down" />}
            >
              <Option value="&" key="and">
                满足所有条件
              </Option>
              <Option value="or" key="or">
                满足任一条件
              </Option>
            </Select>
          </div>
          <div className="line"></div>
          <div className="filter-item-container">
            {this.state.filterArray.map((filter, index) => {
              return (
                <FilterItem
                  filter={filter}
                  key={filter.key}
                  index={index}
                  fileds={fileds}
                  addFilter={this.addFilter}
                  deleteFilter={this.deleteFilter}
                  setFilterAttr={this.changeFilterValue}
                />
              );
            })}
          </div>
          <div className="line"></div>
          <div className="filter-submit-container">
            <Button type="primary" onClick={this.filterSubmitData}>
              确定
            </Button>
            <Button
              type="default"
              onClick={() => {
                this.handleClearFilter();
              }}
            >
              清空
            </Button>
          </div>
        </div>
      </>
    );
  }
}
