import React, { Component } from 'react'
import PhoneInput from '../component/phoneInput';
import Email from "../component/Email";
import Checkbox from "../component/checkboxInput";
import DropDown from "../component/dropDown";
import IdCard from "../component/idCard";
import SingleText from "../component/singleTextInput";
import RadioButtons from "../component/radioInput";
import NumberInput from "../component/numberInput";
import DateInput from "../component/dateInput";
import FileUpload from "../component/fileUpload";
import { initToken } from "../../../utils/tokenUtils";
import config from "../../../config/config";

export default class FormChild extends Component {
  constructor(props) {
    super(props);
    this.state = {
      components: []
    }
  }

  componentDidMount() {
    let id = this.props.item.childForm;
    if (id) {
      // initToken().then((axios) => {
        axios.get(config.apiUrl + "/form/" + id)
          .then(res => {
            this.setState({
              components: res.data.components
            });
          }).catch(err => {
            console.error(err)
          })
      // }).catch(err => {
      //   console.warn('Token 获取失败', err);
      // })
    }
    const { form, item, handleSetComponentEvent } = this.props;
    const { data } = item;
    // 是否为数据联动
    if (data && data.type == "DataLinkage") {
      const {
        conditionId, //联动条件 id(当前表单)
        linkComponentId, //联动条件 id(联动表单)
        linkDataId, //联动数据 id(联动表单)
        linkFormId, //联动表单 id
      } = data.values;
      // 得到id表单的所有提交数据
      getFormAllSubmission(linkFormId).then(submissions => {
        // 根据联动表单的组件id 得到对应所有数据
        let dataArr = filterSubmissionData(submissions, linkComponentId);
        // 为需要联动的表单添加 change事件
        handleSetComponentEvent(conditionId, (value) => {
          let index = -1;
          // 比较dataArr中是否有与value相同的值，有的话返回对应的idnex
          // 如果change数据为数组 则进行深度比较
          if(value instanceof Array) {
            index = compareEqualArray(dataArr, value);
          } else {
            index = dataArr.indexOf(value);
          }
          // 如果存在 获得提交数据中关联字段的数据
          if(index > -1) {
            let data = filterSubmissionData(submissions, linkDataId);
            // 根据查找的idnex取得对应的关联数据
            let res = data[index];
            // 设置当前组件的数据为关联的数据
            form.setFieldsValue({
              [item.key]: res
            });
            // 多级联动 事件派发
            this.handleEmitChange(res);
          } else {
            this.handleEmitChange(undefined);
          }
        });
      });
    }
  }

  // 如果存在回调数组，则遍历里面的函数执行
  handleEmitChange = (value) => {
    const { callEventArr } = this.props.item;
    if (callEventArr) {
      callEventArr.forEach(fnc => {
        fnc && fnc(value, this);
      });
    }
  }

  handleChange = ev => {
    const value = ev.target.value;
    this.handleEmitChange(value)
    setTimeout(()=>{
      let key = this.props.item.key;
      let customMessage = this.props.item.validate.customMessage;
      if(!Object.is(document.querySelector(`#${key}Dom`).querySelector(".ant-form-explain"),null)){
        document.querySelector(`#${key}Dom`).querySelector(".ant-form-explain").setAttribute('title',customMessage)
      }
    },300)
  };

  renderFormComponent = (getFieldDecorator, components, uniqueColumnData) => {
    return components.map((item, index) => {
      switch (item.type) {
        case "EmailInput":
          return <div key={item.key}>
            <Email key={item.key} getFieldDecorator={getFieldDecorator} item={item} submittedData={uniqueColumnData[item.key]} />
          </div>;
        case "PhoneInput":
          return <div key={item.key}>
            <PhoneInput key={item.key} getFieldDecorator={getFieldDecorator} item={item} submittedData={uniqueColumnData[item.key]} />
          </div>;
        case "IdCardInput":
          return <div key={item.key}>
            <IdCard key={item.key} getFieldDecorator={getFieldDecorator} item={item} submittedData={uniqueColumnData[item.key]} />
          </div>;
        case "SingleText":
          return <div key={item.key}>
            <SingleText key={item.key} getFieldDecorator={getFieldDecorator} item={item} submittedData={uniqueColumnData[item.key]} />
          </div>;
        case "NumberInput":
          return <div key={item.key}>
            <NumberInput key={item.key} getFieldDecorator={getFieldDecorator} item={item} submittedData={uniqueColumnData[item.key]} />
          </div>;
        case "RadioButtons":
          return <div key={item.key}>
            <RadioButtons key={item.key} getFieldDecorator={getFieldDecorator} item={item} />
          </div>;
          break;
        case "CheckboxInput":
          return <div key={item.key}>
            <Checkbox key={item.key} getFieldDecorator={getFieldDecorator} item={item} />
          </div>;
          break;
        case "DropDown":
          return <div key={item.key}>
            <DropDown key={item.key} getFieldDecorator={getFieldDecorator} item={item} />
          </div>;
        case "DateInput":
          return <div key={item.key}>
            <DateInput getFieldDecorator={getFieldDecorator} item={item} />
          </div>
        case "FileUpload":
          return <div key={item.key}>
            <FileUpload getFileUrl={this.getFileUrl} key={item.key} getFieldDecorator={getFieldDecorator} item={item} />
          </div>;
        case "FormChild":
          return <div key={item.key}>
            <FormChild getFileUrl={this.getFileUrl} key={item.key} getFieldDecorator={getFieldDecorator} item={item} />
          </div>;
        default:
          return <p key={index}>渲染失败</p>;
          break;
      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props;
    const components = this.state.components;

    const uniqueComponents = components.filter((component) => {
      return component.unique === true
    });

    const uniqueColumnData = {};
    for (let i = 0; i < uniqueComponents.length; i++) {
      for (let j = 0; j < formData.length; j++) {
        let submissionData = formData[j].data;
        for (var key in submissionData) {
          if (uniqueComponents[i].key === key && uniqueColumnData[key] === undefined) {
            uniqueColumnData[key] = [];
            uniqueColumnData[key].push(submissionData[key]);
          } else if (uniqueComponents[i].key === key) {
            uniqueColumnData[key].push(submissionData[key]);
          }
        }
      }
    }

    return (
      <>
        {
          this.renderFormComponent(getFieldDecorator, components, uniqueColumnData)
        }
      </>
    )
  }
}
