import React from "react";
import { Form, Icon, Tooltip, Spin, Upload, Button, message } from "antd";
import ID from "../../../../../utils/UUID";
import { postFile } from "../../../utils/filePostUtils";
export default class FileUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loadStatusMsg: <div>添加文件</div>,
      uploadFileList: props.value,
      canUpload: props.value < props.item.validate.fileCount//能否上传的一个标志位
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
      this.setState({
        loadStatusMsg: (
          <div>
            文件过大！
            {/* {`超过${fileSize + fileUnit},剩余可上传数量${fileCount-this.state.uploadFileList.length}`} */}
          </div>
        ),
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
  handleTransformFile(fileObj) {
    return new Promise(resolve => {
      // const reader = new FileReader();
      // reader.readAsDataURL(file);
      // reader.onload = () => {
      //   const { onChange} = this.props;
      //   const {fileCount} = this.props.item.validate;
      //   const newFileList = [...this.state.uploadFileList];
      // };
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
      const { fileCount } = this.props.item.validate;
      const { onChange } = this.props;
      let identification = ID.uuid();
      let newImgList = [...this.state.uploadFileList];

      postFile(fileObj, identification);

      newImgList.push({
        name: fileObj.name,
        url: identification,
        size: uploadFileSize
      });
      this.setState(
        {
          loadStatusMsg: <div>添加文件</div>,
          uploadFileList: newImgList,
          canUpload: fileCount > newImgList.length
        },
        () => {
          onChange && onChange(this.state.uploadFileList);
        }
      );
      resolve(fileObj);
    });
  }
  _cutName(name) {
    if (name.length > 8) {
      return name.substring(0, 8) + "...";
    } else {
      return name;
    }
  }
  _deleteExsitFile(index) {
    const { fileCount } = this.props.item.validate;
    const { onChange } = this.props;
    const newFileList = this.state.uploadFileList.filter(
      (item, i) => i != index
    );
    this.setState(
      {
        loadStatusMsg: (
          <div>
            添加文件
            {/* <Icon type="upload" /> */}
            {/* 剩余可上传数量{fileCount-newFileList.length} */}
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
      <div className="formChildFileUpload">
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
          <Button>{this.state.loadStatusMsg}</Button>
        </Upload>
        <div className="showFileList">
          {this.state.uploadFileList.length == 0 ? (
            <div style={{ textAlign: "center" }}>
              <p>未选择任何文件</p>
            </div>
          ) : (
            this.state.uploadFileList.map((item, index) => (
              <div className="fileItem" key={index}>
                {/* <span>{this._cutName(item.name)}</span> */}
                <span className="fileItemSpan">{item.name}</span>
                <Icon
                  type="minus-circle"
                  theme="filled"
                  onClick={() => {
                    this._deleteExsitFile(index);
                  }}
                />
              </div>
            ))
          )}
        </div>
      </div>
    );
  }
}
