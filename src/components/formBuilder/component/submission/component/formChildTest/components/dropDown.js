import React from "react";
import { Spin, Icon, Popover } from "antd";
import classNames from 'classnames';
export default class DropDownTestItem extends React.Component {
  constructor(props) {
    super(props);
    const { item } = props;
    let index = -1;
    if(item != void 0){
      const indexs = item.values.map(item => item.value);
      index = indexs.indexOf(item.data);
    }
    this.state = {
        selectIndex: index,
    };
  }

  // componentDidMount(){
  //     const {onChange} = this.props;
  //     onChange("");
  // }

  render() {
    const {item,onChange} = this.props;
    const { dropDownOptions } = item;
    const {selectIndex} = this.state;
    
    return (
      <div className="dropDownContainer">
            <div>
              {dropDownOptions.map((item, index) => (
                <div className={classNames("dropDownItem",{ selectOption: selectIndex==index})}
                onClick={()=>{
                    if(selectIndex === index){
                        this.setState({selectIndex:-1,isPopoverVisible:false},()=>{
                            onChange("");
                        })
                    }else{
                        this.setState({selectIndex:index,isPopoverVisible:false},()=>{
                            onChange(dropDownOptions[index].value);
                        })
                    }
                }} key={index}>
                    <span className="dropDownItemSpan">{item.label}</span>
                </div>
              ))}
            </div>
      </div>
    );
  }
}
