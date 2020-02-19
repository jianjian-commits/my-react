import React, { PureComponent } from "react";
import GridLayout from 'react-grid-layout';
import { Form,Table } from "antd";
import { connect } from "react-redux";
import locationUtils from "../../../utils/locationUtils";
import { getSubmissionDetail } from "../redux/utils/getDataUtils";
import { initToken } from "../../../utils/tokenUtils";
import coverTimeUtils from '../../../utils/coverTimeUtils'

class FormDataDetail extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      tipVisibility: false,
      formId: locationUtils.getUrlParamObj().id,
      submissionId: locationUtils.getUrlParamObj().dataId,
    };
  }

  componentDidMount() {
    const { mobile = {}, mountClassNameOnRoot } = this.props;
    mobile.is && mountClassNameOnRoot(mobile.className);

    initToken()
      .then(() => {
        this.props.getSubmissionDetail(this.state.formId, this.state.submissionId);
      })
      .catch(err => {
        console.error(err);
      });
  }

  handleSubmit = e => {
    e.preventDefault();
  };

  _renderFormChildDataByType(component, submitData) {
    switch(component.type){
      case "GetLocalPosition" : return (submitData.address ? submitData.address : "");
      case "DateInput":return (submitData.time ? submitData.time : "" );
      case "FileUpload": 
      case "ImageUpload": 
      case "HandWrittenSignature": 
      return (
        <div>
        {this._renderFileData(submitData)}
        </div>
      );
      case "Address": {
        let {province, county, city, detail} = submitData;
        return [province, city, county, detail].filter(item=>item).join("");
      }
      default : return submitData;
    }
  }
  renderChildFormTest = (data,components) =>{
    let columns = components.map( component =>{
      return {
        title:component.label,
        dataIndex :component.key,
        key : component.key,
      };  
    })
    // 一条数据里有 components 里所有组件的一个记录
    let dataSource = data.map( (record,index) =>{

       let oneRecord =  components.map( component =>{
          if(component.key !== undefined && record[component.key] !== undefined ){
            let  data ={};
            data.key = Math.random();
            data[component.key] =  this._renderFormChildDataByType(component,record[component.key].data);
            return data;
          }
         
        })
        return oneRecord.reduce(function(result, current){
            return Object.assign(result, current);
          },{})
    })

    return (
      <div className="table-detail">
        <Table
        columns={columns} 
        scroll={{ x:'calc(120%)',y:90}} 
        dataSource={dataSource} 
        pagination={false} />
      </div>
    )
  }
  _truncateValue(value) {
    if (value === void 0) {
      return "";
    } else if (value.length >= 11) {
      return value.substr(0, 11) + "...";
    } else {
      return value;
    }
  }
  _renderFileData = fileData => {
    // if (fileData && fileData.name) {
    if (fileData.length>0) {
      return (
        fileData.map((item,index) => 
        <span key={index}>
        {this._truncateValue(item["name"])} 
        &nbsp; &nbsp;
        <a 
          href={item["url"]} 
          download={item["name"]} 
          style={{ textDecoration: "none" }}>
          点击下载
        </a>
      </span>
        )
       
      );
    }
    return "";
  };
  getComponentDataByType = (item, formDetail) =>{
    const { type, key} = item;
    if(formDetail[key]){
      console.log(type);
      switch(type) {
        case "GetLocalPosition" :return formDetail[key].address;
        case "DateInput":return (formDetail[key]? coverTimeUtils.localTime(formDetail[key]) : "" );
        case "FileUpload" : return (
                                      this._renderFileData(formDetail[key])
                                    );
        case "ImageUpload" : return (<img src={formDetail[key].url} height={200} />);
        case "FormChildTest" : return (this.renderChildFormTest(formDetail[key],item.values));
        case "HandWrittenSignature" :return (<img src={formDetail[key].url} height={100} />);
        case "Address": {
          let {province, county, city, detail} = formDetail[key];
          return [province, city, county, detail].filter(item=>item).join("");
        };
        default : return formDetail[key];
      }
    }
    return null;
  }

  renderFormComponent = (components, formDetail) => {
    return components.map((item) => {
      return (
        <div key={item.key}>
          <span style={{ fontWeight: 500 }}>{item.label}</span><br />
          <span>{this.getComponentDataByType(item,formDetail)}</span>
        </div>
      )
    });
  };

  render() {
    const { formDetail, currentForm, mobile = {}, title } = this.props;
    // console.log(this.props);
    let newCurrentComponents = currentForm.components.filter(item => item.type!="Button");
    let layout = newCurrentComponents.map((item) => {
      return {
        ...item.layout,
        static: true
      }
    })
    // console.log('layout',layout);
    

    return (
      <>
        <div className="formBuilder-Submission" style={{ paddingTop: 0 }}>
          <div className="Content" style={{ marginTop: 0 }}>
            <div className="submission-title">
              {currentForm.title}
            </div>
            <div className="form-layout">
              <Form onSubmit={this.handleSubmit}>
                {

                  mobile.is ?
                    this.renderFormComponent(newCurrentComponents, formDetail) :
                    <GridLayout
                      className="layout"
                      layout={layout}
                      cols={12}
                      rowHeight={10}
                      width={850}
                    >
                      {
                        this.renderFormComponent(newCurrentComponents, formDetail)
                      }
                    </GridLayout>
                }
              </Form>
            </div>
          </div>
        </div>
      </>
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
  }
)(DataDetail);