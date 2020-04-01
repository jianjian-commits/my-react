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
    const {item, value} = props;
    const indexs = item.values.map(item => item.value);
    let selectValues = [];
      if (value) {
          value.forEach(item => {
          let index = indexs.indexOf(item);
          if (index > -1) {
            selectValues.push(index);
          }
          });
      } else if (item.isMobileChild && item.data) {
        // console.log("item data",item.data);
        item.data.forEach(item => {
          let index = indexs.indexOf(item);
          if (index > -1) {
            selectValues.push(index);
          }
          });
      }
    this.state = {
      selectValues: selectValues,
      hasClicked: false // 判断是否去URL的默认值
    };
    this.handleSelect = this.handleSelect.bind(this);
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
  
  // componentWillReceiveProps(nextProps) {
  //    if (!this.state.hasClicked) {
  //      const {item, value } = nextProps;
  //     if (value) {
  //       this.setDefaultSetected(value, item.values);
  //     } else if (item.isMobileChild && item.data) {
  //     this.setDefaultSetected(item.data, item.values);
  //     }
  //   }
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
