import React from "react";
import { Form, Icon, Tooltip, Spin, Upload, Button, message } from "antd";

import LabelUtils from "../../formBuilder/preview/component/formItemDoms/utils/LabelUtils"
export default class FileUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loadStatusMsg: (
        <div>
          <Icon type="upload" />
          点击选择文件上传
        </div>
      ),
      canUpload: true //能否上传的一个标志位
    };
    this.handleBeforeUpload = this.handleBeforeUpload.bind(this);
    this.validFunction = this.validFunction.bind(this);
  }
  handleBeforeUpload(file) {
    const { fileUnit, fileSize } = this.props.item;
    let checkNumber = 0;
    switch (fileUnit) {
      case "KB":
        checkNumber = 1024;
        break;
      case "MB":
        checkNumber = 1024 * 1024;
        break;
      case "GB":
        checkNumber = 1024 * 1024 * 1024;
        break;
    }
    const limitSize = file.size / checkNumber;
    if (limitSize > fileSize) {
      this.setState({
        loadStatusMsg: (
          <div style={{ color: "red" }}>
            <Icon type="exclamation" />
            {`超过${fileSize + fileUnit},请重新上传`}
          </div>
        ),
        canUpload: true
      });
      return false;
    }
    this.setState({
      loadStatusMsg: (
        <div style={{ color: "green" }}>
          {/* <Icon type="check" /> */}
          <Spin />
          正在上传
        </div>
      ),
      canUpload: true
    });
    return true;
  }
  handleTransformFile(file, key) {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.props.getFileUrl(key, reader.result);
        this.setState({
          loadStatusMsg: (
            <div style={{ color: "green" }}>
              <Icon type="check" />
              [{file.name}],点击选择重新上传
            </div>
          ),
          canUpload: false
        });
      };
      resolve(file);
    });
  }
  //自定义表单验证规则
  validFunction = (rule, value, callback) => {
    const { required, customMessage } = this.props.item.validate;
    if (this.state.canUpload && required) {
      callback(customMessage);
    }
    callback(); // 校验通过
  };
  render() {
    const { getFieldDecorator, item } = this.props;
    let errMsg = this.props.item.validate.customMessage;
    return (
      <Form.Item
        label={
          <LabelUtils data = {item} />
        }
      >
        {getFieldDecorator(item.key, {
          rules: [
            {
              validator: this.validFunction
            }
          ]
        })(
          <Upload
            name=""
            action=""
            fileList={this.state.fileList}
            beforeUpload={this.handleBeforeUpload}
            transformFile={file => {
              this.handleTransformFile(file, item.key);
            }}
            disabled={!this.state.canUpload}
            // showUploadList={true}
          >
            <Button>{this.state.loadStatusMsg}</Button>
          </Upload>
        )}
      </Form.Item>
    );
  }
}
