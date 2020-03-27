import React, { PureComponent } from "react";
import { Form, Table, Button, Row, Col, Icon, Tabs } from "antd";
import { connect } from "react-redux";
import locationUtils from "../../../utils/locationUtils";
import coverTimeUtils from "../../../utils/coverTimeUtils";
import { getSubmissionDetail, handleStartFlowDefinition } from "../redux/utils/getDataUtils";
import { initToken } from "../../../utils/tokenUtils";
import HeaderBar from "../../base/NavBar";
import FormDataDetailHeader from "./formDataDetailHeader"
const { TabPane } = Tabs;
const columns = [
  {
    title: "审批ID",
    dataIndex: "id"
  },
  {
    title: "环节名称",
    dataIndex: "name"
  },
  {
    title: "操作人",
    dataIndex: "operator"
  },
  {
    title: "状态",
    dataIndex: "status"
  },
  {
    title: "审批意见",
    dataIndex: "opinion"
  },
  {
    title: "日期",
    dataIndex: "dateTime"
  }
];
const data = [
  {
    key: "1",
    id: "101",
    name: "高风险客户",
    operator: "李XX",
    status: "通过",
    opinion: "风险可控",
    dateTime: new Date().toLocaleString("chinese", { hour12: false })
  }
];
const ApprovalStatus = (props) =>{
  const { approveStatus = "going" } = props;
  switch (approveStatus) {
    case "approved":
      return (<span style={{color : "#00c39c"}}>通过</span>)
      break;
    case "refused":
      return (<span style={{color: "red"}}>已拒绝</span>)
    case "going":
        return (<span style={{color: "#ffa439"}}>进行中</span>)
    default:
      return <></>
      break;
  }
}

const EditApprovalButton = (props) =>{
  // 删除和编辑按钮
  // 根据页面详情页的权限展示
  const { detailAuthority , dataId, actionFun, handleDeleteSubmisson, ...rest} = props;
  return (
    true ? 
    (
      <div className="toolbarBox">
        <span 
          onClick={() => {
          actionFun(dataId, true)
           }
        }><Icon component={editIconSvg} style={{marginRight: 5}}/>编辑</span> 
        <span
            onClick={
              ()=>{
                handleDeleteSubmisson(dataId);
              }
            }
      ><Icon component={deleteIconSvg} style={{marginRight: 5}}/>删除</span> 
      </div>
    ):(
      <></>
    )
  )
}

const editIconSvg = (props) =>{
  return (
    <svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.62171 8.09947C6.35794 8.36546 6.01953 8.48436 5.70856 8.20083C5.44077 7.95667 5.47077 7.65206 5.73061 7.3617L11.2145 1.69796C11.488 1.43753 11.8911 1.3106 12.1657 1.56992C12.495 1.88088 12.3545 2.26219 12.0941 2.53562L6.62069 8.09838L6.62171 8.09947Z" fill="#2A7FFF"/>
      <path d="M12.0826 6.47912C12.4095 6.48877 12.5695 6.79515 12.5563 7.13582V11.7475C12.5563 12.6144 11.8536 13.317 10.9868 13.317H1.56951C0.702694 13.317 0 12.6143 0 11.7475V2.33025C0 1.46343 0.702694 0.760742 1.56951 0.760742H7.5733C8.00672 0.760742 8.35805 0.846825 8.35805 1.28024C8.35805 1.71365 8.00672 1.7723 7.5733 1.7723H1.6582C1.28592 1.7723 0.984128 2.07409 0.984128 2.44637V11.6771C0.984128 12.0494 1.28592 12.3512 1.6582 12.3512H10.8432C11.2155 12.3512 11.5173 12.0494 11.5173 11.6771V7.13582C11.472 6.80886 11.6915 6.48877 12.0185 6.47912H12.0826Z" fill="#2A7FFF"/>
    </svg>
  )
}

const deleteIconSvg = (props) =>{
  return(
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.4375 10.625C5.12813 10.625 4.875 10.3719 4.875 10.0625V6.8125C4.875 6.50313 5.12813 6.25 5.4375 6.25C5.74687 6.25 6 6.50313 6 6.8125V10.0625C6 10.3719 5.74687 10.625 5.4375 10.625ZM8.5625 10.625C8.25312 10.625 8 10.3719 8 10.0625V6.8125C8 6.50313 8.25312 6.25 8.5625 6.25C8.87188 6.25 9.125 6.50313 9.125 6.8125V10.0625C9.125 10.3719 8.87188 10.625 8.5625 10.625Z" fill="#2A7FFF"/>
      <path d="M13.4344 2.875H10.5V1.59375C10.5 0.715625 9.78438 0 8.90625 0H5.09375C4.21562 0 3.5 0.715625 3.5 1.59375V2.875H0.565625C0.254687 2.875 0 3.12812 0 3.4375C0 3.74688 0.254687 4 0.565625 4H2V12.0938C2 12.35 2.05 12.6 2.15 12.8359C2.24531 13.0625 2.38281 13.2672 2.55781 13.4422C2.73281 13.6172 2.93594 13.7547 3.16406 13.85C3.4 13.95 3.65 14 3.90625 14H10.0938C10.35 14 10.6 13.95 10.8359 13.85C11.0625 13.7547 11.2672 13.6172 11.4422 13.4422C11.6172 13.2672 11.7547 13.0641 11.85 12.8359C11.95 12.6 12 12.35 12 12.0938V4H13.4344C13.7453 4 14 3.74688 14 3.4375C14 3.12812 13.7453 2.875 13.4344 2.875ZM4.625 1.59375C4.625 1.33438 4.83437 1.125 5.09375 1.125H8.90625C9.16562 1.125 9.375 1.33438 9.375 1.59375V2.875H4.625V1.59375ZM10.875 12.0938C10.875 12.525 10.525 12.875 10.0938 12.875H3.90625C3.475 12.875 3.125 12.525 3.125 12.0938V4H10.875V12.0938Z" fill="#2A7FFF"/>
    </svg>)
}

class FormDataDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tipVisibility: false,
      formId: this.props.id,
      submissionId: this.props.dataId,
      userId: JSON.parse(localStorage.getItem("userDetail")).id,
      tabKey: "formDetail"
    };
  }

  componentDidMount() {
    const { mobile = {}, mountClassNameOnRoot } = this.props;
    mobile.is && mountClassNameOnRoot(mobile.className);

    initToken()
      .then(() => {
        this.props.getSubmissionDetail(
          this.state.formId,
          this.state.submissionId,
          this.props.appId
        );
      })
      .catch(err => {
        console.error(err);
      });
  }

  startApprovelBtnClick = () =>{
    const { formDetail, currentForm, appId } = this.props;
    const { userId, formId } = this.state
    let fieldInfos = currentForm.components.map((component =>{
      if(formDetail[component.key]){
        return ({
          name: component.key,
          value: formDetail[component.key]
        })
      }
    })).filter(item => item !== undefined)
    let data = {
      dataId: this.state.submissionId,
      fieldInfos: fieldInfos
    }
    this.props.handleStartFlowDefinition(formId, appId, data)
  }

  _renderFileData = fileData => {
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
            {submitData.time ? coverTimeUtils.localTime(submitData.time, "yyyy-MM-dd hh:mm:ss") : ""}
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
              <p className="dataContent">{ formDetail[item.key] ? coverTimeUtils.localTime(formDetail[item.key]) : ""}</p>
            </div>
            )
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

  onChangeTab = (key) => {
    this.setState({
      tabKey: key
    })
  }

  render() {
    const { formDetail, currentForm, mobile = {}, extraProp } = this.props;
    const { userId, tabKey } = this.state;
    const editButtonOptions={detailAuthority: true};
    const startApprovelBtnOptions={
      isAssociateApprovalFlow: true,
      isStartApproval: false
    }

    let newCurrentComponents = currentForm.components.filter(
      item => item.type != "CustomValue"
    );
    let operations = {}
    switch (tabKey) {
      case "formDetail":
        operations = <EditApprovalButton {...this.props}/>
        break;
      case "approvelFlow":
        {
          operations = <div className="approvalbox">审批状态：<ApprovalStatus approveStatus={"going"}/></div>
        }
          break;
      default:
        operations = (<></>)
        break;
    }
    return (
      <div style={{ width: "100%", height: "100%", paddingBottom: 100 }}>
        <FormDataDetailHeader
          formId={this.state.formId}
          submissionId={this.state.submissionId}
          actionFun={this.props.actionFun}
          isOwnRecord={extraProp !== null ? extraProp.user.id === userId : false}
          title={currentForm.name}
          startApprovelBtnClick = {this.startApprovelBtnClick}
          {...startApprovelBtnOptions} />
        <div className="formDataDetailContainer">
        <Tabs defaultActiveKey="detail" 
          className="tabsBackground"
          onChange={this.onChangeTab} 
          tabBarExtraContent={operations}
        >
          <TabPane tab="表单详情" key="formDetail">
            {this._renderDataByType(formDetail, newCurrentComponents)}
          </TabPane>
          {
            // 关联审批的才展示审批
          data.length > 0 ? (
            <TabPane tab="审批流水" key="approvelFlow">
              <Table
                className="approveTable"
                pagination={false}
                columns={columns}
                dataSource={data}
                size="middle"
              />
            </TabPane>
          ):<></>
          }
        </Tabs>
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
    token: store.rootData.token,
    extraProp: store.formSubmitData.extraProp
  }),
  {
    getSubmissionDetail,
    handleStartFlowDefinition
  }
)(DataDetail);
