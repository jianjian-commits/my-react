import React from "react";
import { Button, Icon, message, Modal } from "antd";
import ID from '../../../../utils/UUID';
import { postFile } from "../../utils/filePostUtils";
class FileUploadMobileItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: "none",
      uploadFileList: [],
      loadStatusMsg: null,
      canUpload: true,
      visible: false
    };
  }

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleOk = e => {
    this.setState({
      visible: false
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false
    });
  };

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
      this.setState({
        canUpload: true
      });
    } else {
      let reader = new FileReader();
      reader.readAsDataURL(fileObj);
      
      let uploadFileSize = null;
      if(fileObj.size<1024){
        uploadFileSize = fileObj.size+"B";
      }else if(fileObj.size>1024&&fileObj.size<1024*1024){
        uploadFileSize = (fileObj.size/1024).toFixed(2)+"KB"
      }else if(fileObj.size>1024*1024&&fileObj.size<1024*1024*1024){
        uploadFileSize = (fileObj.size/(1024*1024)).toFixed(2)+"MB";
      }else if(fileObj.size>1024*1024*1024){
        uploadFileSize = (fileObj.size/(1024*1024*1024)).toFixed(2)+"GB";
      }else{
        uploadFileSize = null
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
    this.handleCancel();
  };

  _deleteExsitFile = index => {
    const { fileCount } = this.props.item;
    const { onChange } = this.props;
    const newImgList = this.state.uploadFileList.filter((item, i) => i !== index);
    this.setState(
      {
        uploadFileList: newImgList,
        canUpload: fileCount > newImgList.length
      },
      () => {
        onChange(this.state.uploadFileList);
      }
    );
  };
  _cutFileName(name) {
    if (name.length > 9) {
      return name.substr(0, 9) + "...";
    } else {
      return name;
    }
  }
  render() {
    const { item ,type} = this.props;
    return (
      <div className="fileUploadMobileContainer">
        <div className="fileUploadBtn">
        <input
          key={Math.random()}
          type="file"
        onChange={this.handleOnchange}
           disabled={!this.state.canUpload}
                />
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
        </div>
        
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

export default FileUploadMobileItem;
