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
        className={classNames("checkboxOption",{checkboxInline: this.props.inline})}
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
      selectValues: selectValues
    };
    this.handleSelect = this.handleSelect.bind(this);
  }

  setIndex(selectValues=[], data, indexs, startIndex){
    let index = indexs.indexOf(data, startIndex);
    if(index > -1 && selectValues.indexOf(index) !== -1 && startIndex < indexs.length - 1){
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
    const { values, inline } = this.props.item;
    return (
      <div className={classNames("checkboxGroup",{ checkboxGroup:inline })}>
        {values.map((item, index) => (
          <CheckboxOption
            option={item}
            isSelect={this.state.selectValues.includes(index)}
            key={index}
            index={index}
            inline={ inline }
            handleSelect={this.handleSelect}
          />
        ))}
      </div>
    );
  }
}
