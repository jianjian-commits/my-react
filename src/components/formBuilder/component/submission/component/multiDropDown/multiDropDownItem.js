import React from "react";
import { Spin, Icon, Popover, Input } from "antd";
import classNames from "classnames";
export default class MultiDropDownItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectIndexArr: [],
      selectValueArr:[],
      isPopoverVisible: false,
      initFlag: true,
      isShowExtta: false,
      isInputValue:false,
      inputValue: "其他"
    };
  }

  // componentWillReceiveProps(newProps) {
  //   if (newProps.selections.length == 0) {
  //     this.setState({ selectIndexArr: [] });
  //   }
    // let selectIndexArr = []
    //   newProps.value.map( value =>{
    //     newProps.item.data.values.map((item,index) => {
    //       if(item.value === value){
    //         selectIndexArr.push(index)
    //       }
    //     })
    //   })
    //   this.setState({ selectIndexArr });
  // }

  componentDidMount() {
    const { item } = this.props;
    document.addEventListener("click", event => {
      const e = event || window.event;
      const items = document.getElementsByClassName("dropDownItem" + item.id);
      const btn = document.getElementById("dropDownBtn" + item.id);
      const isInItems = [];
      for (var i = 0, length = items.length; i < length; i++) {
        if (
          e.srcElement.parentElement.isSameNode(items[i]) || e.srcElement.isSameNode(items[i])
        ) {
          isInItems.push(items[i]);
        }
      }
      //判断点击范围关闭选项
      if (
        e.srcElement.parentElement &&
        !e.srcElement.parentElement.isSameNode(btn) &&
        !e.srcElement.isSameNode(btn) &&
        isInItems.length === 0
      ) {
        this.setState({ isPopoverVisible: false });
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    const { selections } = nextProps;
    if (selections.length === 0) {
      this.setState({
        selectIndexArr: []
      });
    } else if(nextProps.isEditData && this.state.initFlag &&nextProps.value instanceof Array){
      let selectIndexArr = []
      let selectMiddleArr = nextProps.value
      nextProps.value.map( value =>{
        nextProps.item.data.values.map((item,index) => {
          if(item.value === value){
            selectIndexArr.push(index)
          }else{
            selectIndexArr.push( nextProps.value.length - 1)
          }
        })
      })
      let selectMiddleStr = selectMiddleArr.pop()
      if(nextProps.item.data.values.includes(selectMiddleStr)){
      this.setState({ selectIndexArr, initFlag:false });
      }else{
        this.setState({isInputValue:true,inputValue:selectMiddleStr,isShowExtra:true, selectIndexArr, initFlag:false });
      }
    }
  }

  render() {
    const { item, onChange, selections } = this.props;
    // const { selections } = item.data;
    let { selectIndexArr, isPopoverVisible } = this.state;
    const itemClassStr = "dropDownItem" + " " + "dropDownItem" + item.id;
    return (
      <div className="multiDropDownContainer">
        <div
          className="dropDownBtn"
          id={"dropDownBtn" + item.id}
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            this.setState({ isPopoverVisible: !isPopoverVisible });
          }}
        >
          <span
            className="dropDownBtnSpan"
            style={
              selectIndexArr.length === 0 ? { color: "rgba(170,170,170,1)" } : {}
            }
          >
            {selectIndexArr.length === 0
              ? "请选择"
              : 
              <>
                {this.state.isInputValue? 
                  selections
                  .filter((item, i) => selectIndexArr.includes(i))
                  .map((item,index) => 
                    {
                      if(index === (selections.length - 1)){
                      return this.state.inputValue
                      }
                      return item.value
                  }
                    )
                  .join(",")
                  :
                selections
                  .filter((item, i) => selectIndexArr.includes(i))
                  .map(item => item.value)
                  .join(",")
              }
              </>
              }
          </span>
          {isPopoverVisible === false ? (
            <Icon type="down" />
          ) : (
            <Icon type="up" />
          )}
        </div>
        {isPopoverVisible === true ? (
          <div className="dropDownItemContainer" id={"dropDown" + item.id}>
            <div
              // className="dropDownItem"
              className={itemClassStr}
              onClick={() => {
                const { callEventArr } = this.props.item;
                let selectAllArr = [];
                selections.forEach(function(item, index, arr) {
                  selectAllArr.push(index);
                });
                this.setState({ selectIndexArr: selectAllArr }, () => {
                  const dataArr = selections
                    .filter((element, i) =>
                      this.state.selectIndexArr.includes(i)
                    )
                    .map(item => item.value);
                  onChange(dataArr);
                  this.setState({
                    isShowExtra:true,
                    selectValueArr:dataArr
                  })
                  if (callEventArr) {
                    callEventArr.forEach(fnc => {
                      fnc([...dataArr], this);
                    });
                  }
                });
              }}
            >
              <span className="dropDownItemSpan">选择全部</span>
            </div>
            {selections.map((item, index) => (
              <div
                className={classNames(itemClassStr, {
                  selectOption: selectIndexArr.includes(index)
                })}
                onClick={() => {
                  const { callEventArr } = this.props.item;
                  if (selectIndexArr.includes(index)) {
                    this.setState(
                      {
                        selectIndexArr: selectIndexArr.filter(
                          element => element !== index
                        ),
                        isPopoverVisible: true
                      },
                      () => {
                        const dataArr = selections
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
                        if (callEventArr) {
                          callEventArr.forEach(fnc => {
                            fnc([...dataArr], this);
                          });
                        }
                      }
                    );
                  } else {
                    this.setState(
                      {
                        selectIndexArr: [...selectIndexArr, index],
                        isPopoverVisible: true
                      },
                      () => {
                        const dataArr = selections
                          .filter((element, i) =>
                            this.state.selectIndexArr.includes(i)
                          )
                          .map(item => item.value);
                        this.setState({
                          selectValueArr: dataArr
                        })
                        onChange(dataArr);

                        if(item.isExtra) {
                          this.setState({isShowExtra:true})
                        }else{
                          if(this.state.inputValue === "其他"){

                          }else{
                            this.setState({isShowExtra:false})
                          }
                        }

                        if (callEventArr) {
                          callEventArr.forEach(fnc => {
                            fnc([...dataArr], this);
                          });
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
          </div>
        ) : (
          ""
        )}
        {this.state.isShowExtra? 
        <Input onChange={e => 
          {
            let { value } = e.target
            this.setState({
              inputValue: value
            })
          }
        } 
         onBlur = {
          (e)=>{
            e.preventDefault();
            e.stopPropagation()
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
        defaultValue = { this.state.inputValue == '其他' ? '': this.state.inputValue}
        />:null
        }
      </div>
    );
  }
}
{/* <Popover
          overlayClassName="multiDropDownProver"
          onVisibleChange={visible => {
            this.setState({ isPopoverVisible: visible });
            if(visible === false){
                const { callEventArr } = this.props.item;
                const dataArr = selections.filter((item,i) => selectIndexArr.includes(i))
                if (callEventArr) {
                    callEventArr.forEach(fnc => {
                      fnc(dataArr, this);
                    });
                }
            }
          }}
          content={
            <div>
              <div className="dropDownItem"
                onClick={()=>{
                  let selectAllArr = [];
                  selections.forEach(function(item,index,arr){
                    selectAllArr.push(index);
                  })
                  this.setState({selectIndexArr:selectAllArr}, () => {
                    const dataArr = selections
                      .filter((element, i) =>
                        this.state.selectIndexArr.includes(i)
                      )
                      .map(item => item.value);
                    onChange(dataArr);
                  })
                }}
              ><span className="dropDownItemSpan">选择全部</span></div>
              {selections.map((item, index) => (
                <div
                  className={classNames("dropDownItem", {
                    selectOption: selectIndexArr.includes(index)
                  })}
                  onClick={() => {
                    if (selectIndexArr.includes(index)) {
                      this.setState({selectIndexArr: selectIndexArr.filter(element => element!=index),
                        isPopoverVisible: true},()=>{
                            const dataArr = selections.filter((element,i) => this.state.selectIndexArr.includes(i)).map(item => item.value)
                            onChange(dataArr);
                        });
                    } else {
                      this.setState({selectIndexArr: [...selectIndexArr,index],
                        isPopoverVisible: true},()=>{
                            const dataArr = selections.filter((element,i) => this.state.selectIndexArr.includes(i)).map(item => item.value)
                          
                             onChange(dataArr);
                        });
                    }
                  }}
                  key={index}
                >
                  <span className="dropDownItemSpan">{item.label}</span>
                  {selectIndexArr.includes(index)?<Icon type="check"/>:""}
                </div>
              ))}
            </div>
          }
          title=""
          placement="bottom"
          trigger="click"
          visible={isPopoverVisible}
        ></Popover> */}
