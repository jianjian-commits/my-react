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
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="7.99976" cy="8" r="5.71265" fill="white"/>
                <path d="M8 0C3.584 0 0 3.584 0 8C0 12.416 3.584 16 8 16C12.416 16 16 12.416 16 8C16 3.584 12.416 0 8 0ZM11.584 11.5733C11.3707 11.7867 11.0293 11.7867 10.8267 11.5733L7.968 8.69333L5.06667 11.5627C4.85333 11.776 4.512 11.776 4.29867 11.5627C4.08533 11.3493 4.08533 11.008 4.29867 10.8053L7.21067 7.92533L4.45867 5.17333C4.24533 4.96 4.24533 4.61867 4.45867 4.416C4.672 4.20267 5.01333 4.20267 5.216 4.416L7.968 7.17867L10.7627 4.416C10.976 4.20267 11.3173 4.20267 11.5307 4.416C11.744 4.62933 11.744 4.97067 11.5307 5.17333L8.72533 7.94667L11.5733 10.816C11.7867 11.0187 11.7867 11.36 11.584 11.5733Z" fill="#EA3434"/>
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
