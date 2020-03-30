import React from "react";
import { Form, Icon, Tooltip, Spin, Upload, Button, message } from "antd";

export default class FileUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadFileList: props.value,
      canUpload: true //能否上传的一个标志位
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
      message.error('文件过大,无法上传');
      this.setState({
        canUpload: true
      });
      return false;
    } else {
      this.setState({
        canUpload: true
      });
    }
    return true;
  }
  handleTransformFile(file) {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const { onChange } = this.props;
        const { fileCount } = this.props.item.validate;
        const newFileList = [...this.state.uploadFileList];
        newFileList.push({
          name: file.name,
          url: reader.result
        });
        this.setState(
          {
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
    if (name.length > 9) {
      return name.substr(0, 9) + "...";
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
        uploadFileList: newFileList,
        canUpload: fileCount > newFileList.length
      },
      () => {
        onChange(this.state.uploadFileList);
      }
    );
  }
  render() {
    const { item ,type} = this.props;
    
    return (
      <div className="fileUploadMobileContainer">
        <Upload
          name=""
          action=""
          fileList={this.state.fileList}
          beforeUpload={this.handleBeforeUpload}
          transformFile={file => {
            this.handleTransformFile(file, item.key);
          }}
          disabled={!this.state.canUpload}
        >
          <Button style={type=='normal'?{}:{width:'100%'}}>{
            this.state.uploadFileList.length==0?
            <div className="fileUploadStatus">
              <img src="/image/icons/file2.png" />
              <span>文件上传</span>
            </div>:
            <div className="fileUploadStatus">
              <Icon type="plus"></Icon>
              <span>继续添加{this.state.uploadFileList.length}/{item.validate.fileCount}</span>
            </div>
            }</Button>
        </Upload>
        <div className="showFileList">
          {this.state.uploadFileList.map((item, index) => (
            <div className="fileItem" key={index} style={type=='normal'?{}:{width:'100%'}}>
              <div className="fileName">
                 <Icon style={{color:'green'}} type="check" />
                <span>[{this._cutFileName(item.name)}]上传成功</span>
              </div>
              <span className="deleteSpan" style={type=='normal'?{}:{width:'1.6rem'}} onClick={() => {
                this._deleteExsitFile(index);
              }}>删除</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
