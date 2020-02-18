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
        className="radioOption"
        value={value}
        onClick={() => {
          this.props.handleSelect(this.props.index);
        }}
      >
        {/* <i className={classNames({ selectOption: this.props.isSelect })} /> */}
        <i className='out_i'>
          <i className={classNames('inner_i',{ selectOption: this.props.isSelect })}/>
        </i>
        <span>{label}</span>
      </div>
    );
  }
}

export default class RadioTest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectValue: -1
    };
    this.handleSelect = this.handleSelect.bind(this);
  }
  handleSelect(index) {
    const { onChange } = this.props;
    if (this.state.selectValue == index) {
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
    if(this.props.handleChange)
    {
      this.props.handleChange(this.props.item.values[index]);
    }
  }
  render() {
    const { values } = this.props.item;
    return (
      <div className="radioGroup">
        {values.map((item, index) => (
          <RadioOption
            option={item}
            isSelect={this.state.selectValue == index}
            key={index}
            index={index}
            handleSelect={this.handleSelect}
          />
        ))}
      </div>
    );
  }
}
