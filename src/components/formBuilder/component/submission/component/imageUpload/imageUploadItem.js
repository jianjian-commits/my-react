import React from "react";
import { Form, Icon, Tooltip, Spin, Upload, Button, message } from "antd";

export default class ImageUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loadStatusMsg: (
        <div>
          <Icon type="plus-circle" theme="filled" />
          <p>点击添加图片</p>
          <p>{props.value.length}/{props.item.validate.fileCount}</p>
        </div>
      ),
      uploadFileList: props.value,
      canUpload: props.item.validate.fileCount > props.value.length //能否上传的一个标志位
    };
    this.handleBeforeUpload = this.handleBeforeUpload.bind(this);
  }
  handleBeforeUpload(file) {
    const { fileUnit, fileSize, fileCount } = this.props.item.validate;
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
      message.error('文件过大，无法上传');
      this.setState({
        canUpload: true
      });
      return false;
    } else {
      this.setState({
        loadStatusMsg: (
          <div style={{ color: "green" }}>
            <Spin />
            正在上传
          </div>
        ),
        canUpload: true
      });
    }
    return true;
  }
  handleTransformFile(file) {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      let uploadFileSize = null;
      if(file.size<1024){
        uploadFileSize = file.size+"B";
      }else if(file.size>1024&&file.size<1024*1024){
        uploadFileSize = (file.size/1024).toFixed(2)+"KB"
      }else if(file.size>1024*1024&&file.size<1024*1024*1024){
        uploadFileSize = (file.size/(1024*1024)).toFixed(2)+"MB";
      }else if(file.size>1024*1024*1024){
        uploadFileSize = (file.size/(1024*1024*1024)).toFixed(2)+"GB";
      }else{
        uploadFileSize = null
      }
      reader.onload = () => {
        const { onChange } = this.props;
        const { fileCount } = this.props.item.validate;
        const newFileList = [...this.state.uploadFileList];
        newFileList.push({
          name: file.name,
          url: reader.result,
          size:uploadFileSize
        });
        this.setState(
          {
            loadStatusMsg: (
              <div>
                <Icon type="plus-circle" theme="filled" />
                <p>点击添加图片</p>
                <p>{ newFileList.length}/{fileCount}</p>
              </div>
            ),
            uploadFileList: newFileList,
            canUpload: fileCount > newFileList.length
          },
          () => {
            onChange(this.state.uploadFileList);
          }
        );
      };
      resolve(file);
    });
  }
  _cutFileName(name) {
    if (name.length > 8) {
      return name.subString(0, 8) + "...";
    } else {
      return name;
    }
  }
  _deleteExsitFile(index) {
    const { fileCount } = this.props.item.validate;
    const { onChange } = this.props;
    const newFileList = this.state.uploadFileList.filter(
      (item, i) => i !== index
    );
    this.setState(
      {
        loadStatusMsg: (
          <div>
            <Icon type="plus-circle" theme="filled" />
            <p>点击添加图片</p>
            <p>{ newFileList.length}/{fileCount}</p>
          </div>
        ),
        uploadFileList: newFileList,
        canUpload: fileCount > newFileList.length
      },
      () => {
        onChange(this.state.uploadFileList);
      }
    );
  }
  render() {
    const { item } = this.props;
    return (
      <div className="imageUploadContainer">
        <Upload
          name=""
          action=""
          accept="image/*"
          fileList={this.state.fileList}
          beforeUpload={this.handleBeforeUpload}
          transformFile={file => {
            this.handleTransformFile(file, item.key);
          }}
          disabled={!this.state.canUpload}
        >
          <Button>{this.state.loadStatusMsg}</Button>
        </Upload>
        <div className="img-item-container">
          {this.state.uploadFileList.map((item, index) => (
            <div className="imageItem" key={index}>
              <img src={item.url} />
              <div
                onClick={() => {
                  this._deleteExsitFile(index);
                }}
                className="deleteBtn"
              >
                <img src="/image/icons/deleteImg@2x.png"/>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
