import React from "react";
import { Spin, Icon, Popover,Input } from "antd";
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
        isShowExtra:false,
        inputValue:'其他'
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
                        this.setState({isShowExtra:false});
                    }else{
                      
                        this.setState({selectIndex:index,isPopoverVisible:false},()=>{
                            onChange(dropDownOptions[index].value);
                        })
                        if(item.isExtra) {
                          this.setState({isShowExtra:true});
                        }else{
                          this.setState({isShowExtra:false});
                        }
                    }
                }} key={index}>
                    <span className="dropDownItemSpan">{item.label}</span>
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
                      },()=>{
                        onChange(this.state.inputValue)
                      })
                    }
                  }
                  onBlur = {
                    e =>{
                      e.preventDefault();
                      e.stopPropagation();
                      this.setState({
                        isShowExtra:false
                      })
                    }
                
                  }
                  defaultValue = { this.state.inputValue === "其他" ? '':this.state.inputValue}
                /> : null
              }
            </div>
      </div>
    );
  }
}
