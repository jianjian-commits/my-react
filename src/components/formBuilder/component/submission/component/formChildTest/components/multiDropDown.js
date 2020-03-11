import React from "react";
import { Spin, Icon, Popover } from "antd";
import classNames from "classnames";
export default class MultiDropDownItem extends React.Component {
  constructor(props) {
    super(props);
    let { item } = this.props;
    const indexs = item.dropDownOptions.map(item => item.value);
    let selectValues = [];
    item.data.forEach(value => {
      let index = indexs.indexOf(value);
      if (index > -1) {
        selectValues.push(index);
      }
    });
    this.state = {
      selectIndexArr: selectValues,
      isPopoverVisible: false
    };
  }

  render() {
    const { item, onChange } = this.props;
    const { dropDownOptions } = item;
    let { selectIndexArr } = this.state;
    return (
      <div>
        <div
          className="dropDownItem"
          onClick={() => {
            let selectAllArr = [];
            dropDownOptions.forEach(function(item, index, arr) {
              selectAllArr.push(index);
            });
            this.setState({ selectIndexArr: selectAllArr }, () => {
              const dataArr = dropDownOptions
                .filter((element, i) => this.state.selectIndexArr.includes(i))
                .map(item => item.value);
              onChange(dataArr);
            });
          }}
        >
          <span className="dropDownItemSpan">选择全部</span>
        </div>
        {dropDownOptions.map((item, index) => (
          <div
            className={classNames("dropDownItem", {
              selectOption: selectIndexArr.includes(index)
            })}
            onClick={() => {
              if (selectIndexArr.includes(index)) {
                this.setState(
                  {
                    selectIndexArr: selectIndexArr.filter(
                      element => element !== index
                    )
                  },
                  () => {
                    const dataArr = dropDownOptions
                      .filter((element, i) =>
                        this.state.selectIndexArr.includes(i)
                      )
                      .map(item => item.value);
                    onChange(dataArr);
                  }
                );
              } else {
                this.setState(
                  {
                    selectIndexArr: [...selectIndexArr, index]
                  },
                  () => {
                    const dataArr = dropDownOptions
                      .filter((element, i) =>
                        this.state.selectIndexArr.includes(i)
                      )
                      .map(item => item.value);
                    onChange(dataArr);
                  }
                );
              }
            }}
            key={index}
          >
            <span className="dropDownItemSpan">{item.label}</span>
            {selectIndexArr.includes(index) ? <Icon type="check" /> : ""}
          </div>
        ))}
      </div>
    );
  }
}
