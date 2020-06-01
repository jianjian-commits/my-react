import React, { Component } from 'react'
import { Input} from 'antd'
import { Modal } from "../../../../../shared/customWidget"
const { TextArea } = Input;
export default class BatchEditingModal extends Component {

  constructor(props){
    super(props);
    this.state={
      tempContent: props.options.map(item => item.value).join("\n") + "\n",
      tempOptions: props.options,
    }
  }

  componentDidUpdate(prevProps) {
    // 典型用法（不要忘记比较 props）：
    if (this.props.options !== prevProps.options) {
      this.setState({
        tempOptions: this.props.options,
        tempContent: this.props.options.map(item => item.value).join("\n") + "\n",
      })
    }
  }

  handleOk = e => {
    this.props.changeModalVisible(false);
    this.props.addChooseItems(this.state.tempOptions);
  };

  handleCancel = e => {
    this.props.changeModalVisible(false);
  };

  handleContent = (e) =>{
    const newArray = this.handleArray(e.target.value.split("\n"));
    this.setState({
      tempOptions: newArray,
      tempContent: e.target.value
    })
  }

  handleArray(arr){
    // 处理掉额外的空格 和换行符
    return arr.map(item =>
      item.trim())
      .filter(item =>item !== "")
      .map(item=>({
        value: item,
        label: item,
        shortcut: ""
      }))
  }

  render() {
    const  { tempContent } = this.state;
    const { visible } = this.props;
    return (
      <Modal
        title="批量编辑"
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        maskClosable={false}
        closable={false}
        className="BatchEditingModalStyle"
      >
        <p>输入选项内容，每一行为一个选项内容</p>
        <TextArea
          autoSize={false}
          onChange={this.handleContent}
          value={tempContent}>
        </TextArea>
      </Modal>
    )
  }
}
