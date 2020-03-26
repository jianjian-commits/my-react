import React, { PureComponent} from "react";
import { Form, Table, Icon, Tabs, message } from "antd";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import coverTimeUtils from "../../../utils/coverTimeUtils";
import { getSubmissionDetail, handleStartFlowDefinition } from "../redux/utils/getDataUtils";
import { deleteFormData } from "../redux/utils/deleteDataUtils"
import { initToken } from "../../../utils/tokenUtils";
import { DeleteIcon, EditIcon } from './svgIcon/index'
import FormDataDetailHeader from "./formDataDetailHeader"
const { TabPane } = Tabs;
const columns = [
  {
    title: "审批ID",
    dataIndex: "id",
    className:"approveCol",
  },
  {
    title: "环节名称",
    dataIndex: "name"
  },
  {
    title: "操作人",
    dataIndex: "assignee"
  },
  {
    title: "状态",
    dataIndex: "status"
  },
  {
    title: "审批意见",
    dataIndex: "comment"
  },
  {
    title: "日期",
    dataIndex: "approveDate"
  }
];

const ApprovalStatus = (props) =>{
  const { approveStatus  } = props;
  switch (approveStatus) {
    case "已同意":
      return (<span style={{color : "#00c39c"}}>{approveStatus}</span>)
      break;
    case "已拒绝":
      return (<span style={{color: "red"}}>{approveStatus}</span>)
    case "审批中":
        return (<span style={{color: "#ffa439"}}>{approveStatus}</span>)
    default:
   return (<span >{approveStatus}</span>)
      break;
  }
}

const EditApprovalButton = (props) =>{
  // 删除和编辑按钮
  // 根据页面详情页的权限展示
  const { detailAuthority , dataId, actionFun, deleteFormData, ...rest} = props;
  const history = useHistory();
  const handleDeleteSubmisson = submissionId => {
      deleteFormData( "", submissionId)
      .then(response => {
        if(props.enterPort === "TransctionList"){
          props.fn(props.approvalKey)
        } else if(props.enterPort === "FormSubmitData"){
          props.actionFun(props.submissionId, false, props.currentForm.id)
        } else if(props.enterPort ==="Dispose") {
          history.goBack();
        }
      })
      .catch(err => {
        message.error("删除失败！", 2);
        console.log(err);
      });
  };
  return (
    props.enterPort === "FormSubmitData" ? 
    (
      <div className="toolbarBox">
        <span 
          onClick={() => {
          actionFun(dataId, true)
           }
        }><Icon component={EditIcon} style={{marginRight: 5}}/>编辑</span> 
        <span
            onClick={
              ()=>{
                handleDeleteSubmisson(dataId);
              }
            }
      ><Icon component={DeleteIcon} style={{marginRight: 5}}/>删除</span> 
      </div>
    ):(
      <></>
    )
  )
}


class FormDataDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tipVisibility: false,
      formId: this.props.id,
      submissionId: this.props.dataId,
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

  resetData = () => {
    this.props.getSubmissionDetail(
      this.state.formId,
      this.state.submissionId,
      this.props.appId
    );
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
    const { formDetail, currentForm, mobile = {}, taskData } = this.props;
    const { tabKey } = this.state;

    let newCurrentComponents = currentForm.components.filter(
      item => item.type != "CustomValue"
    );
    let operations = {}
    switch (tabKey) {
      case "formDetail":
        operations = <EditApprovalButton {...this.props} />
        break;
      case "approvelFlow":
        {
          operations = taskData.status? (<div className="approvalbox">审批状态：<ApprovalStatus approveStatus={taskData.status}/></div>):(<></>)
        }
          break;
      default:
        operations = (<></>)
        break;
    }
    let list = [];
    if(taskData.status){
      list = taskData.tasks.map(item =>{
        item.key= item.approveDate
        item.approveDate = new Date(item.approveDate).toLocaleString("chinese", { hour12: false })
        return item;
      });
    }
    let BoxStyle = {};
    if(this.props.enterPort === "Dispose"){
      BoxStyle={  width: "calc(100vw - 500px)", margin:"0 auto"}
    }
    return (
      <div className="formDetailBox" style={BoxStyle}>
        <FormDataDetailHeader
          submissionId={this.state.submissionId}
          taskData={taskData}
          resetData={this.resetData}
          {...this.props}
          />
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
            // 关联审批的才展示审批  taskData.tasks
            taskData.status  ? (
            <TabPane tab="审批流水" key="approvelFlow">
              <Table
                pagination={false}
                columns={columns}
                dataSource={list}
                size="middle"
              />
            </TabPane>
          ): null
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
    extraProp: store.formSubmitData.extraProp,
    taskData: store.formSubmitData.taskData
  }),
  {
    getSubmissionDetail,
    handleStartFlowDefinition,
    deleteFormData,
  }
)(DataDetail);
