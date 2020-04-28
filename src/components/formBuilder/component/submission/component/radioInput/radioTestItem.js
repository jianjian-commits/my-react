import React from "react";
import classNames from "classnames";
import { Input } from "antd";

class RadioOption extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { label, value, isExtra } = this.props.option;
    const { inputValue } = this.props
    return (
      <div>
      <div
        className={classNames('radioOption', { radioInline: this.props.inline })}
        value={value}
        onClick={() => {
          this.props.handleSelect(this.props.index);
        }}
      >
        <i className='out_i'>
          <i className={classNames('inner_i', { selectOption: this.props.isSelect })} />
        </i>
        <span>{label}</span>
      </div>
        {
          isExtra?<Input type="text" disabled={!this.props.isSelect} defaultValue={ inputValue } onChange= { this.props.handleSelectInput }  className="radio-label-inputvalue"/>:null
        }
      </div>
    );
  }
}

export default class RadioTest extends React.Component {
  constructor(props) {
    super(props);
    const { item, value } = this.props;
    let index = -1;
    if(value && item != void 0) {
      index = this.setDefaultSetected(value, item.values);
    } else if(item.isMobileChild) {
      index = this.setDefaultSetected(item.data, item.values);
    }
    this.state = {
      selectValue: index,
      childInputValue:'',
      childMiddleInputValue:''
    };
    this.handleSelect = this.handleSelect.bind(this);
    this.setInputSetected = this.setInputSetected.bind(this);
  }

    // 设置默认的选中值
  setDefaultSetected(selectedValues, allvalues=[]) {
    let index,indexs;
    indexs = allvalues.map(item => item.value);
    index = indexs.indexOf(selectedValues) === -1? allvalues.length - 1: indexs.indexOf(selectedValues);
    return index;
  };

    // 设置输入框的值
  setInputSetected(e){
    const { onChange } = this.props;
    let { value } = e.target;
    if(value && this.props.handleInputValue){
      this.props.handleInputValue(value);
      this.setState({
        childInputValue:value
      })
    }else{
      this.setState({
        childInputValue:value
      },()=>{
        if(onChange){
          onChange(this.state.childInputValue)
        }
      })
    }
  }
  // componentWillReceiveProps(nextProps) {
  //   if (!this.state.hasClicked) {
  //     const {item, value} = nextProps;
  //     if(value) {
  //       this.setDefaultSetected(value, item.values);
  //     } else if(item.isMobileChild) {
  //       this.setDefaultSetected(item.data, item.values);
  //     }
  //   }
  // }
  
  handleSelect(index) {
    const { onChange } = this.props;
    if (this.state.selectValue === index) {
      this.setState(
        state => ({
          ...state,
          selectValue: -1
        }),
        () => {
          if (onChange) {
            onChange("");
          }
        }
      );
    } else {
      this.setState(
        state => ({
          ...state,
          selectValue: index
        }),
        () => {
          if (onChange) {
            if(this.props.item.values[index].isExtra){
              onChange(this.state.childInputValue);
            }else{
              onChange(this.props.item.values[index].value);
            }
          }
        }
      );
    }
    if (this.props.handleChange) {
      this.props.handleChange(this.props.item.values[index]);
    }
  }
  render() {
    const { values, inline } = this.props.item;
    const { inputValue } = this.props
    return (
      <div className={classNames('radioGroup', { radioGroupInline: inline })}>
        {values.map((item, index) => (
          <RadioOption
            option={item}
            isSelect={this.state.selectValue === index}
            key={index}
            index={index}
            inline={inline}
            handleSelect={this.handleSelect}
            handleSelectInput={this.setInputSetected}
            setChildInputValue = { this.setChildInputValue }
            inputValue = { inputValue }
          />
        ))}
      </div>
    );
  }
}
