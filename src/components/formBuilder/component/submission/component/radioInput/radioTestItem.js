import React from "react";
import classNames from "classnames";

class RadioOption extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { label, value } = this.props.option;
    return (
      <div
        className={classNames('radioOption', { radioInline: this.props.inline })}
        value={value}
        onClick={() => {
          console.log(this.props.index)
          this.props.handleSelect(this.props.index);
        }}
      >
        <i className='out_i'>
          <i className={classNames('inner_i', { selectOption: this.props.isSelect })} />
        </i>
        <span>{label}</span>
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
      selectValue: index
    };
    this.handleSelect = this.handleSelect.bind(this);
  }

    // 设置默认的选中值
  setDefaultSetected(selectedValues, allvalues=[]) {
    const indexs = allvalues.map(item => item.value);
    const index = indexs.indexOf(selectedValues);
    return index;
  };


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
    console.log(this.state.selectValue, index)
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
            onChange(this.props.item.values[index].value);
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

    console.log(values)

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
          />
        ))}
      </div>
    );
  }
}
