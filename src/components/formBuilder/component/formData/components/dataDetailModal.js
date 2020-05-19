import React from "react";
import { Modal, Table } from "antd";
import { connect } from "react-redux";
import { getSubmissionDetail } from "../redux/utils/getDataUtils";
import config from "../../../config/config";
import { localDate } from "../../../utils/coverTimeUtils";
class DataDetailModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  _renderFileData = fileData => {

    if (fileData.length > 0) {
      return fileData.map((item, index) => (
        <p key={index}>
          {item["name"]}
          &nbsp; &nbsp;
          <a
            href={config.apiUrl + "/file/identification/" + item["url"]}
            download={item["name"]}
            style={{ textDecoration: "none" }}
          >
            点击下载
          </a>
        </p>
      ));
    }
    return "";
  };
  _renderSignatureData = fileData => {
    if (fileData.length > 0) {
      return fileData.map((item, index) => (
        <p key={index}>
          {item["name"]}
          &nbsp; &nbsp;
          <a
            href={item["url"]}
            download={item["name"]}
            style={{ textDecoration: "none" }}
          >
            点击下载
          </a>
        </p>
      ));
    }
    return "";
  };
  _renderFormChildDataByType(component, submitData) {
    switch (component.type) {
      case "GetLocalPosition":
        return (
          <div className="formChildData">
            {submitData.address ? submitData.address : ""}
          </div>
        );
      case "DateInput":
        return (
          <div className="formChildData">
            {submitData ? submitData : ""}
          </div>
        );
      case "FileUpload":
        return (
          <div className="formChildData">
            {this._renderFileData(submitData)}
          </div>
        );
      case "HandWrittenSignature":
        return (
          <div className="formChildData">
            {this._renderSignatureData(submitData)}
          </div>
        );
      case "ImageUpload":
        return (
          <div className="formChildData">
            {/* {submitData.length>0?<img src={submitData[0].url}/>:""} */}
            {submitData.length > 0
              ? submitData.map((item, index) => (
                  <a href={item.url}>
                    <img src={item.url} key={index} />
                  </a>
                ))
              : ""}
          </div>
        );
      case "Address":
        let { province, county, city, detail } = submitData;
        let address = [province, city, county, detail]
          .filter(item => item)
          .join("");
        return <div className="formChildData">{address}</div>;
      case "CheckboxInput":
      case "MultiDropDown":
        return (
          <div className="formChildData">
            {submitData ? submitData.join(",") : ""}
          </div>
        );
      default:
        return <div className="formChildData">{submitData}</div>;
    }
  }
  renderChildFormTest = (data = [], components = []) => {
    let columns = components.map(component => {
      return {
        title: component.label,
        dataIndex: component.key,
        key: component.key,
        width: 100
      };
    });
    // 一条数据里有 components 里所有组件的一个记录
    if (data.length === 0) {
      data = [""];
    }
    let dataSource = data.map((record, index) => {
      let oneRecord = components.map(component => {
        if (
          component.key !== undefined &&
          record[component.key] !== undefined
        ) {
          let data = {};
          data.key = Math.random();
          data[component.key] = this._renderFormChildDataByType(
            component,
            record[component.key].data
          );
          return data;
        }
      });
      return oneRecord.reduce(function(result, current) {
        return Object.assign(result, current);
      }, {});
    });

    return (
      <div className="formChildTable">
        <Table
          columns={columns}
          scroll={{ x: 482, y: 130 }}
          dataSource={dataSource}
          pagination={false}
          size="small"
        />
      </div>
    );
  };
  _GetTextLength = value => {
    let reg = new RegExp("[\\u4E00-\\u9FFF]", "g");
    let res = value.match(reg);
    let length = value.length;
    length += res ? res.length : 0;
    return length;
  };
  _truncateValue(value) {
    if (value == void 0) {
      return "";
    } else if (value.length > 8) {
      return value.substr(0, 8) + "...";
    } else {
      return value;
    }
  }
  _renderDataByType(formDetail, components) {
    return components
      .filter(item => item.type !== "Button")
      .map(item => {
        switch (item.type) {
          case "SingleText":
          case "TextArea":
          case "RadioButtons":
          case "DropDown":
          case "NumberInput":
          case "EmailInput":
          case "PhoneInput":
          case "IdCardInput":
            return (
              <div key={item.key} className="dataDteailText">
                <p className="dataTitle">{item.label}</p>
                <p className="dataContent">{formDetail[item.key]}</p>
              </div>
            );
          case "DateInput":
            return (
              <div key={item.key} className="dataDteailText">
                <p className="dataTitle">{item.label}</p>
                <p className="dataContent">
                  {formDetail[item.key] != void 0
                    ? localDate(formDetail[item.key], item.type)
                    : ""}
                </p>
              </div>
            );
          case "MultiDropDown":
          case "CheckboxInput":
            return (
              <div key={item.key} className="dataDteailText">
                <p className="dataTitle">{item.label}</p>
                <p className="dataContent">
                  {formDetail[item.key] ? formDetail[item.key].join(",") : ""}
                </p>
              </div>
            );
          case "Address": {
            if (formDetail[item.key] != void 0) {
              let { province, county, city, detail } = formDetail[item.key];
              let address = [province, city, county, detail]
                .filter(item => item)
                .join("");
              return (
                <div key={item.key} className="dataDteailText">
                  <p className="dataTitle">{item.label}</p>
                  <p className="dataContent">{address}</p>
                </div>
              );
            } else {
              return (
                <div key={item.key} className="dataDteailText">
                  <p className="dataTitle">{item.label}</p>
                  <p className="dataContent"></p>
                </div>
              );
            }
          }
          case "ImageUpload":
            return (
              <div key={item.key} className="dataDteailFile">
                <p className="dataTitle">{item.label}</p>
                <div className="imageList">
                  {formDetail[item.key]
                    ? formDetail[item.key].map((data, index) => (
                        <div key={index} className="imageContainer">
                          <img
                            onMouseOver={() => {
                              document.getElementById(
                                String(item.key + "" + index)
                              ).style.display = "inline-block";
                            }}
                            src={data.url}
                          />
                          {/* 谷歌浏览器点击显示详情需要进行浏览器设置 */}
                          <a href={data.url} target="_blank">
                            <div
                              onMouseOut={() => {
                                document.getElementById(
                                  String(item.key + "" + index)
                                ).style.display = "none";
                              }}
                              id={String(item.key + index)}
                              className="imageHover"
                            >
                              <p>{this._truncateValue(data.name)}</p>
                              <p>{data.size}</p>
                            </div>
                          </a>
                        </div>
                      ))
                    : ""}
                </div>
              </div>
            );
          case "FileUpload":
            return (
              <div key={item.key} className="dataDteailFile">
                <p className="dataTitle">{item.label}</p>
                <div className="fileList">
                  {formDetail[item.key]
                    ? formDetail[item.key].map((item, index) => (
                        <div key={index} className="fileContainer">
                          <span>{item.name}</span>,
                          <a
                            href={
                              config.apiUrl +
                              "/file/identification/" +
                              item["url"]
                            }
                            download={item.name}
                          >
                            点击下载
                          </a>
                        </div>
                      ))
                    : ""}
                </div>
              </div>
            );
          case "HandWrittenSignature":
            return (
              <div key={item.key} className="dataDteailFile">
                <p className="dataTitle">{item.label}</p>
                <div className="imageList">
                  {formDetail[item.key] ? (
                    <div className="imageContainer">
                      <img
                        src={
                          formDetail[item.key] ? formDetail[item.key].url : ""
                        }
                      />
                      <div id={String(item.key)} className="imageHover">
                        <span>{formDetail[item.key].name}</span>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            );
          case "FormChildTest":
            return (
              <div key={item.key} className="dataDteailFormChild">
                <p className="dataTitle">{item.label}</p>
                {this.renderChildFormTest(formDetail[item.key], item.values)}
              </div>
            );
          case "GetLocalPosition":
            return (
              <div key={item.key} className="dataDteailText">
                <p className="dataTitle">{item.label}</p>
                {formDetail[item.key] ? (
                  <p className="dataContent">{formDetail[item.key].address}</p>
                ) : (
                  ""
                )}
              </div>
            );
          default:
            return "";
        }
      });
  }
  render() {
    return (
      <Modal
        title="数据详情"
        visible={this.props.modalVisible}
        onOk={this.props.handleOk}
        onCancel={this.props.handleCancel}
        footer={null}
        centered
      >
        <div className="showDataDetail">
          {this._renderDataByType(this.props.formDetail, this.props.components)}
        </div>
      </Modal>
    );
  }
}

export default connect(
  store => ({
    formDetail: store.formSubmitData.formDetail
  }),
  {
    getSubmissionDetail
  }
)(DataDetailModal);
