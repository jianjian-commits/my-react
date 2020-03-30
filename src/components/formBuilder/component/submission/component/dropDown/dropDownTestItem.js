import React from "react";
import { Spin, Icon, Popover } from "antd";
import classNames from "classnames";
export default class DropDownTestItem extends React.Component {
  // 这个的数据编辑是否有问题。。。。
  constructor(props) {
    super(props);
    this.state = {
      selectIndex: -1,
      isPopoverVisible: false
    };
  }

  // componentWillReceiveProps(newProps){
  //   if(newProps.selections.length == 0){
  //     this.setState({selectIndex:-1})
  //   }else{
  //     let selectIndex = newProps.item.data.values.map(item =>item.value).indexOf(newProps.value)
  //     this.setState({selectIndex})
  //   }
  // }

  componentDidMount() {
    const { onChange, item } = this.props;
    // onChange("");
    document.addEventListener("click", event => {
      const e = event || window.event;
      const btn = document.getElementById("dropDownBtn" + item.id);
      if (
        e.srcElement.parentElement &&
        !e.srcElement.parentElement.isSameNode(btn) &&
        !e.srcElement.isSameNode(btn)
      ) {
        this.setState({ isPopoverVisible: false });
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    const { selections } = nextProps;
    if (selections.length === 0) {
      this.setState({
        selectIndex: -1
      });
    }
  }

  render() {
    const { item, onChange } = this.props;
    let { selections } = this.props;

    let { selectIndex, isPopoverVisible } = this.state;
    return (
      <div className="dropDownContainer">
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
            style={selectIndex == -1 ? { color: "rgba(170,170,170,1)" } : {}}
          >
            {selectIndex == -1 ? "请选择" : selections[selectIndex].value}
          </span>
          {isPopoverVisible === false ? (
            <Icon type="down" />
          ) : (
            <Icon type="up" />
          )}
        </div>
        {isPopoverVisible == true ? (
          <div className="dropDownItemContainer" id={"dropDown" + item.id}>
            {this.props.selections.map((item, index) => (
              <div
                className={classNames("dropDownItem", {
                  selectOption: selectIndex == index
                })}
                onClick={() => {
                  const { callEventArr } = this.props.item;
                  if (selectIndex === index) {
                    this.setState({ selectIndex: -1, isPopoverVisible: false });
                    onChange("");
                    if (callEventArr) {
                      callEventArr.forEach(fnc => {
                        fnc(undefined, this);
                      });
                    }
                  } else {
                    this.setState({
                      selectIndex: index,
                      isPopoverVisible: false
                    });
                    onChange(selections[index].value);
                    if (callEventArr) {
                      callEventArr.forEach(fnc => {
                        fnc(selections[index].value, this);
                      });
                    }
                  }
                }}
                key={index}
              >
                <span className="dropDownItemSpan">{item.label}</span>
              </div>
            ))}
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}
