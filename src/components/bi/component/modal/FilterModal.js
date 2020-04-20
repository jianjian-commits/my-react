import React from "react";
import { Modal, TreeSelect, Select, DatePicker } from "antd";
import { useState } from "react";
import { connect } from "react-redux";
import moment from 'moment';
import { TextOptions, NumberOptions, DateOptions, OPERATORS, DataType } from "../elements/Constant";
import request from '../../utils/request';
import classes from '../../scss/modal/filterModal.module.scss';
const { SHOW_PARENT } = TreeSelect;
const { Option } = Select;
const SIMPLE_SYMBOLS = [OPERATORS.EQUALS, OPERATORS.NOT_EQUALS, OPERATORS.INCLUDE, OPERATORS.NOT_INCLUDE, 
  OPERATORS.GRATER_THAN, OPERATORS.LESS_THAN, OPERATORS.GRATER_OR_EQUAL_TO, OPERATORS.LESS_OR_EQUAL_TO];
const COMPLICATED_SYMBOLS = [OPERATORS.EQUALS_TO_ANY_ONE, OPERATORS.NOT_EQUALS_TO_ANY_ONE];
const NULL_SYMBOLS = [OPERATORS.IS_NULL, OPERATORS.IS_NOT_NULL];

const FilterModal = (props) => {
  const { visible, setVisible, item, changeFilter, dataSource } = props;
  const dataType = item.type;
  const initValue = getValue(item.value, item.symbol);
  const [symbol, setSymbol] = useState(item.symbol || OPERATORS.EQUALS);
  const [value, setValue] = useState(initValue.value);
  const [min, setMin] = useState(initValue.min);
  const [max, setMax] = useState(initValue.max);
  const [singleOption, setSingleOption] = useState([]);
  const [multiOption, setMultiOption] = useState([]);

  const getCommitValue = () => {
    let commitValue = value;

    if(dataType == DataType.DATETIME) {
      commitValue = symbol == OPERATORS.RANGE ? [transDate(min), transDate(max)] : transDate(value);
    }
  
    if(isNull(symbol)) {
      commitValue = null;
    }
  
    if(dataType == DataType.NUMBER) {
      commitValue = symbol == OPERATORS.RANGE ? [parseNumber(min), parseNumber(max)] : parseNumber(commitValue)
    }

    return commitValue;
  }

  const handleCancel = () => {
    let commitValue = getCommitValue();
    setVisible(false);
  }

  const handleOK = () => {
    let commitValue = getCommitValue();
    changeFilter(item.fieldId, symbol, commitValue);
    setVisible(false);
  }


  const getTitle = () => {
    return <span className={classes.title}>设置筛选条件</span>
  }

  const getOption = (type) => {
    switch(type) {
      case DataType.STRING:
        return TextOptions;
      case DataType.NUMBER:
        return NumberOptions;
      case DataType.DATETIME:
        return DateOptions;
      default:
        return [];
    }
  }

  const clearValue = () => {
    setMin("");
    setMax("");
    setValue("");
  }

  const onChangeMin = (obj) => {
    setMin(getRangeValue(obj));
  }

  const onChangeMax = (obj) => {
    setMax(getRangeValue(obj));
  }

  const getRangeValue = (obj) => {
    return dataType == DataType.NUMBER ? obj.target.value : obj;
  }

  const onChangeValue = (obj) => {
    if(dataType == DataType.NUMBER || (dataType == DataType.STRING &&
      (symbol == OPERATORS.INCLUDE || symbol == OPERATORS.NOT_INCLUDE)))
    {
      setValue(obj.target.value);
      return;
    }

    setValue(obj);
  }

  const getCondition = (type) => {
    switch(type) {
      case DataType.STRING:
        return getTextConditon();
      case DataType.NUMBER:
        return getNumberCondition();
      case DataType.DATETIME:
        return getDateCondition();
    }
  }

  const setMulti = () => {
    requestData(setMultiOption);
  }

  const setSingle = () => {
    requestData(setSingleOption);
  }

  const onChangeSymbol = (symbol) => {
    setSymbol(symbol);
    clearValue();

    if(isComplicated(symbol)) {
      setMulti();
      setValue([]);
    }
  }

  const getDateValue = (value) => {
    return typeof(value) === "object" ?  value : (value === "" ? null : new moment(value)); 
  }

  const requestData = (set) => {
    const res = request(`/bi/forms/fields/${item.fieldId}?formId=${dataSource.id}`).then((res) => {
      if(res && res.msg === "success") {
        const data = res.data;
        set(data.values);
      }
    })
  }

  const getTextConditon = () => {
    if(symbol == OPERATORS.EQUALS || symbol == OPERATORS.NOT_EQUALS) {
      return <Select
        showSearch={true}
        style={{ width: '350px', marginLeft: '20px' }}
        defaultValue={value}
        optionFilterProp="children"
        onChange={onChangeValue}
        onFocus={setSingle}
        filterOption={(input, option) =>
          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {singleOption.map((each, idx)=> {
          return <Option value={each} key={each + idx}>{each}</Option>
        })}
      </Select>
    }
    else if(isComplicated(symbol)) {
      const treeData = multiOption.map((each, idx)=> {
        return {title: each, value: each, key: each + idx};
      })

      const tProps = {
        treeData,
        value: value,
        onChange: onChangeValue,
        loadData: setMulti,
        treeCheckable: true,
        dropdownClassName:"dropdownClassName",
        showSearch: true,
        showCheckedStrategy: SHOW_PARENT,
        style: {
          width: "350px", marginLeft: '20px'
        }
      };

      return <TreeSelect  {...tProps} />;
    }
    else if(symbol == OPERATORS.INCLUDE || symbol == OPERATORS.NOT_INCLUDE) {
      return <input className={classes.textInput} value={value} onChange={onChangeValue}/>
    }
    else if(isNull(symbol)) {
      return null;
    }
  }

  const getNumberCondition = () => {
    if(isSimple(symbol)) {
      return <input className={classes.textInput} value={value} onChange={onChangeValue}/>
    }
    else if(symbol == OPERATORS.RANGE) {
      return <div className={classes.numberRange}>
        <input className={classes.numberInput} placeholder="最小值" value={min}  onChange={onChangeMin}/>
        <div className={classes.numberSplit}>~</div>
        <input className={classes.numberInput} placeholder="最大值" value={max}  onChange={onChangeMax}/>
      </div>
    }
    else if(isNull(symbol)) {
      return null;
    }
  }

  const getDateCondition = () => {
    if(symbol == OPERATORS.EQUALS || symbol == OPERATORS.NOT_EQUALS ||
        symbol == OPERATORS.GRATER_OR_EQUAL_TO || symbol == OPERATORS.LESS_OR_EQUAL_TO)
    {
      return <div className={classes.singleDateContainer}>
        <DatePicker className={classes.singleDate} value={getDateValue(value)} onChange={onChangeValue}/>
        </div>
    }
    else if(symbol == OPERATORS.RANGE) {
      return <div className={classes.dateRange}>
        <div className={classes.doubleDateContainer}>
          <DatePicker className={classes.doubleDate} placeholder={"设置开始时间"} value={getDateValue(min)}
            onChange={onChangeMin}/>
        </div>
        <div className={classes.doubleDateContainer}>
          <DatePicker className={classes.doubleDate} placeholder={"设置结束时间"}  value={getDateValue(max)}
            onChange={onChangeMax}/>
        </div>
      </div>
    }
    else if(symbol == OPERATORS.IS_NULL || symbol == OPERATORS.IS_NOT_NULL) {
      return null;
    }
  }

  return (
    <Modal
      title={getTitle()}
      visible={visible}
      closable={false}
      centered
      width={400}
      bodyStyle={{ padding: 0 }}
      maskClosable={false}
      wrapClassName={classes.filterModal}
      onCancel={handleCancel}
      onOk={handleOK}
      key="FilterModal"
    >
      <div className={classes.filterModal}>
        <div className={classes.operator}>
          <span className={classes.label}>{item.label}</span>
          <Select style={{ width: "150px" }}
            defaultValue={symbol}
            key="operator"
            onChange={onChangeSymbol}>
              {getOption(dataType).map((each, idx) => {
                return <Option value={each.value} key={each.label + idx}>{each.label}</Option>
              })}
          </Select>
        </div>
        <div className={classes.conditionContainer}>
        {getCondition(dataType)}
        </div>
      </div>
    </Modal>
  );
}

function isBlank(value){
  return value == null || value == "";
}

function isSimple(symbol) {
  return SIMPLE_SYMBOLS.includes(symbol)
}

function isComplicated(symbol) {
  return COMPLICATED_SYMBOLS.includes(symbol)
}

function isNull(symbol) {
  return NULL_SYMBOLS.includes(symbol)
}

function transDate(value) {
  return moment(value).format('YYYY-MM-DD')
}

function parseNumber(value) {
  let val = parseFloat(value);
  return isNaN(val) ? "" : val;
}

function getValue(val, symbol) {
  let min = "", max = "", value = ""; 

  if(isSimple(symbol)) {
    value = val != null ? val : "";
  }
  else if(isComplicated(symbol)) {
    value = Array.isArray(val) ? val : [];
  }
  else if(symbol == OPERATORS.RANGE) {
    if(Array.isArray(val) && val.length == 2) {
      min = val[0];
      max = val[1];
    }
    else {
      console.log("Wrong data for filter when in range mode!!");
    }
  }

  return {min, max, value};
}

export default connect(
  store => ({
    dataSource: store.bi.dataSource
  }),
  {}
)(FilterModal);
