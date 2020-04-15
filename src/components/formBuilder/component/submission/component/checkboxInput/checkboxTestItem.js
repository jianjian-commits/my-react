import React from "react";
import classNames from "classnames";
import { Input } from "antd";

class CheckboxOption extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { label, value, isExtra } = this.props.option;
    let { inputValue } = this.props;
    let inputMiddleValue = inputValue ? inputValue[inputValue.length - 1]:'';
    return (
      <>
      <div
        className={classNames("checkboxOption",{checkboxInline: this.props.inline})}
        value={value}
        onClick={() => {
          this.props.handleSelect(this.props.index);
        }}
      >
        <i className={classNames({ selectOption: this.props.isSelect })} />
        <span>{label}</span>
      </div>
        {
          isExtra?<Input type="text" disabled={!this.props.isSelect} defaultValue={ inputMiddleValue } onChange= { this.props.handleSelectInput }  className="radio-label-inputvalue"/>:null
        }
      </>
    );
  }
}

export default class CheckboxInput extends React.Component {
  constructor(props) {
    super(props);
    const {item, value} = props;
    const indexs = item.values.map(item => item.value);
    let selectValues = [];
      if (value) {
          value.forEach(item => {
            let newIndexs = this.setIndex(selectValues, item, indexs, 0);
            selectValues = selectValues.concat(newIndexs);
          });
      } else if (item.isMobileChild && item.data) {
        item.data.forEach(item => {
          let newIndexs = this.setIndex(selectValues, item, indexs, 0);
          selectValues = selectValues.concat(newIndexs);
          });
      }
      selectValues = [...new Set(selectValues)];
    this.state = {
      selectValues: selectValues,
      childInputValue: ''
    };
    this.handleSelect = this.handleSelect.bind(this);
    this.setInputSetected = this.setInputSetected.bind(this);
  }
  //设置默认选中的值 
  setIndex(selectValues=[], data, indexs, startIndex){
    let index = indexs.indexOf(data, startIndex) === -1 ? indexs.length - 1 :indexs.indexOf(data, startIndex);
    if(index > -1 && selectValues.indexOf(index) !== -1 && startIndex < indexs.length - 1){
      console.log(1)
      startIndex ++;
      return this.setIndex(selectValues, data, indexs, startIndex)
    }
    selectValues.push(index);
    return selectValues;
  }

    // 设置默认的选中值
    setDefaultSetected = (selectedValues = [], allvalues = []) => {
      const indexs = allvalues.map(item => item.value);
      const defaultSelected = [];
      console.log(selectedValues,allvalues)
      selectedValues.forEach(value => {
        let index = indexs.indexOf(value);
        if (index > -1) {
          defaultSelected.push(index);
        }
      });
      this.setState({
        selectValues: defaultSelected
      });
    };
  
    // 设置输入框的值
    setInputSetected(e){
      let { value } = e.target;
      
      if(value && this.props.handleInputValue){
        this.props.handleInputValue(value);
      }else{
        this.setState({
          childInputValue:value
        })
      }
    }

  handleSelect(index) {
    // 获取表单中的onChange
    const { onChange } = this.props;
    let childInputValue = this.state.childInputValue;
    if (this.state.selectValues.includes(index)) {
      this.setState(
        state => ({
          ...state,
          selectValues: this.state.selectValues.filter(i => i !== index)
        }),
        () => {
          if (onChange) {
            onChange(
                  this.state.selectValues.map(i => this.props.item.values[i].value)
                  );
          }
        }
      );
    } else {
        let selectValuesArr = this.state.selectValues;
        if(index === (this.props.item.values.length - 1)){
          selectValuesArr.push(index);
        }else{
          selectValuesArr.unshift(index)
        }
        console.log(selectValuesArr)
        this.setState(
          state => ({
            ...state,
            selectValues: selectValuesArr
          }),
          () => {
            if (onChange) {
              if(this.props.item.values[index].isExtra){
                console.log(1)
                let seletctValuesArr  = this.state.selectValues.map(i => this.props.item.values[i].value);
                seletctValuesArr.splice(-1,1,childInputValue)
                onChange(
                  seletctValuesArr
                )
              }else{
                onChange(
                  this.state.selectValues.map(i => this.props.item.values[i].value)
                );
              }
            }
          }
        );
     
    }
    if(this.props.handleChange)
    {
      this.props.handleChange(this.props.item.values[index]);
    }
  }
  render() {
    const { values, inline } = this.props.item;
    const { inputValue } = this.props
    return (
      <div className={classNames("checkboxGroup",{ checkboxGroupInline:inline })}>
        {values.map((item, index) => (
          <CheckboxOption
            option={item}
            isSelect={this.state.selectValues.includes(index)}
            key={index}
            index={index}
            inline={ inline }
            handleSelect={this.handleSelect}
            handleSelectInput={this.setInputSetected}
            inputValue = { inputValue }
          />
        ))}
      </div>
    );
  }
}
