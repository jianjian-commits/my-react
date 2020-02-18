import React from "react";
import { Form, Icon, Tooltip, Spin, Upload, Button, message } from "antd";
import ID from '../../../../utils/UUID';
import { postFile } from "../../utils/filePostUtils";
export default class FileUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // loadStatusMsg: (
      //   <div className="fileUploadStatus">
      //     <img src="/image/icons/file@2x.png" />
      //     <span>选择文件上传</span>
      //   </div>
      // ),
      // uploadFileList: [],
      // canUpload: true //能否上传的一个标志位
      clicked: "none",
      uploadFileList: [],
      loadStatusMsg: null,
      canUpload: true,
      visible: false
    };
    this.handleBeforeUpload = this.handleBeforeUpload.bind(this);
  }
  handleBeforeUpload(file) {
    const { fileUnit, fileSize, fileCount } = this.props.item;
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
      message.error("文件过大,无法上传");
      this.setState({
        canUpload: true
      });
      return false;
    } else {
      this.setState({
        loadStatusMsg: (
          <div>
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
      reader.onload = () => {
        const { onChange } = this.props;
        const { fileCount } = this.props.item;
        const newFileList = [...this.state.uploadFileList];
        newFileList.push({
          name: file.name,
          url: reader.result
        });
        this.setState(
          {
            loadStatusMsg: (
              <div className="fileUploadStatus">
                <Icon type="plus" />
                <span>
                  继续上传{this.state.uploadFileList.length + 1}/{fileCount}
                </span>
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
    if (name.length > 7) {
      return name.substr(0, 7) + "...";
    } else {
      return name;
    }
  }
  _deleteExsitFile(index) {
    const { fileCount } = this.props.item;
    const { onChange } = this.props;
    const newFileList = this.state.uploadFileList.filter(
      (item, i) => i != index
    );
    this.setState(
      {
        loadStatusMsg:
          this.state.uploadFileList.length - 1 != 0 ? (
            <div className="fileUploadStatus">
              <Icon type="plus" />
              <span>
                继续上传{this.state.uploadFileList.length - 1}/{fileCount}
              </span>
            </div>
          ) : (
            <div className="fileUploadStatus">
              <img src="/image/icons/file@2x.png" />
              <span>选择文件上传</span>
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
  handleOnchange = e => {
    const { onChange } = this.props;
    const { fileUnit, fileSize, fileCount } = this.props.item.validate;
    let fileObj = e.target.files[0];

    let checkNumber = 0;
    switch (fileUnit) {
      case "KB":
        checkNumber = 1024 * fileSize;
        break;
      case "MB":
        checkNumber = 1024 * 1024 * fileSize;
        break;
      case "GB":
        checkNumber = 1024 * 1024 * 1024 * fileSize;
        break;
    }
    if (checkNumber < fileObj.size) {
      message.error("文件过大,无法上传");
    } else {
      let reader = new FileReader();
      reader.readAsDataURL(fileObj);
      let uploadFileSize = null;
      if (fileObj.size < 1024) {
        uploadFileSize = fileObj.size + "B";
      } else if (fileObj.size > 1024 && fileObj.size < 1024 * 1024) {
        uploadFileSize = (fileObj.size / 1024).toFixed(2) + "KB";
      } else if (
        fileObj.size > 1024 * 1024 &&
        fileObj.size < 1024 * 1024 * 1024
      ) {
        uploadFileSize = (fileObj.size / (1024 * 1024)).toFixed(2) + "MB";
      } else if (fileObj.size > 1024 * 1024 * 1024) {
        uploadFileSize =
          (fileObj.size / (1024 * 1024 * 1024)).toFixed(2) + "GB";
      } else {
        uploadFileSize = null;
      }

      // reader.onload = e => {
      //   let newImgList = [...this.state.uploadFileList];
      //   newImgList.push({
      //     name: fileObj.name,
      //     url: e.target.result,
      //     size:uploadFileSize
      //   });
      //   this.setState(
      //     {
      //       uploadFileList: newImgList,
      //       canUpload: fileCount > newImgList.length
      //     },
      //     () => {
      //       onChange && onChange(this.state.uploadFileList);
      //     }
      //   );
      // };
      
      let identification = ID.uuid();
      postFile(fileObj,identification);
      let newImgList = [...this.state.uploadFileList];
      newImgList.push({
        name: fileObj.name,
        // url: e.target.result,
        url:identification,
        size: uploadFileSize
      });
      this.setState(
        {
          uploadFileList: newImgList,
          canUpload: fileCount > newImgList.length
        },
        () => {
          onChange && onChange(this.state.uploadFileList);
        }
      );
    }
  };


  render() {
    const { item } = this.props;
    return (
      <div className="fileUploadContainer">
        <div className="fileUploadBtn">
          <input
            key={Math.random()}
            type="file"
            onChange={this.handleOnchange}
            disabled={!this.state.canUpload}
          />
          <Button>
            {this.state.uploadFileList.length == 0 ? (
              <div className="fileUploadStatus">
                <img src="/image/icons/file2.png" />
                <span>文件上传</span>
              </div>
            ) : (
              <div className="fileUploadStatus">
                <Icon type="plus"></Icon>
                <span>
                  继续添加{this.state.uploadFileList.length}/{item.validate.fileCount}
                </span>
              </div>
            )}
          </Button>
        </div>
        <div className="showFileList">
          {this.state.uploadFileList.map((item, index) => (
            <div className="fileItem" key={index}>
              <div className="fileName">
                <Icon style={{ color: "green" }} type="check" />
                {/* <span>[{this._cutFileName(item.name)}]上传成功</span> */}[
                <span>{item.name}</span>]上传成功
              </div>
              <img
                onClick={() => {
                  this._deleteExsitFile(index);
                }}
                src="/image/icons/delete2.png"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
}

{
  /* <Upload
          name=""
          action=""
          fileList={this.state.fileList}
          beforeUpload={this.handleBeforeUpload}
          transformFile={file => {
            this.handleTransformFile(file, item.key);
          }}
          disabled={!this.state.canUpload}
        >
          <Button>{this.state.loadStatusMsg}</Button>
        </Upload> */
}
