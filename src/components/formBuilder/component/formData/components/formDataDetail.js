import React, { PureComponent } from "react";
import { Form, Table, Button } from "antd";
import { connect } from "react-redux";
import locationUtils from "../../../utils/locationUtils";
import { getSubmissionDetail } from "../redux/utils/getDataUtils";
import { initToken } from "../../../utils/tokenUtils";
import HeaderBar from "../../base/NavBar";
import { submitSubmissionApproval } from "../redux/utils/submitApprovalUtils";

class FormDataDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tipVisibility: false,
      formId: this.props.id,
      submissionId: this.props.dataId
    };
  }

  componentDidMount() {
    const { mobile = {}, mountClassNameOnRoot } = this.props;
    mobile.is && mountClassNameOnRoot(mobile.className);

    initToken()
      .then(() => {
        this.props.getSubmissionDetail(
          this.state.formId,
          this.state.submissionId
        );
      })
      .catch(err => {
        console.error(err);
      });
  }
  _renderFileData = fileData => {
    // console.log(fileData, typeof fileData);
    // if (fileData && fileData.name) {
    if (fileData.length > 0) {
      return fileData.map((item, index) => (
        <p key={index} style={{ marginBottom: 0 }}>
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
            {submitData.time ? submitData.time : ""}
          </div>
        );
      case "FileUpload":
      case "HandWrittenSignature":
        return (
          <div className="formChildData">
            {this._renderFileData(submitData)}
          </div>
        );
      case "ImageUpload":
        return (
          <div className="formChildData">
            {/* {submitData.length>0?<img src={submitData[0].url}/>:""} */}
            {submitData.length > 0
              ? submitData.map((item, index) => (
                  <a href={item.url} target="_blank">
                    <img src={item.url} key={index} />
                  </a>
                ))
              : ""}
          </div>
        );
      case "Address":
        let { province, county, city, detail } = submitData || {};
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
    if (data.length == 0) {
      data = [""];
    }
    let dataSource = data.map((record, index) => {
      let oneRecord = components.map(component => {
        if (component.key != undefined && record[component.key] != undefined) {
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
          scroll={{ x: 482 }}
          dataSource={dataSource}
          pagination={false}
          size="small"
        />
      </div>
    );
  };
  _renderDataByType(formDetail, components) {
    return components
      .filter(item => item.type != "CustomValue")
      .map(item => {
        switch (item.type) {
          case "SingleText":
          case "TextArea":
          case "RadioButtons":
          case "DropDown":
          case "number":
          case "EmailInput":
          case "PhoneInput":
          case "IdCardInput":
          case "DateInput":
            return (
              <div key={item.key} className="dataDteailText">
                <p className="dataTitle">{item.label}</p>
                <p className="dataContent">{formDetail[item.key]}</p>
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
              let { province, county, city, detail } =
                formDetail[item.key] || {};
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
                              <p>{data.name}</p>
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
                          <a href={item.url} download={item.name}>
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
  _handleSubmitApproval = () => {
    const { appId, dataId } = this.props;
    const { formDetail } = this.props;
    const { components } = this.props.currentForm;
    let dataArr = [];
    for (let i = 0; i < components.length; i++) {
      dataArr[i] = {};
      dataArr[i][components[i].label] = formDetail[components[i].key];
    }
    // this.props.submitSubmissionApproval(appId,dataId,dataArr)
  };

  render() {
    const { formDetail, currentForm, mobile = {} } = this.props;

    let newCurrentComponents = currentForm.components.filter(
      item => item.type != "CustomValue"
    );
    return (
      <div style={{ width: "100%", height: "100%", paddingBottom: 100 }}>
        <HeaderBar
          backCallback={() => {
            this.props.showformDataDetail("");
          }}
          // name={formComponent.name}
          isShowBtn={false}
        />
        <div className="formDataDetailBtnGroups">
          <Button type="primary" style={{ marginRight: 15 }}>
            编辑
          </Button>
          <Button type="primary" style={{ marginRight: 15 }}>
            删除
          </Button>
          <Button
            type="primary"
            onClick={this._handleSubmitApproval}
            style={{ marginRight: 15 }}
          >
            提交审批
          </Button>
        </div>
        <div className="formDataDetailContainer">
          <div className="formDataDetailTitle">
            <p className="dataTitle">详情</p>
          </div>
          {this._renderDataByType(this.props.formDetail, newCurrentComponents)}
        </div>
      </div>
    );
  }
}

const DataDetail = Form.create()(FormDataDetail);

export default connect(
  store => ({
    formDetail: store.formSubmitData.formDetail,
    currentForm: store.formSubmitData.forms,
    token: store.rootData.token
  }),
  {
    getSubmissionDetail,
    submitSubmissionApproval
  }
)(DataDetail);
