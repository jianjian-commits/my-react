import React from "react";
import { Button, Icon, message } from "antd";
import { Modal } from "../../../../../shared/customWidget"
import { ActionSheet } from "antd-mobile";
// const { ActionSheet} = window["antd-mobile"];
class ImageUploadTestItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: "none",
      uploadImgList: props.value || [],
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
      
      reader.onload = e => {
        let newImgList = [...this.state.uploadImgList];
        newImgList.push({
          name: fileObj.name,
          url: e.target.result,
          size:uploadFileSize
        });
        this.setState(
          {
            uploadImgList: newImgList,
            canUpload: fileCount > newImgList.length
          },
          () => {
            onChange && onChange(this.state.uploadImgList);
          }
        );
      };
    }
    this.handleCancel();
  };
  showActionSheet = () => {
    const BUTTONS = [
      <>
        <input type="file" accept="image/*" onChange={this.handleOnchange} />
        <p>相册</p>
      </>,
      <>
        <input
          type="file"
          capture="camera"
          onChange={this.handleOnchange}
          accept="image/*"
        />
        <p>拍照</p>
      </>,
      "取消"
    ];
    ActionSheet.showActionSheetWithOptions(
      {
        options: BUTTONS,
        maskClosable: true,
        "data-seed": "logId"
      },
      //判断按钮的点击调用
      buttonIndex => {
        switch (buttonIndex) {
          case "0":
          case "1":
          case "2":
          default:
            return null;
        }
      }
    );
  };

  _deleteExsitFile = index => {
    const { fileCount } = this.props.item.validate;
    const { onChange } = this.props;
    const newImgList = this.state.uploadImgList.filter((item, i) => i !== index);
    this.setState(
      {
        uploadImgList: newImgList,
        canUpload: fileCount > newImgList.length
      },
      () => {
        onChange(this.state.uploadImgList);
      }
    );
  };
  render() {
    const { fileCount } = this.props.item.validate;
    return (
      <div className="imageUploadMobileContainer">
        <Modal
          title=""
          visible={this.state.visible}
          footer={null}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width="5.5rem"
          style={{
            height: "4rem"
          }}
          centered
        >
          <div className="uploadChoicesContainer">
            <div className="uploadChoices">
              <div className="uploadChoiceItem">
                <input
                  type="file"
                  accept="image/*"
                  capture="camera"
                  onChange={this.handleOnchange}
                />
                <div className="choiceHover">
                  <Icon type="camera" />
                  <span>相机</span>
                </div>
              </div>
              <div className="uploadChoiceItem">
                <input
                  type="file"
                  accept="image/*"
                  onChange={this.handleOnchange}
                />
                <div className="choiceHover">
                <Icon type="picture" />
                  <span>相册</span>
                </div>
              </div>
            </div>
          </div>
        </Modal>
        <div className="imageUploadBtn">
        <input
                  key={Math.random()}
                  type="file"
                  accept="image/*"
                  onChange={this.handleOnchange}
                  disabled={!this.state.canUpload}
                />
        <Button disabled={!this.state.canUpload}>
          <Icon type="camera" />
          <span>
            {this.state.uploadImgList.length}/{fileCount}
          </span>
        </Button>
        </div>
        
        {this.state.uploadImgList.map((item, index) => (
          <div
            onClick={() => {
              this._deleteExsitFile(index);
            }}
            className="imgItem"
            key={index}
          >
            <img src={item.url} />
            <div className="imgDeleteBtn">
              <Icon type="close-circle" theme="filled" />
            </div>
          </div>
        ))}
        {/* <div className="imgItem">
          <img src="/image/icons/delete.png" />
          <div className="imgDeleteBtn">
            <Icon type="close-circle" theme="filled" />
          </div>
        </div> */}
      </div>
    );
  }
}

export default ImageUploadTestItem;
