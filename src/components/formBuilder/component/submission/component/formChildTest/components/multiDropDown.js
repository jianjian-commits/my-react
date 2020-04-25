import React from "react";
import { Spin, Icon, Popover, Input } from "antd";
import classNames from "classnames";
export default class MultiDropDownItem extends React.Component {
  constructor(props) {
    super(props);
    let { item } = this.props;
    const indexs = item.dropDownOptions.map(item => item.value);
    let selectValues = [];
    let inputEditValue = "";
    if(item.data){
      item.data.forEach(value => {
        let index = indexs.indexOf(value);
        if (index > -1) {
          selectValues.push(index);
        }else{
          selectValues.push(item.data.length - 1);
          inputEditValue = value
        }
      });
    }
    this.state = {
      selectIndexArr: selectValues,
      selectValueArr:[],
      isPopoverVisible: false,
      isShowExtra:false,
      inputValue:inputEditValue === ""? '其他': inputEditValue
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
              this.setState({
                isShowExtra:true,
                selectValueArr:dataArr
              })
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

                      this.setState({
                        selectValueArr: dataArr
                      })

                    onChange(dataArr);

                    this.setState({
                      isShowExtra:false,
                      isInputValue:false
                    })
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

                    this.setState({
                      selectValueArr:dataArr
                    })

                    if(item.isExtra) {
                      this.setState({isShowExtra:true})
                    }else{
                      if(this.state.inputValue === "其他"){

                      }else{
                        this.setState({isShowExtra:false})
                      }
                    }

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
        {
                this.state.isShowExtra ? <Input 
                  onChange = {
                    e =>{
                      e.preventDefault();
                      e.stopPropagation();
                      let { value } = e.target;
                      this.setState({
                        inputValue: value
                      })
                    }
                  }
                  onBlur = {
                    // 当失去焦点是时候触发,提交数据的更新
                    e =>{
                      e.preventDefault();
                      e.stopPropagation();
                      this.setState({
                        isShowExtra:false
                      },()=>{
                        let selectMiddleArr = this.state.selectValueArr;
                        selectMiddleArr.pop();
                        let newValue = this.state.inputValue === "其他" ? '': this.state.inputValue
                        let newSelectArr = [...selectMiddleArr,newValue]
                        onChange(newSelectArr)
                        this.setState({
                        selectValueArr:newSelectArr,
                        isInputValue:true
                        })
                      })
                    }
                  }
                  defaultValue = { this.state.inputValue === "其他" ? '':this.state.inputValue}
                /> : null
              }
      </div>
    );
  }
}
