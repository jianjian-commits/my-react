import React from "react";
import classNames from "classnames";

class CheckboxOption extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { label, value } = this.props.option;
    return (
      <div
        className="checkboxOption"
        value={value}
        onClick={() => {
          this.props.handleSelect(this.props.index);
        }}
      >
        <i className={classNames({ selectOption: this.props.isSelect })} />
        <span>{label}</span>
      </div>
    );
  }
}

export default class CheckboxInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectValues: []
    };
    this.handleSelect = this.handleSelect.bind(this);
  }
  // componentDidMount(){
  //   this.props.onChange("");
  // }
  handleSelect(index) {
    const { onChange } = this.props;
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
      this.setState(
        state => ({
          ...state,
          selectValues: [...this.state.selectValues, index]
        }),
        () => {
          if (onChange) {
            onChange(
              this.state.selectValues.map(i => this.props.item.values[i].value)
            );
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
      <div className="checkboxGroup">
        {values.map((item, index) => (
          <CheckboxOption
            option={item}
            isSelect={this.state.selectValues.includes(index)}
            key={index}
            index={index}
            handleSelect={this.handleSelect}
          />
        ))}
      </div>
    );
  }
}
